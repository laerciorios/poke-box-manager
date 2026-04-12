'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import {
  buildMissingEntries,
  applyFiltersAndSort,
  type CategoryFilter,
  type SortKey,
} from '@/lib/missing-pokemon'
import { MissingPokemonCard } from './MissingPokemonCard'
import { MissingFilters } from './MissingFilters'
import { MissingSortControl } from './MissingSortControl'
import { NextUpBanner } from './NextUpBanner'

export function MissingPokemonScreen() {
  const t = useTranslations('Missing')
  const searchParams = useSearchParams()

  const registered = usePokedexStore((s) => s.registered)
  const variations = useSettingsStore((s) => s.variations)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const locale = useSettingsStore((s) => s.locale)

  // Parse URL params
  const genParam = searchParams.get('gen')
  const typeParam = searchParams.get('type') ?? ''
  const catParam = (searchParams.get('cat') ?? 'all') as CategoryFilter
  const sortParam = (searchParams.get('sort') ?? 'dex') as SortKey
  const nextupParam = searchParams.get('nextup')
  const nextupCount = nextupParam ? Math.max(1, parseInt(nextupParam, 10) || 10) : null

  const allMissing = useMemo(() => {
    const registeredSet = new Set(registered)
    return buildMissingEntries(registeredSet, variations, activeGenerations, locale)
  }, [registered, variations, activeGenerations, locale])

  const displayed = useMemo(() => {
    if (nextupCount !== null) {
      // Next up mode: first N in dex order, no additional filters
      return allMissing.slice(0, nextupCount)
    }

    const genFilter = genParam ? [parseInt(genParam, 10)] : []
    return applyFiltersAndSort(allMissing, {
      generations: genFilter,
      type: typeParam,
      category: catParam,
      sort: sortParam,
    })
  }, [allMissing, nextupCount, genParam, typeParam, catParam, sortParam])

  const isFiltered = Boolean(nextupCount !== null || genParam || typeParam || catParam !== 'all')

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      {nextupCount !== null ? (
        <NextUpBanner count={nextupCount} />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <MissingFilters />
          <MissingSortControl />
        </div>
      )}

      {/* Count summary */}
      {allMissing.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {t('missingCount', { count: displayed.length })}
        </p>
      )}

      {/* Card grid */}
      {displayed.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {displayed.map((entry) => (
            <MissingPokemonCard key={entry.formKey} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[200px] items-center justify-center text-center text-sm text-muted-foreground">
          {allMissing.length === 0 ? t('emptyState') : t('emptyStateFiltered')}
        </div>
      )}
    </div>
  )
}
