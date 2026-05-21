'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ' +
    'transition-[color,background-color,box-shadow,transform] duration-150 ease-out ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--background) ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    'active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[color-mix(in_oklch,var(--primary)_92%,white)]',
        secondary:
          'bg-[var(--surface-2)] text-[var(--foreground)] hover:bg-[var(--surface-3)] border border-[var(--border)]',
        outline:
          'bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)]',
        ghost:
          'bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-2)]',
        accent:
          'bg-[var(--accent)] text-[var(--accent-foreground)] hover:brightness-110 shadow-[0_8px_24px_-8px_var(--accent)]',
        destructive:
          'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:brightness-110',
        link: 'bg-transparent text-[var(--accent)] underline-offset-4 hover:underline px-0',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-11 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      const child = props.children as React.ReactElement<{ className?: string }>
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size }), child.props.className, className),
      })
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
