import { Skeleton } from '@/components/ui/skeleton'

export function BoxesSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10" aria-busy="true">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 md:h-12 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* Single box: header + 6×5 grid */}
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="grid grid-cols-6 gap-1.5 md:gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}
