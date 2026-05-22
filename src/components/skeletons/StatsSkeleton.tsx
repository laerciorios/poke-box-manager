import { Skeleton } from '@/components/ui/skeleton'

export function StatsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-6" aria-busy="true">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 md:h-12 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-44 rounded-md" />
      </div>

      {/* Hero: ring + tiles */}
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center">
        <Skeleton className="size-[200px] rounded-full justify-self-center md:justify-self-start" />
        <div className="space-y-5 w-full">
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-3.5 w-72" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[72px] rounded-md" />
            ))}
          </div>
        </div>
      </div>

      {/* Generations bars + milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] rounded-(--radius-xl)" />
        <Skeleton className="h-[300px] rounded-(--radius-xl)" />
      </div>

      {/* Box heatmap */}
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
        <Skeleton className="h-4 w-36 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] rounded-(--radius-md)" />
          ))}
        </div>
      </div>

      {/* Type grid: 18 tiles */}
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
        <Skeleton className="h-4 w-36 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <Skeleton key={i} className="h-[80px] rounded-(--radius-md)" />
          ))}
        </div>
      </div>
    </div>
  )
}
