'use client'

import { useStatsData } from '@/hooks/useStatsData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OverallDonut } from './OverallDonut'
import { GenerationBars } from './GenerationBars'
import { TypeGrid } from './TypeGrid'
import { BoxHeatmap } from './BoxHeatmap'
import { BoxSummary } from './BoxSummary'

interface StatsClientPageProps {
  t: {
    overallSection: string
    registeredLabel: string
    totalLabel: string
    generationSection: string
    typeSection: string
    heatmapSection: string
    boxSummarySection: string
    boxComplete: string
    boxPartial: string
    boxEmpty: string
    emptyState: string
  }
}

export function StatsClientPage({ t }: StatsClientPageProps) {
  const { overall, byGeneration, byType, boxSummary, boxes } = useStatsData()

  const isEmpty = boxes.length === 0 && overall.registered === 0

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground text-sm text-center px-4">
        {t.emptyState}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Overall donut + box summary side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t.overallSection}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <OverallDonut
              registered={overall.registered}
              total={overall.total}
              percentage={overall.percentage}
              labelRegistered={t.registeredLabel}
              labelTotal={t.totalLabel}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.boxSummarySection}</CardTitle>
          </CardHeader>
          <CardContent>
            <BoxSummary
              complete={boxSummary.complete}
              partial={boxSummary.partial}
              empty={boxSummary.empty}
              labelComplete={t.boxComplete}
              labelPartial={t.boxPartial}
              labelEmpty={t.boxEmpty}
            />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Generation bars + type grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t.generationSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <GenerationBars generations={byGeneration} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.typeSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeGrid types={byType} />
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Box heatmap */}
      {boxes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.heatmapSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <BoxHeatmap boxes={boxes} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
