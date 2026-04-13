'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { SpritePlaceholder } from '@/components/pokemon/SpritePlaceholder'
import { TYPE_COLORS } from '@/lib/type-colors'
import { cn } from '@/lib/utils'
import type { PokedexRow } from '@/lib/pokedex-rows'

interface PokedexCardProps {
  row: PokedexRow
  isRegistered: boolean
  onRowClick: (pokemonId: number) => void
  onToggleRegistered: (pokemonId: number, formId?: string) => void
}

export function PokedexCard({
  row,
  isRegistered,
  onRowClick,
  onToggleRegistered,
}: PokedexCardProps) {
  const t = useTranslations('Pokedex')
  const [imgError, setImgError] = useState(false)
  const pillLabel = isRegistered ? t('statusMarkMissing') : t('statusMarkRegistered')

  return (
    <div
      className={cn(
        'group relative flex flex-col items-center gap-1.5 rounded-xl border bg-card p-3 text-center transition-shadow hover:shadow-md cursor-pointer',
        isRegistered && 'border-green-500/30',
        row.kind === 'form' && 'opacity-90',
      )}
      onClick={() => onRowClick(row.pokemonId)}
    >
      {/* Sprite */}
      <div className="flex h-16 w-16 items-center justify-center">
        {imgError ? (
          <SpritePlaceholder size={64} />
        ) : (
          <Image
            src={row.sprite}
            alt={row.name}
            width={64}
            height={64}
            className="object-contain drop-shadow-sm"
            onError={() => setImgError(true)}
            unoptimized
          />
        )}
      </div>

      {/* Dex number */}
      <span className="text-xs text-muted-foreground tabular-nums">
        #{String(row.dexNumber).padStart(4, '0')}
      </span>

      {/* Name */}
      <span className="w-full truncate text-sm font-medium leading-tight" title={row.name}>
        {row.name}
      </span>

      {/* Types */}
      <div className="flex flex-wrap justify-center gap-1">
        {row.types.map((type) =>
          type ? (
            <span
              key={type}
              className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
              style={{ backgroundColor: TYPE_COLORS[type] ?? '#888' }}
            >
              {type}
            </span>
          ) : null,
        )}
      </div>

      {/* Status pill */}
      <button
        type="button"
        aria-label={pillLabel}
        onClick={(e) => {
          e.stopPropagation()
          onToggleRegistered(row.pokemonId, row.formId)
        }}
        className={cn(
          'mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
          isRegistered
            ? 'bg-green-500/15 text-green-600 hover:bg-green-500/25 dark:text-green-400'
            : 'bg-muted text-muted-foreground hover:bg-muted/80',
        )}
      >
        {isRegistered ? t('statusRegistered') : t('statusMissing')}
      </button>
    </div>
  )
}
