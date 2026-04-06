import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware'
import { indexedDBStorage } from './indexeddb-storage'

export function createPersistedStore<T>(
  name: string,
  initializer: StateCreator<T, [], [['zustand/persist', T]]>,
  options?: Partial<PersistOptions<T>>,
) {
  return create<T>()(
    persist(initializer, {
      name,
      storage: createJSONStorage<T>(() => indexedDBStorage),
      ...options,
    }),
  )
}
