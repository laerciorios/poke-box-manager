'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Plus, Grid3x3 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useBoxStore } from '@/stores/useBoxStore'
import { Button } from '@/components/ui/button'
import { BoxView } from '@/components/boxes/BoxView'
import { FadeIn } from '@/components/motion'

export default function BoxesPage() {
  const t = useTranslations('Boxes')
  const boxes = useBoxStore((s) => s.boxes)
  const addBox = useBoxStore((s) => s.addBox)
  const reduce = useReducedMotion()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <FadeIn>
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{t('subtitle')}</p>
          </div>
          <Button variant="accent" onClick={addBox}>
            <Plus className="size-4" />
            {t('addBox')}
          </Button>
        </div>
      </FadeIn>

      {boxes.length === 0 ? (
        <FadeIn delay={0.1}>
          <div className="rounded-(--radius-xl) border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <div className="mx-auto size-12 rounded-md bg-[var(--accent-soft)] grid place-items-center text-[var(--accent)] mb-4">
              <Grid3x3 className="size-6" />
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">{t('emptyTitle')}</h2>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto mb-6">
              {t('emptyDescription')}
            </p>
            <Button variant="accent" onClick={addBox}>
              <Plus className="size-4" />
              {t('createFirst')}
            </Button>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {boxes.map((box, idx) => (
              <motion.div
                key={box.id}
                layout={!reduce}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                }
              >
                <BoxView box={box} index={idx} total={boxes.length} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
