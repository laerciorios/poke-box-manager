'use client'

import Image from 'next/image'
import { useRecentRegistrations } from '@/hooks/useRecentRegistrations'

interface RecentStripProps {
  count?: number
  onSelectPokemon: (pokemonId: number) => void
}

export function RecentStrip({ count = 5, onSelectPokemon }: RecentStripProps) {
  const entries = useRecentRegistrations(count)

  if (entries.length === 0) return null

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
      {entries.map((entry) => (
        <button
          key={entry.key}
          onClick={() => onSelectPokemon(entry.pokemonId)}
          className="flex flex-col items-center gap-1 shrink-0 rounded-lg p-2 hover:bg-muted transition-colors focus:outline-none focus:bg-muted"
          title={entry.name}
        >
          <div className="relative h-14 w-14">
            <Image
              src={entry.sprite}
              alt={entry.name}
              width={56}
              height={56}
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            #{String(entry.pokemonId).padStart(4, '0')}
          </span>
        </button>
      ))}
    </div>
  )
}
