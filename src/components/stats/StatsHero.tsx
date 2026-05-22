'use client'

import { useTranslations } from 'next-intl'
import { ProgressRing } from '@/components/ui/progress-ring'
import { CountUp, FadeIn } from '@/components/motion'

interface Props {
  percentage: number
  registered: number
  total: number
  boxSummary: { complete: number; partial: number; empty: number }
  /** Tailwind text-* class controlling the ring stroke color. */
  ringClassName?: string
}

export function StatsHero({
  percentage,
  registered,
  total,
  boxSummary,
  ringClassName = 'text-[var(--registered)]',
}: Props) {
  const t = useTranslations('Stats')

  return (
    <FadeIn>
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center">
          <div className="justify-self-center md:justify-self-start">
            <ProgressRing
              value={percentage / 100}
              size={200}
              strokeWidth={14}
              ringClassName={ringClassName}
              trackClassName="text-[var(--surface-3)]"
              label={
                <div className="text-center">
                  <div className="font-display text-4xl font-semibold tracking-tight tabular-nums">
                    {percentage.toFixed(1)}
                    <span className="text-[var(--muted-foreground)] text-2xl">%</span>
                  </div>
                  <div className="mt-1 text-xs font-mono text-[var(--muted-foreground)] tabular-nums">
                    {registered.toLocaleString()} / {total.toLocaleString()}
                  </div>
                </div>
              }
            />
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)]">
                {t('hero.eyebrow')}
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mt-1">
                {t('hero.title')}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {t('hero.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SummaryTile
                label={t('hero.boxes.complete')}
                value={boxSummary.complete}
                accent="var(--registered)"
              />
              <SummaryTile
                label={t('hero.boxes.partial')}
                value={boxSummary.partial}
                accent="var(--warning)"
              />
              <SummaryTile
                label={t('hero.boxes.empty')}
                value={boxSummary.empty}
                accent="var(--muted-foreground)"
              />
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

function SummaryTile({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent: string
}) {
  return (
    <div className="rounded-(--radius-md) border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
      <div className="flex items-center gap-2">
        <span
          className="inline-block size-1.5 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)]">
          {label}
        </span>
      </div>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight tabular-nums">
        <CountUp to={value} />
      </p>
    </div>
  )
}
