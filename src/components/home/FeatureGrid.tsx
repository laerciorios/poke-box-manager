'use client'

import { Grid3x3, BookOpen, BarChart3, Layers, Search, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/motion'

const FEATURES = [
  { icon: Grid3x3, key: 'boxes' as const, color: 'var(--accent)' },
  { icon: BookOpen, key: 'pokedex' as const, color: 'var(--registered)' },
  { icon: BarChart3, key: 'stats' as const, color: 'var(--shiny)' },
  { icon: Layers, key: 'presets' as const, color: 'var(--accent)' },
  { icon: Search, key: 'missing' as const, color: 'var(--warning)' },
  { icon: Lock, key: 'offline' as const, color: 'var(--registered)' },
]

export function FeatureGrid() {
  const t = useTranslations('Landing.features')

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <Reveal>
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--accent)] mb-3">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            {t('title')}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-[var(--muted-foreground)]">
            {t('subtitle')}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <Reveal key={feature.key} delay={idx * 0.05}>
              <div className="group relative rounded-(--radius-lg) border border-[var(--border)] bg-[var(--card)] p-6 h-full lift">
                <div
                  className="size-10 rounded-md grid place-items-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${feature.color} 14%, transparent)`,
                    color: feature.color,
                  }}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-1.5 tracking-tight">
                  {t(`items.${feature.key}.title`)}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {t(`items.${feature.key}.description`)}
                </p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
