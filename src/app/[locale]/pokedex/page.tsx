'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'motion/react'
import { Search, SlidersHorizontal, LayoutGrid, List, X, SearchX } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useVirtualizer } from '@tanstack/react-virtual'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry, PokemonCategory } from '@/types/pokemon'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion'
import { PokedexFilters } from '@/components/pokedex/PokedexFilters'
import { PokedexTableRow, PokedexGridCard } from '@/components/pokedex/PokedexRow'
import { EmptyState } from '@/components/ui/empty-state'

// Heavy modal — only loads when the user clicks a row. Strips evolution-tree
// rendering, sprite shiny + form lists out of the initial bundle.
const PokedexDetails = dynamic(
  () => import('@/components/pokedex/PokedexDetails').then((m) => m.PokedexDetails),
  { ssr: false },
)
import {
  buildPokedexRows,
  applyFilters,
  type RegistrationStatus,
} from '@/lib/pokedex-filters'

const ALL_POKEMON = pokemonData as PokemonEntry[]
const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function PokedexPage() {
  const t = useTranslations('Pokedex')
  const locale = useSettingsStore((s) => s.locale)
  const variations = useSettingsStore((s) => s.variations)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const view = useSettingsStore((s) => s.pokedexView)
  const setView = useSettingsStore((s) => s.setPokedexView)
  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)
  const registered = usePokedexStore((s) => s.registered)

  const [query, setQuery] = React.useState('')
  const [activeGen, setActiveGen] = React.useState<number | 'all'>('all')
  const [types, setTypes] = React.useState<Set<string>>(new Set())
  const [categories, setCategories] = React.useState<Set<PokemonCategory>>(new Set())
  const [status, setStatus] = React.useState<RegistrationStatus>('all')
  const [showFilters, setShowFilters] = React.useState(false)
  const [openPokemon, setOpenPokemon] = React.useState<PokemonEntry | null>(null)

  const rows = React.useMemo(
    () => buildPokedexRows(ALL_POKEMON, variations, locale),
    [variations, locale],
  )

  const registeredSet = React.useMemo(() => new Set(registered), [registered])
  const isRegisteredKey = React.useCallback((key: string) => registeredSet.has(key), [registeredSet])

  const filtered = React.useMemo(
    () =>
      applyFilters(
        rows,
        {
          query,
          activeGenerations,
          generationFilter: activeGen,
          types,
          categories,
          status,
          variations,
        },
        isRegisteredKey,
        locale,
      ),
    [rows, query, activeGenerations, activeGen, types, categories, status, variations, isRegisteredKey, locale],
  )

  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Reset scroll when filters change to avoid blank state
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [view, query, activeGen, types, categories, status, variations])

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => (view === 'table' ? 56 : 220),
    overscan: 8,
  })

  const gridCols = useGridColumns()
  const gridVirtualizer = useVirtualizer({
    count: Math.ceil(filtered.length / gridCols),
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 220,
    overscan: 4,
  })

  const toggleType = (type: string) =>
    setTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })

  const toggleCategory = (cat: PokemonCategory) =>
    setCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })

  const handleClearFilters = () => {
    setQuery('')
    setActiveGen('all')
    setTypes(new Set())
    setCategories(new Set())
    setStatus('all')
  }

  const handleOpen = (entry: PokemonEntry) => setOpenPokemon(entry)

  const hasAnyFilter =
    query !== '' ||
    activeGen !== 'all' ||
    types.size > 0 ||
    categories.size > 0 ||
    status !== 'all'

  // Render the page chrome immediately so LCP captures the real layout. The
  // virtualized list is fine with `registered=[]` on first paint — IndexedDB
  // typically lands within ~150ms and the checkboxes flip in place.
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {t('subtitle', { count: registered.length, total: ALL_POKEMON.length })}
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)] pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="pl-9 pr-9 h-10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1"
                  aria-label="clear"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <Button
              variant={showFilters || hasAnyFilter ? 'accent' : 'outline'}
              onClick={() => setShowFilters((v) => !v)}
            >
              <SlidersHorizontal className="size-4" />
              {t('filters.title')}
            </Button>
            <div className="hidden sm:flex gap-1 rounded-md border border-[var(--border)] p-0.5">
              <Button
                size="icon"
                variant={view === 'table' ? 'secondary' : 'ghost'}
                onClick={() => setView('table')}
                aria-label={t('view.table')}
                title={t('view.table')}
              >
                <List className="size-4" />
              </Button>
              <Button
                size="icon"
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                onClick={() => setView('grid')}
                aria-label={t('view.grid')}
                title={t('view.grid')}
              >
                <LayoutGrid className="size-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-(--radius-lg) border border-[var(--border)] bg-[var(--surface)] p-4">
                <PokedexFilters
                  generations={GENERATIONS}
                  activeGen={activeGen}
                  onGenChange={setActiveGen}
                  types={types}
                  onToggleType={toggleType}
                  categories={categories}
                  onToggleCategory={toggleCategory}
                  status={status}
                  onStatusChange={setStatus}
                  onClear={handleClearFilters}
                  resultCount={filtered.length}
                />
              </div>
            </motion.div>
          )}
        </div>
      </FadeIn>

      <div
        ref={scrollRef}
        className="rounded-(--radius-lg) border border-[var(--border)] bg-[var(--card)] h-[70vh] overflow-y-auto"
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<SearchX className="size-4" />}
            title={t('empty')}
            description={hasAnyFilter ? t('emptyHint') : undefined}
            action={
              hasAnyFilter ? (
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  {t('filters.clear')}
                </Button>
              ) : null
            }
          />
        ) : view === 'table' ? (
          <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtual) => {
              const row = filtered[virtual.index]
              return (
                <div
                  key={virtual.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${virtual.start}px)`,
                  }}
                >
                  <PokedexTableRow
                    row={row}
                    registered={isRegisteredKey(row.key)}
                    onToggle={() => toggleRegistered(row.pokemon.id, row.form?.id)}
                    onOpenDetails={() => handleOpen(row.pokemon)}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div
            style={{ height: gridVirtualizer.getTotalSize(), position: 'relative' }}
            className="p-3"
          >
            {gridVirtualizer.getVirtualItems().map((virtual) => {
              const start = virtual.index * gridCols
              const slice = filtered.slice(start, start + gridCols)
              return (
                <div
                  key={virtual.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${virtual.start}px)`,
                  }}
                  className={`grid gap-3`}
                  data-grid-cols={gridCols}
                >
                  <div
                    className="grid gap-3"
                    style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
                  >
                    {slice.map((row) => (
                      <PokedexGridCard
                        key={row.key}
                        row={row}
                        registered={isRegisteredKey(row.key)}
                        onToggle={() => toggleRegistered(row.pokemon.id, row.form?.id)}
                        onOpenDetails={() => handleOpen(row.pokemon)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <PokedexDetails pokemon={openPokemon} onClose={() => setOpenPokemon(null)} />
    </div>
  )
}

function useGridColumns(): number {
  const [cols, setCols] = React.useState(4)
  React.useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      if (w >= 1280) setCols(5)
      else if (w >= 768) setCols(4)
      else if (w >= 640) setCols(3)
      else setCols(2)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])
  return cols
}
