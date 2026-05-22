import { Skeleton } from '@/components/ui/skeleton'

export function MissingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-6" aria-busy="true">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 md:h-12 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      {/* Summary card */}
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-56" />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-(--radius-pill)" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        {/* Filters */}
        <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 4 }).map((__, j) => (
                  <Skeleton key={j} className="h-8 w-16 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* List */}
        <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-b-0"
            >
              <Skeleton className="size-12 rounded-md shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
