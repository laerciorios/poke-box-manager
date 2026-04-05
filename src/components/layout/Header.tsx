'use client'

import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-end border-b border-border bg-surface px-4 lg:px-6">
      <ThemeToggle />
    </header>
  )
}
