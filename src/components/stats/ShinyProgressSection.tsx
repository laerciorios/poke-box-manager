'use client'

import { Sparkles } from 'lucide-react'
import { GenerationBars } from './GenerationBars'
import type { ShinyStats } from '@/hooks/useStatsData'

interface ShinyProgressSectionProps {
  shiny: ShinyStats
  labelTitle: string
  labelRegistered: string
  labelGeneration: string
}

export function ShinyProgressSection({
  shiny,
  labelTitle,
  labelRegistered,
  labelGeneration,
}: ShinyProgressSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Overall shiny count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-amber-400" />
          <span className="font-medium">{labelTitle}</span>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">
          {shiny.overall.registered} / {shiny.overall.total}
          <span className="ml-1 text-xs">({shiny.overall.percentage}%)</span>
        </span>
      </div>

      {/* Overall progress bar */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-amber-400"
          style={{ width: `${shiny.overall.percentage}%` }}
        />
      </div>

      {/* Per-generation breakdown */}
      {shiny.byGeneration.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {labelGeneration}
          </p>
          <GenerationBars generations={shiny.byGeneration} />
        </div>
      )}
    </div>
  )
}
