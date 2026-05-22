'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/dialog'

interface Props {
  open: boolean
  onClose: () => void
}

/**
 * Reference sheet for all keyboard shortcuts. Triggered globally via `?`
 * (Shift+/), closed via Esc. Lists only what actually works — keeping it
 * honest beats stuffing it with aspirational bindings.
 */
export function ShortcutsOverlay({ open, onClose }: Props) {
  const t = useTranslations('Shortcuts')

  const groups: { title: string; items: { keys: string[]; label: string }[] }[] = [
    {
      title: t('groups.global'),
      items: [
        { keys: ['?'], label: t('items.toggleOverlay') },
        { keys: ['⌘', 'K'], label: t('items.search') },
        { keys: ['⌘', 'H'], label: t('items.history') },
        { keys: ['⌘', 'Z'], label: t('items.undo') },
        { keys: ['Esc'], label: t('items.closeModal') },
      ],
    },
    {
      title: t('groups.boxes'),
      items: [
        { keys: ['←', '→'], label: t('items.navigateBoxes') },
        { keys: ['Space'], label: t('items.dndPickup') },
        { keys: ['Esc'], label: t('items.dndCancel') },
      ],
    },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="md"
      title={t('title')}
      description={t('subtitle')}
    >
      <div className="space-y-5">
        {groups.map((group) => (
          <section key={group.title}>
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)] mb-2">
              {group.title}
            </p>
            <ul className="space-y-1.5">
              {group.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-md hover:bg-[var(--surface-2)]/60"
                >
                  <span className="text-sm text-[var(--foreground)]">{item.label}</span>
                  <span className="flex items-center gap-1">
                    {item.keys.map((k, j) => (
                      <React.Fragment key={j}>
                        {j > 0 && (
                          <span className="text-[10px] text-[var(--muted-foreground)]">+</span>
                        )}
                        <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded border border-[var(--border-strong)] bg-[var(--surface)] text-[11px] font-mono">
                          {k}
                        </kbd>
                      </React.Fragment>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Dialog>
  )
}
