'use client'

import type { GenerationStat } from '@/hooks/useStatsData'

interface GenerationBarsProps {
  generations: GenerationStat[]
}

export function GenerationBars({ generations }: GenerationBarsProps) {
  if (generations.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {generations.map((gen) => {
        const pct = gen.total > 0 ? (gen.registered / gen.total) * 100 : 0
        const isComplete = gen.registered === gen.total && gen.total > 0

        return (
          <div key={gen.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{gen.name}</span>
              <span className="text-muted-foreground tabular-nums">
                {gen.registered}/{gen.total}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isComplete
                    ? 'hsl(var(--chart-2))'
                    : 'hsl(var(--primary))',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
