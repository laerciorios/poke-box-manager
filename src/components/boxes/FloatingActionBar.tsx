'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, Circle, Eraser, MoveRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  count: number
  onClear: () => void
  onMarkRegistered: () => void
  onUnmarkRegistered: () => void
  onClearSlots: () => void
  onMoveTo: () => void
}

export function FloatingActionBar({
  count,
  onClear,
  onMarkRegistered,
  onUnmarkRegistered,
  onClearSlots,
  onMoveTo,
}: Props) {
  const t = useTranslations('Boxes.selection')
  const reduce = useReducedMotion()

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-2rem)]"
        >
          <div className="flex items-center gap-2 rounded-(--radius-pill) border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-pop)] px-3 py-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={onClear}
              aria-label={t('clear')}
              title={t('clear')}
            >
              <X className="size-4" />
            </Button>
            <span className="text-sm font-medium tabular-nums px-1">
              {count === 1 ? t('count', { count }) : t('countPlural', { count })}
            </span>
            <div className="h-5 w-px bg-[var(--border)]" />
            <Button size="sm" variant="ghost" onClick={onMarkRegistered}>
              <CheckCircle2 className="size-3.5" />
              <span className="hidden sm:inline">{t('markRegistered')}</span>
            </Button>
            <Button size="sm" variant="ghost" onClick={onUnmarkRegistered}>
              <Circle className="size-3.5" />
              <span className="hidden sm:inline">{t('unmarkRegistered')}</span>
            </Button>
            <Button size="sm" variant="ghost" onClick={onMoveTo}>
              <MoveRight className="size-3.5" />
              <span className="hidden sm:inline">{t('moveTo')}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSlots}
              className="text-[var(--destructive)]"
            >
              <Eraser className="size-3.5" />
              <span className="hidden sm:inline">{t('clearSlots')}</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
