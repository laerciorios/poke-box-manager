'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { buildMissingEntries } from '@/lib/missing-pokemon'
import type { Locale } from '@/types/locale'

interface NextUpStripProps {
  count?: number
  onSelectPokemon: (pokemonId: number) => void
}

export function NextUpStrip({ count = 5, onSelectPokemon }: NextUpStripProps) {
  const t = useTranslations('Home')
  const locale = useLocale() as Locale
  const registered = usePokedexStore((s) => s.registered)
  const variations = useSettingsStore((s) => s.variations)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)

  const entries = useMemo(() => {
    const registeredSet = new Set(registered)
    return buildMissingEntries(registeredSet, variations, activeGenerations, locale).slice(0, count)
  }, [registered, variations, activeGenerations, locale, count])

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-3">{t('nothingMissing')}</p>
    )
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
      {entries.map((entry) => (
        <button
          key={entry.formKey}
          onClick={() => onSelectPokemon(entry.id)}
          className="flex flex-col items-center gap-1 shrink-0 rounded-lg p-2 hover:bg-muted transition-colors focus:outline-none focus:bg-muted"
          title={entry.name}
        >
          <div className="relative h-14 w-14">
            <Image
              src={entry.spriteUrl}
              alt={entry.name}
              width={56}
              height={56}
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            #{String(entry.id).padStart(4, '0')}
          </span>
        </button>
      ))}
    </div>
  )
}
