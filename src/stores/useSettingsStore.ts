import { createPersistedStore } from '@/lib/store'
import type { SettingsState, SpriteStyle, VariationToggles } from '@/types/settings'
import { DEFAULT_SETTINGS } from '@/types/settings'
import type { Locale } from '@/types/locale'
import type { GameId } from '@/types/game'

interface SettingsActions {
  setVariation: (key: keyof VariationToggles, value: boolean) => void
  setVariations: (toggles: Partial<VariationToggles>) => void
  setActiveGenerations: (generations: number[]) => void
  setGameFilter: (mode: 'switch-only' | 'all') => void
  setActiveGames: (games: GameId[]) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLocale: (locale: Locale) => void
  setSpriteStyle: (style: SpriteStyle) => void
  setShowPokemonNamesInBox: (value: boolean) => void
  toggleSidebar: () => void
  resetSettings: () => void
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

    setGameFilter: (mode) => {
      set({ gameFilter: mode })
    },

    setActiveGames: (games) => {
      set({ activeGames: games })
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
  }),
  { version: 1 },
)
