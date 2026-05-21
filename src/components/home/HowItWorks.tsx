'use client'

import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/motion'

const STEPS = ['create', 'register', 'organize', 'track'] as const

export function HowItWorks() {
  const t = useTranslations('Landing.howItWorks')

  return (
    <section className="bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--accent)] mb-3">
              {t('eyebrow')}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t('title')}
            </h2>
          </div>
        </Reveal>

        <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
          {STEPS.map((step, idx) => (
            <Reveal key={step} delay={idx * 0.1}>
              <li className="relative">
                <div className="flex items-start gap-4 md:flex-col md:items-start md:gap-3">
                  <div className="flex items-center gap-3 md:w-full">
                    <span className="grid place-items-center size-9 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] font-display font-semibold text-base">
                      {idx + 1}
                    </span>
                    <span className="hidden md:flex flex-1 h-px bg-[var(--border)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-base mb-1.5 tracking-tight">
                      {t(`steps.${step}.title`)}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {t(`steps.${step}.description`)}
                    </p>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
