'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { BoxHeatmapEntry } from '@/hooks/useStatsData'

const STATE_CLASSES: Record<string, string> = {
  complete: 'bg-green-500 hover:bg-green-400',
  partial: 'bg-yellow-400 hover:bg-yellow-300',
  empty: 'bg-red-400 hover:bg-red-300',
}

interface BoxHeatmapProps {
  boxes: BoxHeatmapEntry[]
}

export function BoxHeatmap({ boxes }: BoxHeatmapProps) {
  if (boxes.length === 0) return null

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        {boxes.map((box) => (
          <Tooltip key={box.id}>
            <TooltipTrigger
              render={
                <div
                  className={`w-8 h-8 rounded cursor-default transition-colors ${STATE_CLASSES[box.state]}`}
                  aria-label={box.name}
                />
              }
            />
            <TooltipContent>{box.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
