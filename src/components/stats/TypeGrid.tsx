'use client'

import { TYPE_COLORS } from '@/lib/type-colors'
import type { TypeStat } from '@/hooks/useStatsData'

const TYPE_ORDER = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
  'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy',
]

interface TypeGridProps {
  types: TypeStat[]
}

export function TypeGrid({ types }: TypeGridProps) {
  const typeMap = new Map(types.map((t) => [t.type, t]))

  const sorted = TYPE_ORDER.map((name) => {
    const stat = typeMap.get(name)
    return {
      name,
      registered: stat?.registered ?? 0,
      total: stat?.total ?? 0,
      pct: stat && stat.total > 0 ? Math.round((stat.registered / stat.total) * 100) : 0,
    }
  })

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {sorted.map(({ name, registered, total, pct }) => {
        const color = TYPE_COLORS[name] ?? '#888'
        return (
          <div
            key={name}
            className="flex flex-col items-center gap-1 rounded-lg p-2 text-white text-xs font-medium"
            style={{ backgroundColor: color }}
            title={`${name}: ${registered}/${total}`}
          >
            <span className="capitalize leading-tight">{name}</span>
            <span className="text-white/80 tabular-nums">{pct}%</span>
            <div className="w-full h-1 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/80"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
