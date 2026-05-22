'use client'

import * as React from 'react'

/**
 * Loads @axe-core/react only in development, and only on the client. Violations
 * are logged to the browser console. Stripped from production builds by the
 * NODE_ENV guard, which dead-codes the dynamic import.
 */
export function AxeDevRunner() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    if (typeof window === 'undefined') return

    let cancelled = false
    Promise.all([import('react'), import('react-dom'), import('@axe-core/react')]).then(
      ([React, ReactDOM, axeMod]) => {
        if (cancelled) return
        const axe = (axeMod.default ?? axeMod) as (
          react: typeof React,
          dom: typeof ReactDOM,
          ms: number,
        ) => void
        try {
          axe(React, ReactDOM, 1000)
        } catch {
          // axe sometimes throws when called twice across HMR — ignore.
        }
      },
    )
    return () => {
      cancelled = true
    }
  }, [])

  return null
}
