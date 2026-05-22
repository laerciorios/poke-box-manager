'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useSettingsStore } from '@/stores/useSettingsStore'

/**
 * Mirrors the Pokédex page chrome: search/filter/view-toggle bar plus a
 * vertical list of placeholder rows that matches whichever mode (table/grid)
 * the user previously selected, so the swap to real data doesn't shift content.
 */
export function PokedexSkeleton() {
  const view = useSettingsStore((s) => s.pokedexView)
  const isGrid = view === 'grid'
  const items = Array.from({ length: 12 })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10" aria-busy="true">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 md:h-12 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-40 rounded-md" />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Skeleton className="h-9 flex-1 min-w-[200px] rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      {isGrid ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((_, i) => (
            <div key={i} className="rounded-(--radius-lg) border border-[var(--border)] bg-[var(--card)] p-3 space-y-2">
              <Skeleton className="size-16 rounded-md mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
              <Skeleton className="h-3.5 w-20 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-(--radius-lg) border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          {items.map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border)] last:border-b-0"
            >
              <Skeleton className="size-10 rounded-md shrink-0" />
              <Skeleton className="h-3 w-10 shrink-0" />
              <Skeleton className="h-4 flex-1 max-w-[180px]" />
              <Skeleton className="h-5 w-12 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-md hidden sm:block" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
