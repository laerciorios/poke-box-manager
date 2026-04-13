'use client'

import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SortKey = 'dex' | 'name' | 'type' | 'generation'
export type SortDir = 'asc' | 'desc'

interface PokedexSortHeaderProps {
  label: string
  sortKey: SortKey
  activeSortKey: SortKey
  dir: SortDir
  onSort: (key: SortKey, dir: SortDir) => void
  className?: string
  align?: 'left' | 'right' | 'center'
}

export function PokedexSortHeader({
  label,
  sortKey,
  activeSortKey,
  dir,
  onSort,
  className,
  align = 'left',
}: PokedexSortHeaderProps) {
  const isActive = activeSortKey === sortKey

  function handleClick() {
    if (isActive) {
      onSort(sortKey, dir === 'asc' ? 'desc' : 'asc')
    } else {
      onSort(sortKey, 'asc')
    }
  }

  return (
    <div
      role="columnheader"
      aria-sort={isActive ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn(
        'cursor-pointer select-none px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground',
        isActive && 'text-foreground',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
      onClick={handleClick}
    >
      <span className={cn('inline-flex items-center gap-1', align === 'right' && 'flex-row-reverse')}>
        {label}
        {isActive ? (
          dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
        ) : (
          <ArrowUpDown size={12} className="opacity-40" />
        )}
      </span>
    </div>
  )
}
