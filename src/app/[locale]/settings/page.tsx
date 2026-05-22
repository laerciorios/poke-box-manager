'use client'

import * as React from 'react'
import { Sun, Moon, Monitor, Trash2, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { usePresetsStore } from '@/stores/usePresetsStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { FadeIn } from '@/components/motion'
import { VariationsPanel } from '@/components/settings/VariationsPanel'
import { GenerationsPanel } from '@/components/settings/GenerationsPanel'
import { SpriteStylePanel } from '@/components/settings/SpriteStylePanel'
import { TagsPanel } from '@/components/tags/TagsPanel'
import dynamic from 'next/dynamic'

// Backup/restore panel pulls in the import/export pipeline and a diff
// dialog — defer it until the user scrolls down to the section.
const BackupPanel = dynamic(
  () => import('@/components/settings/BackupPanel').then((m) => m.BackupPanel),
  { ssr: false, loading: () => <div className="h-32" aria-hidden /> },
)
import { useTagsStore } from '@/stores/useTagsStore'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const t = useTranslations('Settings')
  const tTags = useTranslations('Tags')
  const tagsCount = useTagsStore((s) => s.tags.length)
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const setLocale = useSettingsStore((s) => s.setLocale)
  const resetSettings = useSettingsStore((s) => s.resetSettings)
  const showNames = useSettingsStore((s) => s.showPokemonNamesInBox)
  const setShowNames = useSettingsStore((s) => s.setShowPokemonNamesInBox)
  const shinyTracker = useSettingsStore((s) => s.shinyTrackerEnabled)
  const setShinyTracker = useSettingsStore((s) => s.setShinyTrackerEnabled)
  const switchOnly = useSettingsStore((s) => s.availabilitySwitchOnly)
  const setSwitchOnly = useSettingsStore((s) => s.setAvailabilitySwitchOnly)

  const router = useRouter()
  const pathname = usePathname()
  const { locale } = useParams<{ locale: 'pt-BR' | 'en' }>()

  const boxes = useBoxStore((s) => s.boxes)
  const setBoxes = useBoxStore((s) => s.setBoxes)
  const clearPokedex = usePokedexStore((s) => s.clearAll)
  const registeredCount = usePokedexStore((s) => s.registered.length)

  const [resetInput, setResetInput] = React.useState('')

  const changeLocale = (next: 'pt-BR' | 'en') => {
    setLocale(next)
    router.replace(pathname, { locale: next })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
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

      <FadeIn delay={0.05}>
        <Section title={t('language.title')} description={t('language.description')}>
          <div className="flex gap-2">
            <Button
              variant={locale === 'pt-BR' ? 'accent' : 'outline'}
              onClick={() => changeLocale('pt-BR')}
            >
              Português (BR)
            </Button>
            <Button variant={locale === 'en' ? 'accent' : 'outline'} onClick={() => changeLocale('en')}>
              English
            </Button>
          </div>
        </Section>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Section title={t('generations.title')} description={t('generations.description')}>
          <GenerationsPanel />
        </Section>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Section title={t('variations.title')} description={t('variations.description')}>
          <VariationsPanel />
        </Section>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Section title={t('spriteStyle.title')} description={t('spriteStyle.description')}>
          <SpriteStylePanel />
        </Section>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Section title={t('preferences.title')}>
          <ul className="divide-y divide-[var(--border)]">
            <li className="flex items-center gap-3 py-2.5">
              <div className="flex-1 min-w-0">
                <label htmlFor="show-names" className="text-sm font-medium block">
                  {t('preferences.showNames')}
                </label>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {t('preferences.showNamesHint')}
                </p>
              </div>
              <Switch
                id="show-names"
                checked={showNames}
                onChange={setShowNames}
                aria-label={t('preferences.showNames')}
              />
            </li>
            <li className="flex items-center gap-3 py-2.5">
              <div className="flex-1 min-w-0">
                <label htmlFor="shiny-tracker" className="text-sm font-medium block">
                  {t('preferences.shinyTracker')}
                </label>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {t('preferences.shinyTrackerHint')}
                </p>
              </div>
              <Switch
                id="shiny-tracker"
                checked={shinyTracker}
                onChange={setShinyTracker}
                aria-label={t('preferences.shinyTracker')}
              />
            </li>
            <li className="flex items-center gap-3 py-2.5">
              <div className="flex-1 min-w-0">
                <label htmlFor="switch-only" className="text-sm font-medium block">
                  {t('preferences.switchOnly')}
                </label>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {t('preferences.switchOnlyHint')}
                </p>
              </div>
              <Switch
                id="switch-only"
                checked={switchOnly}
                onChange={setSwitchOnly}
                aria-label={t('preferences.switchOnly')}
              />
            </li>
          </ul>
        </Section>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Section
          title={tTags('sectionTitle')}
          description={tTags('sectionDescription', { count: tagsCount })}
        >
          <TagsPanel />
        </Section>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Section title={t('backup.title')} description={t('backup.description')}>
          <BackupPanel />
        </Section>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Section
          title={t('data.title')}
          description={t('data.description', { boxes: boxes.length, registered: registeredCount })}
        >
          <div className="rounded-md border border-[var(--warning)]/30 bg-[color-mix(in_oklch,var(--warning)_8%,transparent)] p-4 flex gap-3">
            <AlertTriangle className="size-4 shrink-0 text-[var(--warning)] mt-0.5" />
            <div className="flex-1 space-y-3">
              <p className="text-sm text-[var(--foreground)]">{t('data.warning')}</p>
              <div>
                <label className="text-xs text-[var(--muted-foreground)] block mb-1">
                  {t('data.confirmResetType')}
                </label>
                <Input
                  value={resetInput}
                  onChange={(e) => setResetInput(e.target.value)}
                  placeholder={t('data.confirmResetPlaceholder')}
                  className="max-w-[16rem]"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={resetInput !== 'RESET'}
                  onClick={() => {
                    if (window.confirm(t('data.confirmReset'))) {
                      setBoxes([])
                      clearPokedex()
                      usePresetsStore.setState({ presets: [] })
                      resetSettings()
                      setResetInput('')
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

      <FadeIn delay={0.05}>
        <Section title={t('about.title')} description={t('about.description')}>
          <p className="text-xs font-mono text-[var(--muted-foreground)]">v2.0.0 · Fase 2</p>
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
