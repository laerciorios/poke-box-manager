'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useVirtualizer } from '@tanstack/react-virtual'
import { LayoutList, LayoutGrid } from 'lucide-react'

import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useBoxStore } from '@/stores/useBoxStore'
import { useTagsStore } from '@/stores/useTagsStore'
import { buildPokedexRows } from '@/lib/pokedex-rows'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { PokedexSearch } from './PokedexSearch'
import { PokedexFilters } from './PokedexFilters'
import { PokedexSortHeader } from './PokedexSortHeader'
import { PokedexTableRow } from './PokedexRow'
import { PokedexCard } from './PokedexCard'
import { TagFilterPanel } from '@/components/tags/TagFilterPanel'

import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry, PokemonCategory } from '@/types/pokemon'
import type { SortKey, SortDir } from './PokedexSortHeader'

const allPokemon = pokemonData as unknown as PokemonEntry[]

const ROW_HEIGHT = 60

// Shared column widths — header and each row use the same template
const GRID_COLS = '48px 80px 1fr 160px 72px 128px 112px'

export function PokedexPage() {
  const t = useTranslations('Pokedex')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Store state
  const registered = usePokedexStore((s) => s.registered)
  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)
  const variations = useSettingsStore((s) => s.variations)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const locale = useSettingsStore((s) => s.locale)
  const pokedexView = useSettingsStore((s) => s.pokedexView)
  const setPokedexView = useSettingsStore((s) => s.setPokedexView)
  const boxes = useBoxStore((s) => s.boxes)
  const allTags = useTagsStore((s) => s.tags)
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set())

  // URL params
  const genParam = searchParams.get('gen') ?? ''
  const typeParam = searchParams.get('type') ?? ''
  const catParam = (searchParams.get('cat') ?? '') as PokemonCategory | ''
  const sortParam = (searchParams.get('sort') ?? 'dex') as SortKey
  const dirParam = (searchParams.get('dir') ?? 'asc') as SortDir

  // Local search state
  const [query, setQuery] = useState('')

  // Selected Pokémon for PokemonCard sheet
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // O(1) registration lookup
  const registeredSet = useMemo(() => new Set(registered), [registered])

  const taggedSlotKeys = useMemo(() => {
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

  const handleToggleTagFilter = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev)
      if (next.has(tagId)) next.delete(tagId)
      else next.add(tagId)
      return next
    })
  }

  // Build full row list
  const allRows = useMemo(
    () => buildPokedexRows(allPokemon, variations, activeGenerations, locale),
    [variations, activeGenerations, locale],
  )

  // Filter + sort pipeline
  const displayedRows = useMemo(() => {
    let rows = allRows

    if (query) {
      const q = query.toLowerCase()
      rows = rows.filter(
        (row) =>
          row.name.toLowerCase().includes(q) ||
          String(row.dexNumber).padStart(4, '0').includes(q),
      )
    }

    if (genParam) {
      const gen = parseInt(genParam, 10)
      rows = rows.filter((row) => row.generation === gen)
    }

    if (typeParam) {
      rows = rows.filter((row) => row.types.includes(typeParam as never))
    }

    if (catParam) {
      rows = rows.filter((row) => row.category === catParam)
    }

    rows = [...rows].sort((a, b) => {
      let cmp = 0
      switch (sortParam) {
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'type':
          cmp = a.types[0].localeCompare(b.types[0])
          break
        case 'generation':
          cmp = a.generation - b.generation
          break
        case 'dex':
        default:
          cmp = a.dexNumber - b.dexNumber
          break
      }
      if (cmp === 0 && sortParam !== 'dex') cmp = a.dexNumber - b.dexNumber
      return dirParam === 'desc' ? -cmp : cmp
    })

    if (taggedSlotKeys) {
      rows = rows.filter((row) => {
        const key = row.formId ? `${row.pokemonId}:${row.formId}` : String(row.pokemonId)
        return taggedSlotKeys.has(key)
      })
    }

    return rows
  }, [allRows, query, genParam, typeParam, catParam, sortParam, dirParam, taggedSlotKeys])

  // Virtualizer (table view only)
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: pokedexView === 'table' ? displayedRows.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  })

  const handleSort = useCallback(
    (key: SortKey, dir: SortDir) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('sort', key)
      params.set('dir', dir)
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  const sortProps = { activeSortKey: sortParam, dir: dirParam, onSort: handleSort }

  const sharedRowProps = {
    onRowClick: setSelectedId,
    onToggleRegistered: toggleRegistered,
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Controls bar */}
      <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <PokedexSearch value={query} onChange={setQuery} />
        <PokedexFilters />

        {/* View toggle */}
        <div className="ml-auto flex items-center rounded-md border border-border p-0.5">
          <button
            type="button"
            aria-label="Visualização em tabela"
            onClick={() => setPokedexView('table')}
            className={`rounded p-1.5 transition-colors ${
              pokedexView === 'table'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutList size={16} />
          </button>
          <button
            type="button"
            aria-label="Visualização em grade"
            onClick={() => setPokedexView('grid')}
            className={`rounded p-1.5 transition-colors ${
              pokedexView === 'grid'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
      <TagFilterPanel
        tags={allTags}
        selectedTagIds={selectedTagIds}
        onToggle={handleToggleTagFilter}
      />
      </div>

      {/* Row count */}
      <p className="text-sm text-muted-foreground">
        {t('rowCount', { count: displayedRows.length })}
      </p>

      {/* ── TABLE VIEW ── */}
      {pokedexView === 'table' && (
        <div
          ref={parentRef}
          className="overflow-auto rounded-md border border-border"
          style={{ height: 'calc(100vh - 280px)' }}
          role="grid"
          aria-label={t('pageTitle')}
        >
          {/* Sticky header */}
          <div
            role="row"
            className="sticky top-0 z-10 border-b border-border bg-background"
            style={{ display: 'grid', gridTemplateColumns: GRID_COLS }}
          >
            <div role="columnheader" className="px-2 py-2" />
            <PokedexSortHeader label={t('colNumber')} sortKey="dex" align="right" {...sortProps} />
            <PokedexSortHeader label={t('colName')} sortKey="name" {...sortProps} />
            <PokedexSortHeader label={t('colTypes')} sortKey="type" {...sortProps} />
            <PokedexSortHeader label={t('colGeneration')} sortKey="generation" align="center" {...sortProps} />
            <div role="columnheader" className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('colCategory')}
            </div>
            <div role="columnheader" className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('colStatus')}
            </div>
          </div>

          {/* Virtual rows container */}
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
            {displayedRows.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                {t('emptyState')}
              </div>
            ) : (
              virtualizer.getVirtualItems().map((virtualRow) => {
                const row = displayedRows[virtualRow.index]
                return (
                  <PokedexTableRow
                    key={row.key}
                    row={row}
                    isRegistered={registeredSet.has(row.key)}
                    gridCols={GRID_COLS}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                      height: `${ROW_HEIGHT}px`,
                    }}
                    {...sharedRowProps}
                  />
                )
              })
            )}
          </div>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {pokedexView === 'grid' && (
        <>
          {displayedRows.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
              {t('emptyState')}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {displayedRows.map((row) => (
                <PokedexCard
                  key={row.key}
                  row={row}
                  isRegistered={registeredSet.has(row.key)}
                  {...sharedRowProps}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* PokemonCard side panel */}
      {selectedId !== null && (
        <PokemonCard
          pokemonId={selectedId}
          isOpen={selectedId !== null}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
