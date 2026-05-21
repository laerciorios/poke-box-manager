'use client'

import { motion, useReducedMotion } from 'motion/react'
import {
  Grid3x3,
  BookOpen,
  Sparkles,
  Layers,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useStatsData } from '@/hooks/useStatsData'
import { useBoxStore } from '@/stores/useBoxStore'
import { ProgressRing } from '@/components/ui/progress-ring'
import { Button } from '@/components/ui/button'
import { FadeIn, Stagger, StaggerItem, CountUp } from '@/components/motion'

export function DashboardOverview() {
  const t = useTranslations('Dashboard')
  const stats = useStatsData()
  const boxes = useBoxStore((s) => s.boxes)
  const reduce = useReducedMotion()

  const filledSlots = boxes.reduce(
    (sum, b) => sum + b.slots.filter(Boolean).length,
    0,
  )
  const totalSlots = boxes.length * 30
  const shinyCount = boxes.reduce(
    (sum, b) => sum + b.slots.filter((s) => s?.shiny).length,
    0,
  )

  const tiles = [
    {
      key: 'boxes' as const,
      icon: Grid3x3,
      value: boxes.length,
      color: 'var(--accent)',
      href: '/boxes',
    },
    {
      key: 'pokemon' as const,
      icon: BookOpen,
      value: filledSlots,
      total: totalSlots,
      color: 'var(--registered)',
      href: '/boxes',
    },
    {
      key: 'registered' as const,
      icon: TrendingUp,
      value: stats.overall.registered,
      total: stats.overall.total,
      color: 'var(--accent)',
      href: '/pokedex',
    },
    {
      key: 'shiny' as const,
      icon: Sparkles,
      value: shinyCount,
      color: 'var(--shiny)',
      href: '/boxes',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              {t('subtitle', { percentage: stats.overall.percentage })}
            </p>
          </div>
          <Button asChild variant="accent" size="lg">
            <Link href="/boxes">
              {t('continue')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        <FadeIn delay={0.1} className="lg:col-span-1">
          <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6 h-full flex flex-col items-center justify-center text-center">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-4">
              {t('overall')}
            </p>
            <ProgressRing
              value={stats.overall.percentage / 100}
              size={200}
              strokeWidth={14}
              label={
                <div className="text-center">
                  <div className="font-display text-4xl font-semibold tracking-tight tabular-nums">
                    {stats.overall.percentage.toFixed(1)}
                    <span className="text-[var(--muted-foreground)] text-2xl">%</span>
                  </div>
                  <div className="text-xs font-mono text-[var(--muted-foreground)] mt-1">
                    {stats.overall.registered} / {stats.overall.total}
                  </div>
                </div>
              }
            />
            <p className="text-sm text-[var(--muted-foreground)] mt-4 max-w-xs">
              {t('overallHint')}
            </p>
          </div>
        </FadeIn>

        <div className="lg:col-span-2 grid grid-cols-2 gap-5">
          <Stagger className="contents">
            {tiles.map((tile) => {
              const Icon = tile.icon
              return (
                <StaggerItem key={tile.key}>
                  <Link
                    href={tile.href}
                    className="block rounded-(--radius-lg) border border-[var(--border)] bg-[var(--card)] p-5 lift h-full"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="size-9 rounded-md grid place-items-center"
                        style={{
                          backgroundColor: `color-mix(in oklch, ${tile.color} 14%, transparent)`,
                          color: tile.color,
                        }}
                      >
                        <Icon className="size-4" />
                      </div>
                      <ArrowRight className="size-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-1">
                      {t(`tiles.${tile.key}.label`)}
                    </p>
                    <p className="font-display text-3xl font-semibold tracking-tight tabular-nums">
                      <CountUp to={tile.value} />
                      {tile.total !== undefined && (
                        <span className="text-base text-[var(--muted-foreground)] font-mono ml-1.5">
                          / {tile.total.toLocaleString()}
                        </span>
                      )}
                    </p>
                  </Link>
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>
      </div>

      <FadeIn delay={0.3}>
        <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                {t('generations')}
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {t('generationsHint')}
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/stats">
                {t('seeStats')}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <div className="space-y-2.5">
            {stats.byGeneration.map((gen, idx) => {
              const pct = gen.total > 0 ? gen.registered / gen.total : 0
              return (
                <div key={gen.id} className="group">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium">{gen.name}</span>
                    <span className="font-mono text-[var(--muted-foreground)] tabular-nums">
                      {gen.registered} / {gen.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--shiny)]"
                      initial={reduce ? { width: `${pct * 100}%` } : { width: 0 }}
                      animate={{ width: `${pct * 100}%` }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : {
                              duration: 1,
                              delay: 0.4 + idx * 0.05,
                              ease: [0.22, 1, 0.36, 1],
                            }
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.4}>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <QuickAction
            href="/boxes"
            icon={Grid3x3}
            title={t('actions.box.title')}
            description={t('actions.box.description')}
          />
          <QuickAction
            href="/pokedex"
            icon={BookOpen}
            title={t('actions.pokedex.title')}
            description={t('actions.pokedex.description')}
          />
          <QuickAction
            href="/presets"
            icon={Layers}
            title={t('actions.presets.title')}
            description={t('actions.presets.description')}
          />
        </div>
      </FadeIn>
    </div>
  )
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-(--radius-lg) border border-[var(--border)] bg-[var(--card)] p-4 flex items-center gap-3 lift"
    >
      <div className="size-9 rounded-md grid place-items-center bg-[var(--surface-2)] text-[var(--foreground)] group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)] transition-colors">
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-[var(--muted-foreground)] truncate">{description}</p>
      </div>
      <ArrowRight className="size-4 text-[var(--muted-foreground)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}
