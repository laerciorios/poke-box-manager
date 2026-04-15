'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true when the given CSS media query matches.
 * Defaults to false during SSR to avoid hydration mismatches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    function listener(e: MediaQueryListEvent) {
      setMatches(e.matches)
    }

    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [query])

  return matches
}
