'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TYPE_COLORS } from '@/lib/type-colors'
import { usePokedexStore } from '@/stores/usePokedexStore'
import type { MissingEntry } from '@/lib/missing-pokemon'

interface MissingPokemonCardProps {
  entry: MissingEntry
}

export function MissingPokemonCard({ entry }: MissingPokemonCardProps) {
  const t = useTranslations('Missing')
  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)
  const [imgError, setImgError] = useState(false)

  const isForm = entry.formKey.includes(':')
  const [pokemonIdStr, formId] = isForm ? entry.formKey.split(':') : [entry.formKey, undefined]
  const pokemonId = Number(pokemonIdStr)

  function handleQuickAdd() {
    toggleRegistered(pokemonId, formId)
  }

  return (
    <div className="group relative flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center transition-shadow hover:shadow-md">
      {/* Sprite */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        {imgError ? (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
            <svg
              className="h-8 w-8 text-muted-foreground/40"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="50" cy="38" r="20" />
              <ellipse cx="50" cy="78" rx="30" ry="18" />
            </svg>
          </div>
        ) : (
          <Image
            src={entry.spriteUrl}
            alt={entry.name}
            width={64}
            height={64}
            className="object-contain drop-shadow-sm"
            onError={() => setImgError(true)}
            unoptimized
          />
        )}
      </div>

      {/* Dex number */}
      <span className="text-xs text-muted-foreground">#{String(entry.id).padStart(4, '0')}</span>

      {/* Name */}
      <span className="text-sm font-medium leading-tight">{entry.name}</span>

      {/* Type badges */}
      <div className="flex flex-wrap justify-center gap-1">
        {entry.types.map((type) => (
          <span
            key={type}
            className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: TYPE_COLORS[type] ?? '#888' }}
          >
            {type}
          </span>
        ))}
      </div>

      {/* Quick Add button */}
      <Button
        size="sm"
        variant="outline"
        className={cn(
          'mt-1 h-7 gap-1 px-2 text-xs',
          'opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100',
        )}
        onClick={handleQuickAdd}
        aria-label={`${t('quickAdd')} ${entry.name}`}
      >
        <Plus className="h-3 w-3" />
        {t('quickAdd')}
      </Button>
    </div>
  )
}
