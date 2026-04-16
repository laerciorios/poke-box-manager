import type { ExportEnvelope } from '@/lib/export/types'
import { validateExportSchema, ImportValidationError } from './schema'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { usePresetsStore } from '@/stores/usePresetsStore'

export { ImportValidationError }

export function parseImportFile(file: File): Promise<ExportEnvelope> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result
        if (typeof text !== 'string') {
          reject(new ImportValidationError('Failed to read file.'))
          return
        }
        const parsed = JSON.parse(text)
        resolve(validateExportSchema(parsed))
      } catch (err) {
        if (err instanceof ImportValidationError) {
          reject(err)
        } else {
          reject(new ImportValidationError('File is not valid JSON.'))
        }
      }
    }
    reader.onerror = () => {
      reject(new ImportValidationError('Failed to read file.'))
    }
    reader.readAsText(file)
  })
}

export function applyImportReplace(envelope: ExportEnvelope): void {
  const { boxes, registered, settings, presets } = envelope.data

  useBoxStore.setState({ boxes })
  usePokedexStore.setState({ registered })
  usePresetsStore.setState({ presets })

  // Apply settings fields individually, excluding pendingChanges
  const settingsStore = useSettingsStore.getState()
  settingsStore.setVariations(settings.variations)
  settingsStore.setActiveGenerations(settings.activeGenerations)
  settingsStore.setTheme(settings.theme)
  settingsStore.setLocale(settings.locale)
  settingsStore.setSpriteStyle(settings.spriteStyle)
  settingsStore.setShowPokemonNamesInBox(settings.showPokemonNamesInBox)
  settingsStore.setShinyTrackerEnabled(settings.shinyTrackerEnabled)
  settingsStore.setPokedexView(settings.pokedexView)

  useSettingsStore.getState().recordBackup()
}

export function applyImportMerge(envelope: ExportEnvelope): void {
  const { boxes, registered, presets } = envelope.data

  // Union registered keys
  const currentRegistered = new Set(usePokedexStore.getState().registered)
  for (const key of registered) currentRegistered.add(key)
  usePokedexStore.setState({ registered: [...currentRegistered] })

  // Append boxes by id (skip duplicates)
  const currentBoxIds = new Set(useBoxStore.getState().boxes.map((b) => b.id))
  const newBoxes = boxes.filter((b) => !currentBoxIds.has(b.id))
  useBoxStore.setState({ boxes: [...useBoxStore.getState().boxes, ...newBoxes] })

  // Append presets by id (skip duplicates)
  const currentPresetIds = new Set(usePresetsStore.getState().presets.map((p) => p.id))
  const newPresets = presets.filter((p) => !currentPresetIds.has(p.id))
  usePresetsStore.setState({ presets: [...usePresetsStore.getState().presets, ...newPresets] })

  useSettingsStore.getState().recordBackup()
}
