'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useStatsData } from '@/hooks/useStatsData'
import { FadeIn } from '@/components/motion'
import { Skeleton } from '@/components/ui/skeleton'
import { StatsHero } from '@/components/stats/StatsHero'
import { BoxHeatmap } from '@/components/stats/BoxHeatmap'
import { TypeProgressGrid } from '@/components/stats/TypeProgressGrid'
import { MilestonesRow } from '@/components/stats/MilestonesRow'
import { ShinyTabToggle, type StatsTab } from '@/components/stats/ShinyTabToggle'

// Recharts brings in d3-shape, immer, decimal.js-light, redux-toolkit and
// es-toolkit — about 200 KiB before gzip. Splitting it out of the main bundle
// keeps the rest of the app snappy; /stats is the only route that uses it.
const GenerationBars = dynamic(
  () => import('@/components/stats/GenerationBars').then((m) => m.GenerationBars),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] rounded-(--radius-xl)" />,
  },
)
export default function StatsPage() {
  const t = useTranslations('Stats')
  const stats = useStatsData()
  const [tab, setTab] = React.useState<StatsTab>('overall')

  const hasShiny = stats.shiny !== undefined
  const showShiny = tab === 'shiny' && hasShiny && stats.shiny

  const heroData = showShiny
    ? {
        overall: stats.shiny!.overall,
        byGeneration: stats.shiny!.byGeneration,
      }
    : {
        overall: stats.overall,
        byGeneration: stats.byGeneration,
      }

  const ringClass = showShiny
    ? 'text-[var(--shiny)]'
    : 'text-[var(--registered)]'
  const accentColor = showShiny ? 'var(--shiny)' : 'var(--registered)'

  // Reset to overall when shiny tracker gets disabled.
  React.useEffect(() => {
    if (!hasShiny && tab === 'shiny') setTab('overall')
  }, [hasShiny, tab])

  // Stats are computed off useStatsData which uses the active stores. Until
  // they hydrate the numbers read 0/0, which is honest for a first-load user.
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-6">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-xl">
              {t('subtitle')}
            </p>
          </div>
          {hasShiny && <ShinyTabToggle value={tab} onChange={setTab} />}
        </div>
      </FadeIn>

      <StatsHero
        percentage={heroData.overall.percentage}
        registered={heroData.overall.registered}
        total={heroData.overall.total}
        boxSummary={stats.boxSummary}
        ringClassName={ringClass}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenerationBars
          data={heroData.byGeneration}
          barColor={accentColor}
          trackColor="var(--surface-3)"
        />
        <MilestonesRow
          registered={heroData.overall.registered}
          fillColor={accentColor}
        />
      </div>

      <BoxHeatmap entries={stats.boxes} />

      <TypeProgressGrid data={stats.byType} />
    </div>
  )
}
