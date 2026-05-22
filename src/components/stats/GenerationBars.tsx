'use client'

import * as React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import { useTranslations } from 'next-intl'
import { FadeIn } from '@/components/motion'
import type { GenerationStat } from '@/hooks/useStatsData'

interface Props {
  data: GenerationStat[]
  /** CSS color string for filled (registered) bars. */
  barColor?: string
  /** CSS color string for the "missing" portion of each bar. */
  trackColor?: string
  title?: string
  description?: string
}

export function GenerationBars({
  data,
  barColor = 'var(--registered)',
  trackColor = 'var(--surface-3)',
  title,
  description,
}: Props) {
  const t = useTranslations('Stats')

  const chartData = React.useMemo(
    () =>
      data.map((gen) => ({
        id: gen.id,
        name: gen.name,
        registered: gen.registered,
        missing: Math.max(0, gen.total - gen.registered),
        total: gen.total,
        percentage:
          gen.total > 0 ? Math.round((gen.registered / gen.total) * 1000) / 10 : 0,
      })),
    [data],
  )

  if (data.length === 0) {
    return (
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm text-[var(--muted-foreground)]">
          {t('generations.empty')}
        </p>
      </div>
    )
  }

  // 36px row + a bit of padding per bar
  const chartHeight = Math.max(220, data.length * 38 + 24)

  return (
    <FadeIn delay={0.1}>
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-4">
          <h3 className="font-display text-base font-semibold tracking-tight">
            {title ?? t('generations.title')}
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {description ?? t('generations.description')}
          </p>
        </div>

        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
              barCategoryGap={8}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="2 3"
                stroke="var(--border)"
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={92}
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'var(--surface-2)' }}
                content={<GenerationTooltip />}
              />
              <Bar
                dataKey="missing"
                stackId="g"
                fill={trackColor}
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="registered"
                stackId="g"
                fill={barColor}
                radius={[4, 0, 0, 4]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => (
                  <Cell key={`c-${entry.id}`} fill={barColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </FadeIn>
  )
}

interface TooltipPayload {
  payload?: {
    name: string
    registered: number
    total: number
    percentage: number
  }
}

interface RechartsTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
}

function GenerationTooltip({ active, payload }: RechartsTooltipProps) {
  const t = useTranslations('Stats')
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0]?.payload
  if (!data) return null
  return (
    <div className="rounded-(--radius-md) border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-pop)] px-3 py-2 text-xs">
      <p className="font-semibold mb-1">{data.name}</p>
      <p className="font-mono tabular-nums text-[var(--muted-foreground)]">
        {t('generations.tooltipCount', {
          registered: data.registered,
          total: data.total,
        })}
      </p>
      <p className="font-mono tabular-nums text-[var(--foreground)]">
        {data.percentage.toFixed(1)}%
      </p>
    </div>
  )
}
