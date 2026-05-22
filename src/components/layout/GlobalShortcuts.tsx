'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

// Both overlays are deferred — the user opens them with explicit shortcuts,
// so their JS shouldn't be in the initial bundle.
const ShortcutsOverlay = dynamic(
  () => import('@/components/layout/ShortcutsOverlay').then((m) => m.ShortcutsOverlay),
  { ssr: false },
)
const CommandPalette = dynamic(
  () => import('@/components/layout/CommandPalette').then((m) => m.CommandPalette),
  { ssr: false },
)

/**
 * Mounts the keyboard-driven overlays (? = shortcuts sheet, ⌘K = command
 * palette) and listens for their triggers globally. Shortcuts only fire when
 * the user isn't typing in a text field — same convention as the history
 * controller.
 */
export function GlobalShortcuts() {
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false)
  const [paletteOpen, setPaletteOpen] = React.useState(false)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const inEditable =
        !!target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          target.isContentEditable)

      // ⌘/Ctrl + K → command palette (allowed even when typing — it's a
      // navigation tool, not text input)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((p) => !p)
        return
      }

      // `?` / Shift+/ → shortcuts overlay (skip when typing in a field)
      if (e.key === '?' && !inEditable) {
        e.preventDefault()
        setShortcutsOpen((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
