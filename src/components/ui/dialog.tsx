'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeLabel?: string
  className?: string
}

const SIZE_CLASS: Record<NonNullable<DialogProps['size']>, string> = {
  sm: 'w-[min(420px,92vw)]',
  md: 'w-[min(560px,92vw)]',
  lg: 'w-[min(720px,94vw)]',
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeLabel = 'Close',
  className,
}: DialogProps) {
  const reduce = useReducedMotion()

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : undefined}
            className={cn(
              'fixed left-1/2 top-[10vh] -translate-x-1/2 z-50 rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-pop)] overflow-hidden flex flex-col max-h-[80vh]',
              SIZE_CLASS[size],
              className,
            )}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {(title || description) && (
              <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--border)]">
                <div className="min-w-0">
                  {title && (
                    <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
                  )}
                  {description && (
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{description}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label={closeLabel}>
                  <X className="size-4" />
                </Button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-2)]/40">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
