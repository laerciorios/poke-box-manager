import { createPersistedStore } from '@/lib/store'
import type { SettingsState, SpriteStyle, VariationToggles, PokedexView } from '@/types/settings'
import { DEFAULT_SETTINGS } from '@/types/settings'
import type { Locale } from '@/types/locale'

interface SettingsActions {
  setVariation: (key: keyof VariationToggles, value: boolean) => void
  setVariations: (toggles: Partial<VariationToggles>) => void
  setActiveGenerations: (generations: number[]) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLocale: (locale: Locale) => void
  setSpriteStyle: (style: SpriteStyle) => void
  setShowPokemonNamesInBox: (value: boolean) => void
  toggleSidebar: () => void
  resetSettings: () => void
  setShinyTrackerEnabled: (value: boolean) => void
  setPokedexView: (view: PokedexView) => void
  recordChange: () => void
  recordBackup: () => void
}

type SettingsStore = SettingsState & SettingsActions

export const useSettingsStore = createPersistedStore<SettingsStore>(
  'settings',
  (set) => ({
    ...DEFAULT_SETTINGS,

    setVariation: (key, value) => {
      set((state) => ({
        variations: { ...state.variations, [key]: value },
      }))
    },

    setVariations: (toggles) => {
      set((state) => ({
        variations: { ...state.variations, ...toggles },
      }))
    },

    setActiveGenerations: (generations) => {
      set({ activeGenerations: generations })
    },

    setTheme: (theme) => {
      set({ theme })
    },

    setLocale: (locale) => {
      set({ locale })
    },

    setSpriteStyle: (style) => {
      set({ spriteStyle: style })
    },

    setShowPokemonNamesInBox: (value) => {
      set({ showPokemonNamesInBox: value })
    },

    toggleSidebar: () => {
      set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
    },

    resetSettings: () => {
      set({ ...DEFAULT_SETTINGS })
    },

    setShinyTrackerEnabled: (value) => {
      set({ shinyTrackerEnabled: value })
    },

    setPokedexView: (view) => {
      set({ pokedexView: view })
    },

    recordChange: () => {
      set((state) => ({ pendingChanges: state.pendingChanges + 1 }))
    },

    recordBackup: () => {
      set({ lastBackup: new Date().toISOString(), pendingChanges: 0 })
    },
  }),
  {
    version: 5,
    migrate: (persisted: unknown, fromVersion: number) => {
      const state = persisted as Record<string, unknown>
      if (fromVersion < 2) {
        delete state.gameFilter
        delete state.activeGames
      }
      if (fromVersion < 3) {
        state.shinyTrackerEnabled ??= false
      }
      if (fromVersion < 4) {
        state.pokedexView ??= 'table'
      }
      if (fromVersion < 5) {
        state.pendingChanges ??= 0
      }
      return state as unknown as SettingsStore
    },
  },
)
