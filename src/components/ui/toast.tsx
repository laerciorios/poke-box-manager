'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'default' | 'success' | 'warning' | 'destructive'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  /** Auto-dismiss after this many ms. Default 4000. Set 0 to disable. */
  duration?: number
}

interface ToastContextValue {
  push: (toast: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue>({
  push: () => '',
  dismiss: () => {},
})

export function useToast(): ToastContextValue {
  return React.useContext(ToastContext)
}

const MAX_TOASTS = 3

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const reduce = useReducedMotion()

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = React.useCallback<ToastContextValue['push']>(
    (input) => {
      const id =
        (typeof crypto !== 'undefined' && crypto.randomUUID?.()) ||
        `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const duration = input.duration ?? 4000
      setToasts((prev) => {
        // Keep the newest at the top of the visual stack (rendered last so it
        // pops above older ones). Cap at MAX_TOASTS by dropping oldest.
        const next = [...prev, { ...input, id }]
        return next.slice(-MAX_TOASTS)
      })
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        role="status"
        className="fixed bottom-4 right-4 z-[80] flex flex-col-reverse gap-2 max-w-[min(360px,calc(100vw-2rem))] pointer-events-none"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout={!reduce}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
              }
              className={cn(
                'pointer-events-auto rounded-(--radius-md) border bg-[var(--card)] shadow-[var(--shadow-pop)]',
                'px-3.5 py-2.5 flex items-start gap-3',
                VARIANT_CLASS[toast.variant ?? 'default'],
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-snug">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss"
                className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] -mr-1 mt-0.5"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// Variants stay quiet — only the left border picks up the semantic color so
// the toast doesn't read like a celebration. No emojis, no icons.
const VARIANT_CLASS: Record<ToastVariant, string> = {
  default: 'border-[var(--border)]',
  success: 'border-[var(--border)] border-l-2 border-l-[var(--registered)]',
  warning: 'border-[var(--border)] border-l-2 border-l-[var(--warning)]',
  destructive: 'border-[var(--border)] border-l-2 border-l-[var(--destructive)]',
}
