'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion'

export function LandingHero() {
  const t = useTranslations('Landing.hero')
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden">
      <div className="aurora-bg" aria-hidden />
      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
        <FadeIn delay={0.05}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
            <Sparkles className="size-3 text-[var(--accent)]" />
            {t('badge')}
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
            {t.rich('title', {
              em: (chunks) => (
                <span className="bg-gradient-to-br from-[var(--accent)] via-[var(--shiny)] to-[var(--registered)] bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
            })}
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed">
            {t('subtitle')}
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="accent" className="gradient-border">
              <Link href="/boxes">
                {t('cta')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pokedex">{t('ctaSecondary')}</Link>
            </Button>
          </div>
        </FadeIn>

        <motion.div
          className="mt-16 mx-auto max-w-3xl"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <PreviewBox />
        </motion.div>
      </div>
    </section>
  )
}

function PreviewBox() {
  const reduce = useReducedMotion()
  return (
    <div className="relative rounded-(--radius-xl) border border-[var(--border-strong)] bg-[var(--surface)] p-4 md:p-6 shadow-[var(--shadow-pop)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-mono text-[var(--muted-foreground)]">Box 03 · Hisui</span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]">
          22 / 30
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1.5 md:gap-2 aspect-[6/5]">
        {Array.from({ length: 30 }).map((_, i) => {
          const filled = i % 7 !== 0 && i % 11 !== 3
          const shiny = i === 4 || i === 17
          return (
            <motion.div
              key={i}
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.4, delay: 0.6 + i * 0.018, ease: [0.22, 1, 0.36, 1] }
              }
              className={
                'relative aspect-square rounded-md ' +
                (filled
                  ? 'bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)] border border-[var(--border-strong)]'
                  : 'bg-[var(--surface-2)]/40 border border-dashed border-[var(--border)]')
              }
            >
              {filled && (
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-[var(--registered)]" />
              )}
              {shiny && (
                <span className="absolute top-1 left-1 size-1.5 rounded-full bg-[var(--shiny)]" />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
