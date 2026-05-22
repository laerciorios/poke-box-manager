'use client'

import * as React from 'react'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { useTranslations } from 'next-intl'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry } from '@/types/pokemon'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { buildMissingEntries, applyFiltersAndSort, type MissingEntry } from '@/lib/missing-pokemon'
import { computeEvolutionReady } from '@/lib/evolution-readiness'
import { exportMissingCsv, exportMissingJson } from '@/lib/missing-export'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion'
import { MissingFilters, type MissingFilterState } from '@/components/missing/MissingFilters'
import { MissingList } from '@/components/missing/MissingList'
import { MissingSummary } from '@/components/missing/MissingSummary'
import { ShinySuggestions } from '@/components/missing/ShinySuggestions'
import dynamic from 'next/dynamic'

// Same heavy modal as on /pokedex — defer until the user opens it.
const PokedexDetails = dynamic(
  () => import('@/components/pokedex/PokedexDetails').then((m) => m.PokedexDetails),
  { ssr: false },
)

const POKEMON_INDEX = new Map<number, PokemonEntry>(
  (pokemonData as PokemonEntry[]).map((p) => [p.id, p]),
)

export default function MissingPage() {
  const t = useTranslations('Missing')
  const registered = usePokedexStore((s) => s.registered)
  const variations = useSettingsStore((s) => s.variations)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const locale = useSettingsStore((s) => s.locale)
  const shinyTracker = useSettingsStore((s) => s.shinyTrackerEnabled)

  const [filters, setFilters] = React.useState<MissingFilterState>({
    generation: 'all',
    type: 'all',
    category: 'all',
    evolutionReadyOnly: false,
  })
  const [selected, setSelected] = React.useState<PokemonEntry | null>(null)
  const [exportOpen, setExportOpen] = React.useState(false)

  const registeredSet = React.useMemo(() => new Set(registered), [registered])
  const evolutionReadyIds = React.useMemo(
    () => computeEvolutionReady(registeredSet),
    [registeredSet],
  )

  const allMissing = React.useMemo(
    () =>
      buildMissingEntries(registeredSet, variations, activeGenerations, locale),
    [registeredSet, variations, activeGenerations, locale],
  )

  const filtered = React.useMemo(() => {
    let result: MissingEntry[] = allMissing
    if (filters.evolutionReadyOnly) {
      result = result.filter((e) => evolutionReadyIds.has(e.id))
    }
    // applyFiltersAndSort's CategoryFilter type only supports normal/legendary/mythical/all;
    // for the broader PokemonCategory set (baby, ultra-beast, paradox) we filter here.
    if (filters.category !== 'all') {
      result = result.filter((e) => e.category === filters.category)
    }
    return applyFiltersAndSort(result, {
      generations: filters.generation === 'all' ? [] : [filters.generation],
      type: filters.type === 'all' ? '' : filters.type,
      category: 'all',
      sort: 'dex',
    })
  }, [allMissing, filters, evolutionReadyIds])

  React.useEffect(() => {
    if (!exportOpen) return
    const onClick = () => setExportOpen(false)
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [exportOpen])

  // Render real page server-side; counts will flip when IndexedDB rehydrates.

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-6">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-xl">
              {t('subtitle')}
            </p>
          </div>
          <div className="relative">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                setExportOpen((p) => !p)
              }}
              disabled={filtered.length === 0}
            >
              <Download className="size-4" />
              {t('export.button')}
            </Button>
            {exportOpen && filtered.length > 0 && (
              <div
                className="absolute right-0 top-full mt-1 z-20 min-w-[200px] rounded-md border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-pop)] py-1"
                onClick={(e) => e.stopPropagation()}
                role="menu"
              >
                <ExportItem
                  icon={<FileText className="size-3.5" />}
                  label={t('export.json')}
                  onClick={() => {
                    exportMissingJson(filtered)
                    setExportOpen(false)
                  }}
                />
                <ExportItem
                  icon={<FileSpreadsheet className="size-3.5" />}
                  label={t('export.csv')}
                  onClick={() => {
                    exportMissingCsv(filtered)
                    setExportOpen(false)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </FadeIn>

      <MissingSummary
        total={allMissing.length}
        entries={allMissing}
        activeGenerations={activeGenerations}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        <MissingFilters
          state={filters}
          onChange={setFilters}
          generations={activeGenerations}
          resultCount={filtered.length}
          evolutionReadyCount={evolutionReadyIds.size}
        />

        <MissingList
          entries={filtered}
          evolutionReadyIds={evolutionReadyIds}
          onSelect={(entry) => {
            const pk = POKEMON_INDEX.get(entry.id)
            if (pk) setSelected(pk)
          }}
        />
      </div>

      {shinyTracker && (
        <ShinySuggestions
          onSelect={(p) => setSelected(p)}
        />
      )}

      <PokedexDetails pokemon={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function ExportItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-[var(--surface-2)] focus:bg-[var(--surface-2)] focus:outline-none"
    >
      <span className="text-[var(--muted-foreground)]">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
