'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { TYPE_COLORS } from '@/lib/type-colors'
import { TypeChip } from '@/components/pokemon/TypeChip'
import { FadeIn } from '@/components/motion'
import type { TypeStat } from '@/hooks/useStatsData'

// Canonical type order — matches the order most fans expect to see types listed.
const CANONICAL_TYPE_ORDER = [
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const

interface Props {
  data: TypeStat[]
}

export function TypeProgressGrid({ data }: Props) {
  const t = useTranslations('Stats')
  const reduce = useReducedMotion()

  const byType = new Map(data.map((d) => [d.type, d]))
  const ordered = CANONICAL_TYPE_ORDER.map((type) => {
    const stat = byType.get(type)
    return {
      type,
      registered: stat?.registered ?? 0,
      total: stat?.total ?? 0,
    }
  })

  return (
    <FadeIn delay={0.2}>
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-4">
          <h3 className="font-display text-base font-semibold tracking-tight">
            {t('types.title')}
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {t('types.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {ordered.map((entry, idx) => {
            const color = TYPE_COLORS[entry.type] ?? '#999'
            const pct =
              entry.total > 0 ? Math.round((entry.registered / entry.total) * 100) : 0

            return (
              <motion.div
                key={entry.type}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        duration: 0.3,
                        delay: Math.min(idx * 0.02, 0.4),
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
                className="rounded-(--radius-md) border border-[var(--border)] bg-[var(--surface)] p-3"
                style={{
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <TypeChip type={entry.type} />
                  <span className="font-display text-base font-semibold tabular-nums">
                    {pct}
                    <span className="text-[var(--muted-foreground)] text-xs">%</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-mono tabular-nums text-[var(--muted-foreground)]">
                    {entry.registered} / {entry.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={
                      reduce ? { width: `${pct}%` } : { width: 0 }
                    }
                    animate={{ width: `${pct}%` }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { duration: 0.8, delay: 0.2 + idx * 0.015, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </FadeIn>
  )
}
