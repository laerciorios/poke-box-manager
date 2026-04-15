'use client'

import type { ExportEnvelope } from './types'
import type { Locale } from '@/types/locale'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { usePresetsStore } from '@/stores/usePresetsStore'
import pokemonData from '@/data/pokemon.json'

export function buildExportPayload(): ExportEnvelope {
  const { boxes } = useBoxStore.getState()
  const { registered } = usePokedexStore.getState()
  const { presets } = usePresetsStore.getState()
  const {
    variations,
    activeGenerations,
    theme,
    locale,
    spriteStyle,
    autoSave,
    lastBackup,
    showPokemonNamesInBox,
    sidebarCollapsed,
    shinyTrackerEnabled,
    pokedexView,
  } = useSettingsStore.getState()

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'poke-box-manager',
    data: {
      boxes,
      registered,
      settings: {
        variations,
        activeGenerations,
        theme,
        locale,
        spriteStyle,
        autoSave,
        lastBackup,
        showPokemonNamesInBox,
        sidebarCollapsed,
        shinyTrackerEnabled,
        pokedexView,
      },
      presets,
    },
  }
}

export function downloadJson(payload: ExportEnvelope): void {
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `poke-box-manager-${date}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
  useSettingsStore.getState().recordBackup()
}

type PokemonEntry = { id: number; name: string; names: Record<string, string> }

export function exportMissingText(registered: string[], locale: Locale): string {
  const registeredSet = new Set(registered)
  const missing = (pokemonData as PokemonEntry[])
    .filter((p) => !registeredSet.has(String(p.id)))
    .sort((a, b) => a.id - b.id)
    .map((p) => {
      const name = p.names[locale] ?? p.names['en'] ?? p.name
      const num = String(p.id).padStart(4, '0')
      return `#${num} ${name}`
    })
  return missing.join('\n')
}

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
