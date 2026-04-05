import { create, type StateCreator } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'

export function createPersistedStore<T>(
  name: string,
  initializer: StateCreator<T, [], [['zustand/persist', T]]>,
  options?: Partial<PersistOptions<T>>,
) {
  return create<T>()(
    persist(initializer, {
      name,
      ...options,
    }),
  )
}
