'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { FadeIn } from '@/components/motion'

const MILESTONES = [100, 250, 500, 1000, 1300] as const

interface Props {
  registered: number
  fillColor?: string
  /** When true (shiny tab) suppress descriptive copy because the section heading already labels it. */
  compact?: boolean
}

export function MilestonesRow({
  registered,
  fillColor = 'var(--registered)',
  compact = false,
}: Props) {
  const t = useTranslations('Stats')
  const reduce = useReducedMotion()

  // Find the next unreached milestone (or null when everything is done)
  const nextIdx = MILESTONES.findIndex((m) => m > registered)

  return (
    <FadeIn delay={0.25}>
      <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
        {!compact && (
          <div className="mb-5">
            <h3 className="font-display text-base font-semibold tracking-tight">
              {t('milestones.title')}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {t('milestones.description')}
            </p>
          </div>
        )}

        <div className="relative">
          {/* Track */}
          <div
            className="absolute left-0 right-0 top-1/2 h-px bg-[var(--border)]"
            style={{ marginTop: '-0.5px' }}
            aria-hidden
          />

          <ol className="relative flex items-center justify-between gap-2">
            {MILESTONES.map((threshold, idx) => {
              const reached = registered >= threshold
              const isNext = idx === nextIdx
              return (
                <li
                  key={threshold}
                  className="flex flex-col items-center min-w-0"
                  aria-label={t(
                    reached ? 'milestones.reached' : isNext ? 'milestones.next' : 'milestones.future',
                    { threshold },
                  )}
                >
                  <span className="relative grid place-items-center">
                    {isNext && !reached && !reduce && (
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: fillColor }}
                        animate={{
                          opacity: [0.45, 0.08, 0.45],
                          scale: [1, 1.9, 1],
                        }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        aria-hidden
                      />
                    )}
                    <span
                      className="relative size-3 rounded-full border-2 transition-colors"
                      style={{
                        backgroundColor: reached ? fillColor : 'var(--background)',
                        borderColor: reached
                          ? fillColor
                          : isNext
                            ? fillColor
                            : 'var(--border-strong)',
                      }}
                    />
                  </span>
                  <span className="mt-2 font-mono text-[11px] tabular-nums text-[var(--muted-foreground)]">
                    {threshold.toLocaleString()}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>

        <p className="mt-4 text-xs text-[var(--muted-foreground)] font-mono tabular-nums">
          {t('milestones.current', { count: registered })}
        </p>
      </div>
    </FadeIn>
  )
}
