'use client'

import * as React from 'react'
import { useBoxStore } from '@/stores/useBoxStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { usePresetsStore } from '@/stores/usePresetsStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useTagsStore } from '@/stores/useTagsStore'

// `persist` exposes its rehydration state on each store. We use the
// `hasHydrated()` method when available and fall back to `onFinishHydration`
// for the initial sync. Returning a single boolean keeps consumer code simple.
type PersistedStore = {
  persist: {
    hasHydrated: () => boolean
    onFinishHydration: (cb: () => void) => () => void
  }
}

const STORES = [
  useBoxStore,
  usePokedexStore,
  usePresetsStore,
  useSettingsStore,
  useTagsStore,
  useHistoryStore,
] as unknown as PersistedStore[]

/**
 * Returns true once all persisted Zustand stores have finished rehydrating
 * from IndexedDB. Use this to gate skeleton ↔ real-UI transitions so that
 * pages don't flash an empty state before data is available.
 *
 * Must start as `false` on both server and client to avoid a hydration
 * mismatch — Zustand's `persist.hasHydrated()` returns `true` on the server
 * (no storage to wait for) but `false` on the client until rehydration
 * completes, which would otherwise diverge.
 */
export function usePersistedStoresHydrated(): boolean {
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const check = () => {
      if (STORES.every((s) => s.persist.hasHydrated())) {
        setHydrated(true)
      }
    }
    check()
    const unsubs = STORES.map((s) => s.persist.onFinishHydration(check))
    return () => {
      for (const u of unsubs) u()
    }
  }, [])

  return hydrated
}
