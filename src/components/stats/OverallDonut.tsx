'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface OverallDonutProps {
  registered: number
  total: number
  percentage: number
  labelRegistered: string
  labelTotal: string
}

export function OverallDonut({
  registered,
  total,
  percentage,
  labelRegistered,
  labelTotal,
}: OverallDonutProps) {
  const remaining = total - registered
  const data = [
    { value: registered },
    { value: remaining > 0 ? remaining : 0 },
  ]

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="85%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill="hsl(var(--primary))" />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold tabular-nums">{percentage}%</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {registered} / {total}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {labelRegistered}: <span className="font-semibold text-foreground">{registered}</span>
        {' · '}
        {labelTotal}: <span className="font-semibold text-foreground">{total}</span>
      </p>
    </div>
  )
}
