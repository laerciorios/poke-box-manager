'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useBoxStore } from '@/stores/useBoxStore'
import { useTagsStore } from '@/stores/useTagsStore'
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
import { TagFilterPanel } from '@/components/tags/TagFilterPanel'

export function MissingPokemonScreen() {
  const t = useTranslations('Missing')
  const searchParams = useSearchParams()

  const registered = usePokedexStore((s) => s.registered)
  const variations = useSettingsStore((s) => s.variations)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const locale = useSettingsStore((s) => s.locale)
  const boxes = useBoxStore((s) => s.boxes)
  const allTags = useTagsStore((s) => s.tags)
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set())

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

  const taggedFormKeys = useMemo(() => {
    if (!selectedTagIds.size) return null
    const keys = new Set<string>()
    for (const box of boxes) {
      for (const slot of box.slots) {
        if (!slot?.tagIds) continue
        if (slot.tagIds.some((id) => selectedTagIds.has(id))) {
          const key = slot.formId ? `${slot.pokemonId}:${slot.formId}` : String(slot.pokemonId)
          keys.add(key)
        }
      }
    }
    return keys
  }, [boxes, selectedTagIds])

  const displayed = useMemo(() => {
    let base: typeof allMissing

    if (nextupCount !== null) {
      base = allMissing.slice(0, nextupCount)
    } else {
      const genFilter = genParam ? [parseInt(genParam, 10)] : []
      base = applyFiltersAndSort(allMissing, {
        generations: genFilter,
        type: typeParam,
        category: catParam,
        sort: sortParam,
      })
    }

    if (taggedFormKeys) {
      return base.filter((e) => taggedFormKeys.has(e.formKey))
    }
    return base
  }, [allMissing, nextupCount, genParam, typeParam, catParam, sortParam, taggedFormKeys])

  const isFiltered = Boolean(nextupCount !== null || genParam || typeParam || catParam !== 'all' || selectedTagIds.size)

  const handleToggleTagFilter = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev)
      if (next.has(tagId)) next.delete(tagId)
      else next.add(tagId)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      {nextupCount !== null ? (
        <NextUpBanner count={nextupCount} />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <MissingFilters />
            <MissingSortControl />
          </div>
          <TagFilterPanel
            tags={allTags}
            selectedTagIds={selectedTagIds}
            onToggle={handleToggleTagFilter}
          />
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
