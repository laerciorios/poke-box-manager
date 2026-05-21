'use client'

import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import * as React from 'react'

/**
 * Returns true if the user has any registered Pokémon, any box, or any slot
 * with content. Used to decide whether to render the landing or the
 * dashboard on the home page.
 *
 * Returns `null` while the store hasn't hydrated from IndexedDB to avoid
 * flashing the wrong state on initial render.
 */
export function useHasData(): boolean | null {
  const [hydrated, setHydrated] = React.useState(false)
  const boxes = useBoxStore((s) => s.boxes)
  const registered = usePokedexStore((s) => s.registered)

  React.useEffect(() => {
    // Both stores persist; wait one tick after mount so that the persist
    // middleware has finished rehydrating IndexedDB.
    const id = window.setTimeout(() => setHydrated(true), 0)
    return () => window.clearTimeout(id)
  }, [])

  if (!hydrated) return null

  const hasRegistered = registered.length > 0
  const hasBoxContent = boxes.some((b) => b.slots.some(Boolean))
  return hasRegistered || hasBoxContent
}
