import { get, set, del } from 'idb-keyval'
import type { StateStorage } from 'zustand/middleware'

export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return (await get(name)) ?? null
    } catch {
      return null
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await set(name, value)
    } catch {
      // no-op if IndexedDB is unavailable
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await del(name)
    } catch {
      // no-op if IndexedDB is unavailable
    }
  },
}
