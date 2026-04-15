import { createPersistedStore } from '@/lib/store'
import type { OrganizationPreset } from '@/types/preset'
import { useSettingsStore } from '@/stores/useSettingsStore'

interface PresetsState {
  presets: OrganizationPreset[]
  getPreset: (presetId: string) => OrganizationPreset | undefined
  createPreset: (preset: Omit<OrganizationPreset, 'id'>) => void
  updatePreset: (
    presetId: string,
    changes: Partial<OrganizationPreset>,
  ) => void
  deletePreset: (presetId: string) => void
  duplicatePreset: (presetId: string) => void
}

export const usePresetsStore = createPersistedStore<PresetsState>(
  'presets',
  (set, get) => ({
    presets: [],

    getPreset: (presetId) => {
      return get().presets.find((p) => p.id === presetId)
    },

    createPreset: (preset) => {
      const newPreset: OrganizationPreset = {
        ...preset,
        id: crypto.randomUUID(),
      }
      set({ presets: [...get().presets, newPreset] })
      useSettingsStore.getState().recordChange()
    },

    updatePreset: (presetId, changes) => {
      set({
        presets: get().presets.map((p) => {
          if (p.id !== presetId || p.isBuiltIn) return p
          return { ...p, ...changes, id: p.id, isBuiltIn: p.isBuiltIn }
        }),
      })
      useSettingsStore.getState().recordChange()
    },

    deletePreset: (presetId) => {
      set({
        presets: get().presets.filter(
          (p) => p.id !== presetId || p.isBuiltIn,
        ),
      })
      useSettingsStore.getState().recordChange()
    },

    duplicatePreset: (presetId) => {
      const original = get().presets.find((p) => p.id === presetId)
      if (!original) return
      const duplicate: OrganizationPreset = {
        ...original,
        id: crypto.randomUUID(),
        name: `${original.name} (Copy)`,
        isBuiltIn: false,
      }
      set({ presets: [...get().presets, duplicate] })
      useSettingsStore.getState().recordChange()
    },
  }),
  { version: 1 },
)
