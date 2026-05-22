import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Base skeleton block. Pulse is CSS-only (no JS); the @media (prefers-reduced-motion)
 * rule in globals.css already neutralizes `animate-pulse`, so the block stays static
 * for users who opted out.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse rounded-md bg-[var(--surface-2)]',
        className,
      )}
      {...props}
    />
  )
}
