'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Box } from '@/types/box'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { BOX_LABEL_COLORS } from '@/lib/box-label-colors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  boxes: Box[]
  activeIndex: number
  onSelect: (index: number) => void
}

/**
 * Right-anchored sheet listing every box as a 6×5 mini-preview.
 * Each mini-grid uses dots for filled slots (green = registered, neutral =
 * unregistered) and faint outlines for empty slots — enough to recognize
 * the box at a glance without sprite assets.
 *
 * Click a card → selects that box and closes the drawer.
 * Search input filters by name. Esc closes.
 */
export function BoxOverviewDrawer({
  open,
  onClose,
  boxes,
  activeIndex,
  onSelect,
}: Props) {
  const t = useTranslations('Boxes.overview')
  const tCommon = useTranslations('Common')
  const reduce = useReducedMotion()
  const [query, setQuery] = React.useState('')

  React.useEffect(() => {
    if (!open) return
    setQuery('')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return boxes
      .map((box, originalIndex) => ({ box, originalIndex }))
      .filter(({ box }) => !q || box.name.toLowerCase().includes(q))
  }, [boxes, query])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.18 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[min(560px,92vw)] bg-[var(--background)] border-l border-[var(--border)] shadow-[var(--shadow-pop)] flex flex-col"
            initial={reduce ? { opacity: 1 } : { x: '100%' }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={reduce ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border)]">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)]">
                  {t('eyebrow')}
                </p>
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  {t('title')}
                </h2>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                aria-label={tCommon('close')}
              >
                <X className="size-4" />
              </Button>
            </header>

            <div className="px-5 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)] pointer-events-none" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="pl-9 h-9"
                />
              </div>
              <p className="mt-2 text-[11px] font-mono text-[var(--muted-foreground)] tabular-nums">
                {t('count', { n: filtered.length, total: boxes.length })}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {filtered.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)] text-center py-12">
                  {t('empty')}
                </p>
              ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {filtered.map(({ box, originalIndex }) => (
                    <li key={box.id}>
                      <BoxMiniCard
                        box={box}
                        active={originalIndex === activeIndex}
                        onClick={() => {
                          onSelect(originalIndex)
                          onClose()
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function BoxMiniCard({
  box,
  active,
  onClick,
}: {
  box: Box
  active: boolean
  onClick: () => void
}) {
  // Derive registered flags from the Pokédex store so the heatmap dots stay
  // in sync even when nothing has explicitly rewritten slot.registered.
  const pokedexRegistered = usePokedexStore((s) => s.registered)
  const registeredSet = React.useMemo(() => new Set(pokedexRegistered), [pokedexRegistered])
  const slotIsRegistered = (slot: Box['slots'][number]) => {
    if (!slot) return false
    const key = slot.formId ? `${slot.pokemonId}:${slot.formId}` : String(slot.pokemonId)
    return registeredSet.has(key)
  }

  const filled = box.slots.filter(Boolean).length
  const registered = box.slots.filter((s) => slotIsRegistered(s)).length
  const ringClass = box.label ? BOX_LABEL_COLORS[box.label] : ''

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group w-full rounded-md border bg-[var(--card)] p-2.5 text-left transition-all duration-150',
        'hover:border-[var(--border-strong)] hover:-translate-y-0.5',
        active ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30' : 'border-[var(--border)]',
      )}
      aria-current={active ? 'true' : undefined}
    >
      <div className="flex items-center gap-1.5 mb-2 min-w-0">
        {box.label && (
          <span
            className={cn('size-1.5 rounded-full shrink-0', ringClass)}
            style={{ backgroundColor: 'currentColor' }}
            aria-hidden
          />
        )}
        <p className="text-xs font-medium truncate flex-1 min-w-0">{box.name}</p>
      </div>
      <div className="grid grid-cols-6 gap-0.5 aspect-[6/5]">
        {box.slots.map((slot, i) => (
          <span
            key={i}
            className={cn(
              'rounded-[2px]',
              !slot
                ? 'bg-[var(--surface-2)] border border-dashed border-[var(--border)]/60'
                : slotIsRegistered(slot)
                  ? 'bg-[var(--registered)]'
                  : 'bg-[var(--muted-foreground)]/30',
            )}
            aria-hidden
          />
        ))}
      </div>
      <p className="mt-2 text-[10px] font-mono text-[var(--muted-foreground)] tabular-nums">
        {registered}/{filled || 0} · {filled}/30
      </p>
    </button>
  )
}
