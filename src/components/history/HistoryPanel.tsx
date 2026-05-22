'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  Undo2,
  Trash2,
  X,
  Plus,
  Minus,
  Layers,
  Move,
  ArrowUpDown,
  PackageOpen,
  History as HistoryIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { formatRelativeTime } from '@/lib/relative-time'
import { Button } from '@/components/ui/button'
import type { ActionType, ActivityEntry } from '@/types/history'

interface Props {
  open: boolean
  onClose: () => void
}

const ACTION_ICON: Record<ActionType, React.ComponentType<{ className?: string }>> = {
  register: Plus,
  unregister: Minus,
  'bulk-register': Layers,
  'bulk-unregister': PackageOpen,
  'move-slot': Move,
  'reorder-box': ArrowUpDown,
  'preset-apply': Layers,
}

const ACTION_COLOR: Record<ActionType, string> = {
  register: 'var(--registered)',
  unregister: 'var(--muted-foreground)',
  'bulk-register': 'var(--registered)',
  'bulk-unregister': 'var(--muted-foreground)',
  'move-slot': 'var(--accent)',
  'reorder-box': 'var(--accent)',
  'preset-apply': 'var(--shiny)',
}

export function HistoryPanel({ open, onClose }: Props) {
  const t = useTranslations('History')
  const tCommon = useTranslations('Common')
  const entries = useHistoryStore((s) => s.entries)
  const undoEntry = useHistoryStore((s) => s.undoEntry)
  const clearHistory = useHistoryStore((s) => s.clearHistory)
  const locale = useSettingsStore((s) => s.locale)
  const reduce = useReducedMotion()

  const [confirmClear, setConfirmClear] = React.useState(false)

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Close confirm dialog when panel closes
  React.useEffect(() => {
    if (!open) setConfirmClear(false)
  }, [open])

  const handleClear = () => {
    clearHistory()
    setConfirmClear(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
            className="fixed right-0 top-0 z-50 h-svh w-[min(420px,92vw)] bg-[var(--card)] border-l border-[var(--border)] shadow-[var(--shadow-pop)] flex flex-col"
            initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
            transition={reduce ? { duration: 0 } : { duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 min-w-0">
                <HistoryIcon className="size-4 text-[var(--muted-foreground)] shrink-0" />
                <div className="min-w-0">
                  <h2 className="font-display text-base font-semibold tracking-tight truncate">
                    {t('title')}
                  </h2>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">
                    {t('subtitle', { count: entries.length })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label={tCommon('close')}
              >
                <X className="size-4" />
              </Button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {entries.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <div className="mx-auto size-10 rounded-md bg-[var(--surface-2)] grid place-items-center text-[var(--muted-foreground)] mb-3">
                    <HistoryIcon className="size-5" />
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{t('empty')}</p>
                </div>
              ) : (
                <ol className="divide-y divide-[var(--border)]">
                  {entries.slice(0, 50).map((entry, idx) => (
                    <HistoryRow
                      key={entry.id}
                      entry={entry}
                      isLatest={idx === 0}
                      locale={locale}
                      onUndo={() => undoEntry(entry.id)}
                      undoLabel={t('undo')}
                    />
                  ))}
                </ol>
              )}
            </div>

            {entries.length > 0 && (
              <footer className="border-t border-[var(--border)] px-5 py-3 flex items-center justify-between gap-2 bg-[var(--surface-2)]/40">
                <p className="text-xs text-[var(--muted-foreground)]">
                  {t('shortcuts')}
                </p>
                {confirmClear ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmClear(false)}
                    >
                      {tCommon('cancel')}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleClear}>
                      {t('confirmClear')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmClear(true)}
                  >
                    <Trash2 className="size-3.5" />
                    {t('clear')}
                  </Button>
                )}
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function HistoryRow({
  entry,
  isLatest,
  locale,
  onUndo,
  undoLabel,
}: {
  entry: ActivityEntry
  isLatest: boolean
  locale: 'pt-BR' | 'en'
  onUndo: () => void
  undoLabel: string
}) {
  const Icon = ACTION_ICON[entry.actionType]
  const color = ACTION_COLOR[entry.actionType]

  // Re-render the relative timestamp every 60s so "agora" rolls forward.
  const [, force] = React.useReducer((n: number) => n + 1, 0)
  React.useEffect(() => {
    const id = window.setInterval(force, 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <li className="px-5 py-3 flex items-start gap-3 group">
      <div
        className="size-8 rounded-md grid place-items-center shrink-0"
        style={{
          backgroundColor: `color-mix(in oklch, ${color} 14%, transparent)`,
          color,
        }}
        aria-hidden
      >
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">{entry.description}</p>
        <p className="text-[11px] font-mono text-[var(--muted-foreground)] mt-0.5 tabular-nums">
          {formatRelativeTime(entry.timestamp, locale)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        aria-label={undoLabel}
        title={isLatest ? `${undoLabel} (⌘Z)` : undoLabel}
        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
      >
        <Undo2 className="size-4" />
      </Button>
    </li>
  )
}
