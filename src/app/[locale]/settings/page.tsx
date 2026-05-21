'use client'

import { Sun, Moon, Monitor, Trash2, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const t = useTranslations('Settings')
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const setLocale = useSettingsStore((s) => s.setLocale)
  const resetSettings = useSettingsStore((s) => s.resetSettings)
  const router = useRouter()
  const pathname = usePathname()
  const { locale } = useParams<{ locale: 'pt-BR' | 'en' }>()

  const boxes = useBoxStore((s) => s.boxes)
  const setBoxes = useBoxStore((s) => s.setBoxes)
  const clearPokedex = usePokedexStore((s) => s.clearAll)
  const registeredCount = usePokedexStore((s) => s.registered.length)

  const changeLocale = (next: 'pt-BR' | 'en') => {
    setLocale(next)
    router.replace(pathname, { locale: next })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <FadeIn>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
            {t('eyebrow')}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{t('subtitle')}</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Section title={t('appearance.title')} description={t('appearance.description')}>
          <div className="flex gap-2">
            <ThemeButton
              active={theme === 'light'}
              onClick={() => setTheme('light')}
              icon={Sun}
              label={t('appearance.light')}
            />
            <ThemeButton
              active={theme === 'dark'}
              onClick={() => setTheme('dark')}
              icon={Moon}
              label={t('appearance.dark')}
            />
            <ThemeButton
              active={theme === 'system'}
              onClick={() => setTheme('system')}
              icon={Monitor}
              label={t('appearance.system')}
            />
          </div>
        </Section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Section title={t('language.title')} description={t('language.description')}>
          <div className="flex gap-2">
            <Button
              variant={locale === 'pt-BR' ? 'accent' : 'outline'}
              onClick={() => changeLocale('pt-BR')}
            >
              Português (BR)
            </Button>
            <Button
              variant={locale === 'en' ? 'accent' : 'outline'}
              onClick={() => changeLocale('en')}
            >
              English
            </Button>
          </div>
        </Section>
      </FadeIn>

      <FadeIn delay={0.15}>
        <Section
          title={t('data.title')}
          description={t('data.description', { boxes: boxes.length, registered: registeredCount })}
        >
          <div className="rounded-md border border-[var(--warning)]/30 bg-[color-mix(in_oklch,var(--warning)_8%,transparent)] p-4 flex gap-3">
            <AlertTriangle className="size-4 shrink-0 text-[var(--warning)] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[var(--foreground)] mb-3">{t('data.warning')}</p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(t('data.confirmReset'))) {
                      setBoxes([])
                      clearPokedex()
                      resetSettings()
                    }
                  }}
                >
                  <Trash2 className="size-3.5" />
                  {t('data.reset')}
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Section title={t('about.title')} description={t('about.description')}>
          <p className="text-xs font-mono text-[var(--muted-foreground)]">v2.0.0 · Fase 1</p>
        </Section>
      </FadeIn>
    </div>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-[var(--muted-foreground)] mb-5">{description}</p>
      )}
      <div className={description ? '' : 'mt-5'}>{children}</div>
    </section>
  )
}

function ThemeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 rounded-md border px-3 py-3 flex flex-col items-center gap-1.5 transition-colors',
        active
          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
          : 'border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--foreground)]',
      )}
      aria-pressed={active}
    >
      <Icon className="size-4" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
