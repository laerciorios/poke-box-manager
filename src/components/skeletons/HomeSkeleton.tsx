import { Skeleton } from '@/components/ui/skeleton'

/**
 * Matches DashboardOverview's layout: hero (eyebrow + title + CTA), ring +
 * 4 tiles, and the generations bars block. Sized so the eventual content
 * lands at roughly the same offsets, avoiding layout shift.
 */
export function HomeSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14" aria-busy="true" aria-live="polite">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 md:h-12 w-64" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-11 w-44 rounded-md" />
      </div>

      {/* Ring + tiles grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        <div className="lg:col-span-1">
          <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6 h-full flex flex-col items-center justify-center text-center gap-4">
            <Skeleton className="size-[200px] rounded-full" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-(--radius-lg) border border-[var(--border)] bg-[var(--card)] p-5 h-[120px] flex flex-col justify-between"
            >
              <Skeleton className="size-9 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generations bars block */}
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
        <Skeleton className="h-5 w-44 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
