'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { FadeIn } from '@/components/motion'
import type { BoxHeatmapEntry } from '@/hooks/useStatsData'

interface Props {
  entries: BoxHeatmapEntry[]
}

const STATE_STYLE = {
  complete: {
    bg: 'var(--registered-soft)',
    border: 'color-mix(in oklch, var(--registered) 40%, transparent)',
    dot: 'var(--registered)',
  },
  partial: {
    bg: 'color-mix(in oklch, var(--warning) 14%, transparent)',
    border: 'color-mix(in oklch, var(--warning) 40%, transparent)',
    dot: 'var(--warning)',
  },
  empty: {
    bg: 'var(--surface-2)',
    border: 'var(--border)',
    dot: 'var(--muted-foreground)',
  },
} as const

export function BoxHeatmap({ entries }: Props) {
  const t = useTranslations('Stats')
  const reduce = useReducedMotion()

  if (entries.length === 0) {
    return (
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-2">
          <h3 className="font-display text-base font-semibold tracking-tight">
            {t('heatmap.title')}
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {t('heatmap.description')}
          </p>
        </div>
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          {t('heatmap.empty')}
        </p>
      </div>
    )
  }

  return (
    <FadeIn delay={0.15}>
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display text-base font-semibold tracking-tight">
              {t('heatmap.title')}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {t('heatmap.description')}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)]">
            <LegendDot color={STATE_STYLE.complete.dot} label={t('heatmap.complete')} />
            <LegendDot color={STATE_STYLE.partial.dot} label={t('heatmap.partial')} />
            <LegendDot color={STATE_STYLE.empty.dot} label={t('heatmap.empty')} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {entries.map((entry, idx) => {
            const style = STATE_STYLE[entry.state]
            const pct = entry.total > 0 ? Math.round((entry.registered / entry.total) * 100) : 0
            return (
              <motion.div
                key={entry.id}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        duration: 0.3,
                        delay: Math.min(idx * 0.012, 0.4),
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
              >
                <Link
                  href={`/boxes#${entry.id}`}
                  className="block rounded-(--radius-md) border px-3 py-3 text-left lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                  style={{
                    backgroundColor: style.bg,
                    borderColor: style.border,
                  }}
                  aria-label={t('heatmap.cardLabel', {
                    name: entry.name,
                    registered: entry.registered,
                    total: entry.total,
                    state: t(`heatmap.${entry.state}`),
                  })}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className="inline-block size-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: style.dot }}
                      aria-hidden
                    />
                    <span className="text-xs font-medium truncate">{entry.name}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono tabular-nums text-[11px] text-[var(--muted-foreground)]">
                      {entry.registered}/{entry.total}
                    </span>
                    <span className="font-display text-base font-semibold tabular-nums">
                      {pct}
                      <span className="text-[var(--muted-foreground)] text-xs">%</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </FadeIn>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block size-1.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </span>
  )
}
