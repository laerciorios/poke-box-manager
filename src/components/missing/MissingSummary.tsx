'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from '@/components/motion'
import type { MissingEntry } from '@/lib/missing-pokemon'

interface Props {
  total: number
  entries: MissingEntry[]
  activeGenerations: number[]
}

export function MissingSummary({ total, entries, activeGenerations }: Props) {
  const t = useTranslations('Missing.summary')

  const perGen = new Map<number, number>()
  for (const gen of activeGenerations) perGen.set(gen, 0)
  for (const entry of entries) {
    perGen.set(entry.generation, (perGen.get(entry.generation) ?? 0) + 1)
  }

  return (
    <FadeIn>
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)]">
          {t('eyebrow')}
        </p>
        <p className="font-display text-2xl md:text-3xl font-semibold tracking-tight tabular-nums mt-1">
          {t('total', { count: total })}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {activeGenerations.map((gen) => {
            const count = perGen.get(gen) ?? 0
            return (
              <span
                key={gen}
                className="inline-flex items-center gap-1.5 rounded-(--radius-pill) border border-[var(--border)] bg-[var(--surface)] px-2.5 h-6 text-[11px] font-mono tabular-nums"
              >
                <span className="text-[var(--muted-foreground)]">Gen {gen}</span>
                <span className="font-semibold text-[var(--foreground)]">{count}</span>
              </span>
            )
          })}
        </div>
      </div>
    </FadeIn>
  )
}
