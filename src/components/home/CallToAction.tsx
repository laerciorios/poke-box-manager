'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/motion'

export function CallToAction() {
  const t = useTranslations('Landing.cta')

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-(--radius-xl) border border-[var(--border-strong)] bg-gradient-to-br from-[var(--card)] to-[var(--surface-3)] p-10 md:p-14 text-center">
          <div className="dot-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t('title')}
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-[var(--muted-foreground)]">
              {t('subtitle')}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/boxes">
                  {t('primary')}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/pokedex">{t('secondary')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
