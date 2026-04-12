'use client'

import { useTranslations } from 'next-intl'
import { OverallDonut } from '@/components/stats/OverallDonut'
import { getMilestones } from '@/lib/milestones'
import { cn } from '@/lib/utils'

interface CompletionRingProps {
  registered: number
  total: number
  percentage: number
}

export function CompletionRing({ registered, total, percentage }: CompletionRingProps) {
  const t = useTranslations('Home')
  const tStats = useTranslations('Stats')
  const milestones = getMilestones(percentage)

  return (
    <div className="flex flex-col items-center gap-4">
      <OverallDonut
        registered={registered}
        total={total}
        percentage={percentage}
        labelRegistered={tStats('registeredLabel')}
        labelTotal={tStats('totalLabel')}
      />
      {/* Milestone pips */}
      <div className="flex items-center gap-2">
        {milestones.map((m) => (
          <div key={m.threshold} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'h-2.5 w-2.5 rounded-full border transition-colors',
                m.reached
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground/30 bg-transparent',
              )}
            />
            <span className="text-[9px] text-muted-foreground tabular-nums">
              {t('milestone', { threshold: m.threshold })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
