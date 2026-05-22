'use client'

import * as React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useTranslations } from 'next-intl'
import { Sprite } from '@/components/pokemon/Sprite'
import { TypeChip } from '@/components/pokemon/TypeChip'
import type { MissingEntry } from '@/lib/missing-pokemon'

interface Props {
  entries: MissingEntry[]
  evolutionReadyIds: Set<number>
  onSelect: (entry: MissingEntry) => void
}

export function MissingList({ entries, evolutionReadyIds, onSelect }: Props) {
  const t = useTranslations('Missing.row')
  const parentRef = React.useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 8,
  })

  if (entries.length === 0) {
    return (
      <div className="rounded-(--radius-xl) border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center">
        <p className="font-display text-base font-semibold mb-1">{t('emptyTitle')}</p>
        <p className="text-sm text-[var(--muted-foreground)]">{t('emptyDescription')}</p>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] overflow-y-auto"
      style={{ maxHeight: '70vh' }}
    >
      <div
        style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const entry = entries[virtualItem.index]
          const evoReady = evolutionReadyIds.has(entry.id)
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="border-b border-[var(--border)] last:border-b-0"
            >
              <button
                type="button"
                onClick={() => onSelect(entry)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface-2)]/60 focus-visible:bg-[var(--surface-2)]/60 transition-colors"
              >
                <Sprite src={entry.spriteUrl} alt={entry.name} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] tabular-nums text-[var(--muted-foreground)]">
                      #{String(entry.id).padStart(4, '0')}
                    </span>
                    <span className="text-sm font-medium truncate">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {entry.types.map((type) => (
                      <TypeChip key={type} type={type} />
                    ))}
                    <ReasonChip label={t('genReason', { n: entry.generation })} />
                    {evoReady && (
                      <ReasonChip
                        label={t('evolutionReady')}
                        accent="var(--accent)"
                      />
                    )}
                  </div>
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReasonChip({
  label,
  accent = 'var(--muted-foreground)',
}: {
  label: string
  accent?: string
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-(--radius-pill) border px-2 h-5 text-[10px] font-semibold tracking-wider uppercase"
      style={{
        borderColor: `color-mix(in oklch, ${accent} 40%, transparent)`,
        color: accent,
        backgroundColor: `color-mix(in oklch, ${accent} 8%, transparent)`,
      }}
    >
      {label}
    </span>
  )
}
