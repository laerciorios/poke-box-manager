'use client'

import { useSyncExternalStore } from 'react'

/**
 * Returns true when the given CSS media query matches.
 * Uses useSyncExternalStore so the initial render and subscription stay
 * consistent without setState-in-effect cascades.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined') return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches),
    () => false,
  )
}
