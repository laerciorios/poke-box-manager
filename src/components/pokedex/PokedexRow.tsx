'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { SpritePlaceholder } from '@/components/pokemon/SpritePlaceholder'
import { TYPE_COLORS } from '@/lib/type-colors'
import { cn } from '@/lib/utils'
import type { PokedexRow as PokedexRowType } from '@/lib/pokedex-rows'

interface PokedexTableRowProps {
  row: PokedexRowType
  isRegistered: boolean
  onRowClick: (pokemonId: number) => void
  onToggleRegistered: (pokemonId: number, formId?: string) => void
  style?: React.CSSProperties
  gridCols: string
}

function SpriteCell({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false)
  if (error || !src) return <SpritePlaceholder size={40} />
  return (
    <Image
      src={src}
      alt={name}
      width={40}
      height={40}
      className="object-contain"
      onError={() => setError(true)}
      unoptimized
    />
  )
}

export function PokedexTableRow({
  row,
  isRegistered,
  onRowClick,
  onToggleRegistered,
  style,
  gridCols,
}: PokedexTableRowProps) {
  const t = useTranslations('Pokedex')
  const pillLabel = isRegistered ? t('statusMarkMissing') : t('statusMarkRegistered')

  return (
    <div
      role="row"
      style={{ ...style, display: 'grid', gridTemplateColumns: gridCols }}
      className={cn(
        'cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/40 items-center',
        row.kind === 'form' && 'bg-muted/20',
      )}
      onClick={() => onRowClick(row.pokemonId)}
    >
      {/* Sprite */}
      <div role="gridcell" className="flex items-center justify-center px-2 py-1">
        <SpriteCell src={row.sprite} name={row.name} />
      </div>

      {/* Dex number */}
      <div role="gridcell" className="px-3 py-1 text-right tabular-nums text-sm text-muted-foreground">
        #{String(row.dexNumber).padStart(4, '0')}
      </div>

      {/* Name */}
      <div role="gridcell" className="px-3 py-1">
        <span className="block truncate text-sm font-medium" title={row.name}>
          {row.name}
        </span>
        {row.kind === 'form' && (
          <span className="text-xs text-muted-foreground">Forma</span>
        )}
      </div>

      {/* Types */}
      <div role="gridcell" className="flex items-center gap-1 px-3 py-1">
        {row.types.map((type) =>
          type ? (
            <span
              key={type}
              className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
              style={{ backgroundColor: TYPE_COLORS[type] ?? '#999' }}
            >
              {type}
            </span>
          ) : null,
        )}
      </div>

      {/* Generation */}
      <div role="gridcell" className="px-3 py-1 text-center text-sm text-muted-foreground">
        {row.generation}
      </div>

      {/* Category */}
      <div role="gridcell" className="px-3 py-1 text-sm capitalize text-muted-foreground">
        {row.category.replace('-', ' ')}
      </div>

      {/* Status pill */}
      <div role="gridcell" className="px-3 py-1">
        <button
          type="button"
          aria-label={pillLabel}
          onClick={(e) => {
            e.stopPropagation()
            onToggleRegistered(row.pokemonId, row.formId)
          }}
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
            isRegistered
              ? 'bg-green-500/15 text-green-600 hover:bg-green-500/25 dark:text-green-400'
              : 'bg-muted text-muted-foreground hover:bg-muted/80',
          )}
        >
          {isRegistered ? t('statusRegistered') : t('statusMissing')}
        </button>
      </div>
    </div>
  )
}
