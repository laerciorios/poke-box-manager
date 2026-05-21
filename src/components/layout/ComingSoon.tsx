'use client'

import { Sparkles, ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion'

interface Props {
  eyebrow: string
  title: string
  description: string
  bullets?: string[]
  icon?: React.ComponentType<{ className?: string }>
  accentColor?: string
}

export function ComingSoon({
  eyebrow,
  title,
  description,
  bullets = [],
  icon: Icon = Sparkles,
  accentColor = 'var(--accent)',
}: Props) {
  const tCommon = useTranslations('Common')

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <FadeIn>
        <div
          className="size-14 rounded-(--radius-lg) grid place-items-center mb-6"
          style={{
            backgroundColor: `color-mix(in oklch, ${accentColor} 14%, transparent)`,
            color: accentColor,
          }}
        >
          <Icon className="size-6" />
        </div>
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-3">
          {title}
        </h1>
        <p className="text-[var(--muted-foreground)] leading-relaxed text-base mb-8 max-w-xl">
          {description}
        </p>

        {bullets.length > 0 && (
          <ul className="space-y-2 mb-8 max-w-lg">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  aria-hidden
                />
                <span className="text-[var(--foreground)] leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        )}

        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="size-4" />
            {tCommon('backToHome')}
          </Link>
        </Button>
      </FadeIn>
    </div>
  )
}
