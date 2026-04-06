import { createPersistedStore } from '@/lib/store'

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
    },

    isRegistered: (pokemonId, formId) => {
      const key = makeKey(pokemonId, formId)
      return get().registered.includes(key)
    },

    registerAll: (keys) => {
      const current = new Set(get().registered)
      for (const key of keys) current.add(key)
      set({ registered: [...current] })
    },

    unregisterAll: (keys) => {
      const toRemove = new Set(keys)
      set({ registered: get().registered.filter((k) => !toRemove.has(k)) })
    },

    clearAll: () => {
      set({ registered: [] })
    },
  }),
  { version: 1 },
)
