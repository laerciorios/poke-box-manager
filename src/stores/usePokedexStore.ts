import { createPersistedStore } from '@/lib/store'
import { useSettingsStore } from '@/stores/useSettingsStore'

interface PokedexState {
  registered: string[]
  toggleRegistered: (pokemonId: number, formId?: string) => void
  isRegistered: (pokemonId: number, formId?: string) => boolean
  registerAll: (keys: string[]) => void
  unregisterAll: (keys: string[]) => void
  clearAll: () => void
}

function makeKey(pokemonId: number, formId?: string): string {
  return formId ? `${pokemonId}:${formId}` : `${pokemonId}`
}

export const usePokedexStore = createPersistedStore<PokedexState>(
  'pokedex',
  (set, get) => ({
    registered: [],

    toggleRegistered: (pokemonId, formId) => {
      const key = makeKey(pokemonId, formId)
      const current = new Set(get().registered)
      if (current.has(key)) {
        current.delete(key)
      } else {
        current.add(key)
      }
      set({ registered: [...current] })
      useSettingsStore.getState().recordChange()
    },

    isRegistered: (pokemonId, formId) => {
      const key = makeKey(pokemonId, formId)
      return get().registered.includes(key)
    },

    registerAll: (keys) => {
      const current = new Set(get().registered)
      for (const key of keys) current.add(key)
      set({ registered: [...current] })
      useSettingsStore.getState().recordChange()
    },

    unregisterAll: (keys) => {
      const toRemove = new Set(keys)
      set({ registered: get().registered.filter((k) => !toRemove.has(k)) })
      useSettingsStore.getState().recordChange()
    },

    clearAll: () => {
      set({ registered: [] })
      useSettingsStore.getState().recordChange()
    },
  }),
  {
    version: 3,
    migrate: (persisted: unknown, fromVersion: number) => {
      const state = persisted as Record<string, unknown>
      // v2 introduced registeredShiny — now removed (shiny lives on slot.shiny in BoxStore)
      if (fromVersion < 3) {
        delete state.registeredShiny
      }
      return state as unknown as PokedexState
    },
  },
)
