import * as React from 'react'
import { cn } from '@/lib/utils'

interface Props {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

/**
 * Minimal empty state: small monochrome glyph, short title, optional one-line
 * hint, optional CTA. No oversized illustrations — they'd push the "missing
 * data" feeling into "broken page". Pair with a `lucide-react` icon at
 * `size-4` so it reads as a hint, not a billboard.
 */
export function EmptyState({ icon, title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6 gap-2',
        className,
      )}
    >
      {icon && (
        <div
          className="size-10 rounded-md bg-[var(--surface-2)] grid place-items-center text-[var(--muted-foreground)] mb-2"
          aria-hidden
        >
          {icon}
        </div>
      )}
      <p className="font-display text-base font-semibold tracking-tight">{title}</p>
      {description && (
        <p className="text-sm text-[var(--muted-foreground)] max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
