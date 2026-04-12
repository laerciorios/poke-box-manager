'use client'

import { useTranslations } from 'next-intl'
import { getMilestones } from '@/lib/milestones'
import { cn } from '@/lib/utils'
import type { GenerationStat } from '@/hooks/useStatsData'

interface GenerationMilestonesProps {
  byGeneration: GenerationStat[]
}

export function GenerationMilestones({ byGeneration }: GenerationMilestonesProps) {
  const t = useTranslations('Home')

  if (byGeneration.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {byGeneration.map((gen) => {
        const percentage = gen.total > 0 ? Math.round((gen.registered / gen.total) * 1000) / 10 : 0
        const milestones = getMilestones(percentage)

        return (
          <div key={gen.id} className="flex items-center gap-3">
            {/* Gen name */}
            <span className="w-24 shrink-0 text-xs text-muted-foreground truncate">{gen.name}</span>

            {/* Progress bar */}
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>

            {/* Percentage */}
            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {percentage}%
            </span>

            {/* Milestone pips */}
            <div className="flex items-center gap-1 shrink-0">
              {milestones.map((m) => (
                <div
                  key={m.threshold}
                  title={t('milestone', { threshold: m.threshold })}
                  className={cn(
                    'h-2 w-2 rounded-full border transition-colors',
                    m.reached
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/30 bg-transparent',
                  )}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
