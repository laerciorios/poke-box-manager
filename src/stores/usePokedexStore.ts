import { createPersistedStore } from '@/lib/store'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { buildDescription } from '@/lib/history-descriptions'

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
      const wasRegistered = current.has(key)
      if (wasRegistered) {
        current.delete(key)
      } else {
        current.add(key)
      }
      set({ registered: [...current] })
      useSettingsStore.getState().recordChange()
      const actionType = wasRegistered ? 'unregister' : 'register'
      const undoPayload = wasRegistered
        ? ({ type: 'unregister', key } as const)
        : ({ type: 'register', key } as const)
      const locale = useSettingsStore.getState().locale
      useHistoryStore.getState().pushEntry({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        actionType,
        description: buildDescription(actionType, undoPayload, locale),
        undoPayload,
      })
    },

    isRegistered: (pokemonId, formId) => {
      const key = makeKey(pokemonId, formId)
      return get().registered.includes(key)
    },

    registerAll: (keys) => {
      const current = new Set(get().registered)
      const netNew = keys.filter((k) => !current.has(k))
      for (const key of keys) current.add(key)
      set({ registered: [...current] })
      useSettingsStore.getState().recordChange()
      if (netNew.length > 0) {
        const undoPayload = { type: 'bulk-register', keys: netNew } as const
        const locale = useSettingsStore.getState().locale
        useHistoryStore.getState().pushEntry({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          actionType: 'bulk-register',
          description: buildDescription('bulk-register', undoPayload, locale),
          undoPayload,
        })
      }
    },

    unregisterAll: (keys) => {
      const toRemove = new Set(keys)
      const actuallyRemoved = get().registered.filter((k) => toRemove.has(k))
      set({ registered: get().registered.filter((k) => !toRemove.has(k)) })
      useSettingsStore.getState().recordChange()
      if (actuallyRemoved.length > 0) {
        const undoPayload = { type: 'bulk-unregister', keys: actuallyRemoved } as const
        const locale = useSettingsStore.getState().locale
        useHistoryStore.getState().pushEntry({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          actionType: 'bulk-unregister',
          description: buildDescription('bulk-unregister', undoPayload, locale),
          undoPayload,
        })
      }
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
