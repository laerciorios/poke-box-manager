import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-(--radius-pill) px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--primary)] text-[var(--primary-foreground)]',
        secondary:
          'bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border)]',
        outline:
          'bg-transparent text-[var(--foreground)] border border-[var(--border)]',
        accent:
          'bg-[var(--accent-soft)] text-[var(--accent)]',
        registered:
          'bg-[var(--registered-soft)] text-[var(--registered)]',
        shiny:
          'bg-[var(--shiny-soft)] text-[var(--shiny)]',
        warning:
          'bg-[color-mix(in_oklch,var(--warning)_15%,transparent)] text-[var(--warning)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
