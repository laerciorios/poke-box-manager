'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface ContextMenuItem {
  label: string
  onSelect: () => void
  destructive?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}

interface ContextMenuProps {
  open: boolean
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

/** Headless-ish floating context menu. Closes on outside click, Esc, or item select. */
export function ContextMenu({ open, x, y, items, onClose }: ContextMenuProps) {
  const reduce = useReducedMotion()
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [pos, setPos] = React.useState({ x, y })

  React.useEffect(() => {
    if (!open) return
    // Clamp menu to viewport.
    const onFrame = () => {
      const el = menuRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const pad = 8
      let nx = x
      let ny = y
      if (nx + rect.width > window.innerWidth - pad) nx = window.innerWidth - rect.width - pad
      if (ny + rect.height > window.innerHeight - pad) ny = window.innerHeight - rect.height - pad
      setPos({ x: Math.max(pad, nx), y: Math.max(pad, ny) })
    }
    onFrame()
    const raf = requestAnimationFrame(onFrame)
    return () => cancelAnimationFrame(raf)
  }, [open, x, y])

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onClose, true)
    window.addEventListener('resize', onClose)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onClose, true)
      window.removeEventListener('resize', onClose)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          role="menu"
          initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
          transition={reduce ? { duration: 0 } : { duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'fixed', top: pos.y, left: pos.x, zIndex: 70, minWidth: 200 }}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-pop)] py-1"
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return
                item.onSelect()
                onClose()
              }}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
                'hover:bg-[var(--surface-2)] focus:bg-[var(--surface-2)] focus:outline-none',
                item.destructive && 'text-[var(--destructive)] hover:bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)]',
                item.disabled && 'opacity-40 cursor-not-allowed',
              )}
            >
              {item.icon && (
                <span className="text-[var(--muted-foreground)] [&>svg]:size-3.5">{item.icon}</span>
              )}
              <span className="flex-1">{item.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
