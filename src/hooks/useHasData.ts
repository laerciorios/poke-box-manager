'use client'

import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { usePersistedStoresHydrated } from '@/hooks/usePersistedStoresHydrated'

/**
 * Returns true if the user has any registered Pokémon, any box, or any slot
 * with content. Used to decide whether to render the landing or the
 * dashboard on the home page.
 *
 * Returns `null` while the persisted stores haven't finished rehydrating
 * from IndexedDB to avoid flashing the wrong state on initial render.
 */
export function useHasData(): boolean | null {
  const hydrated = usePersistedStoresHydrated()
  const boxes = useBoxStore((s) => s.boxes)
  const registered = usePokedexStore((s) => s.registered)

  if (!hydrated) return null

  const hasRegistered = registered.length > 0
  const hasBoxContent = boxes.some((b) => b.slots.some(Boolean))
  return hasRegistered || hasBoxContent
}
