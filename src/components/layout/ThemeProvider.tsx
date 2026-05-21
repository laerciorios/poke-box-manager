'use client'

import * as React from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'

/**
 * Theme provider that reads the user's theme preference from the settings
 * store and sets data-theme on <html>. System theme follows
 * prefers-color-scheme. Defaults to dark before hydration.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((s) => s.theme)

  React.useEffect(() => {
    const root = document.documentElement
    const apply = (resolved: 'light' | 'dark') => {
      root.setAttribute('data-theme', resolved)
    }
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mq.matches ? 'dark' : 'light')
      const listener = (e: MediaQueryListEvent) => apply(e.matches ? 'dark' : 'light')
      mq.addEventListener('change', listener)
      return () => mq.removeEventListener('change', listener)
    }
    apply(theme)
  }, [theme])

  return <>{children}</>
}
