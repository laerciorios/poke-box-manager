'use client'

import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { StatsData } from '@/hooks/useStatsData'

interface QuickStatsProps {
  stats: StatsData
}

interface StatTileProps {
  label: string
  value: string | number
  sub?: string
}

function StatTile({ label, value, sub }: StatTileProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border bg-card p-4 gap-1 min-w-0">
      <span className="text-2xl font-bold tabular-nums leading-none">{value}</span>
      {sub && <span className="text-xs text-muted-foreground tabular-nums">{sub}</span>}
      <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  )
}

export function QuickStats({ stats }: QuickStatsProps) {
  const t = useTranslations('Home')
  const shinyTrackerEnabled = useSettingsStore((s) => s.shinyTrackerEnabled)

  const boxesUsed = stats.boxes.filter((b) => b.state !== 'empty').length

  return (
    <div className={`grid gap-3 ${shinyTrackerEnabled ? 'grid-cols-4' : 'grid-cols-3'}`}>
      <StatTile
        label={t('statRegistered')}
        value={stats.overall.registered}
        sub={`/ ${stats.overall.total}`}
      />
      <StatTile
        label={t('statBoxesUsed')}
        value={boxesUsed}
        sub={`/ ${stats.boxes.length}`}
      />
      {shinyTrackerEnabled && stats.shiny && (
        <StatTile
          label={t('statShiny')}
          value={stats.shiny.overall.registered}
        />
      )}
      <StatTile
        label={t('statTotal')}
        value={stats.overall.total}
      />
    </div>
  )
}
