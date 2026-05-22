'use client'

import * as React from 'react'
import { Moon, Sun, Languages, History, Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import { useHistoryController } from '@/components/history/HistoryController'
import { useServiceWorker } from '@/components/layout/ServiceWorkerProvider'

export function Header() {
  const tApp = useTranslations('Layout')
  const tHist = useTranslations('History')
  const tSw = useTranslations('Layout.update')
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const setLocale = useSettingsStore((s) => s.setLocale)
  const historyCount = useHistoryStore((s) => s.entries.length)
  const { toggle: toggleHistory } = useHistoryController()
  const { updateAvailable, applyUpdate } = useServiceWorker()
  const router = useRouter()
  const pathname = usePathname()
  const { locale } = useParams<{ locale: 'pt-BR' | 'en' }>()

  const toggleTheme = () => {
    const resolved =
      theme === 'system'
        ? typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }

  const toggleLocale = () => {
    const next = locale === 'pt-BR' ? 'en' : 'pt-BR'
    setLocale(next)
    router.replace(pathname, { locale: next })
  }

  return (
    <header className="h-16 shrink-0 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-5 md:px-8">
        <div className="md:hidden flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5 size-6">
            <span className="rounded-[2px] bg-[var(--accent)]" />
            <span className="rounded-[2px] bg-[var(--shiny)]" />
            <span className="rounded-[2px] bg-[var(--registered)]" />
            <span className="rounded-[2px] bg-[var(--muted-foreground)]" />
          </div>
          <span className="font-display font-semibold">{tApp('appName')}</span>
        </div>

        <div className="hidden md:block" />

        <div className="flex items-center gap-2">
          {updateAvailable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={applyUpdate}
              aria-label={tSw('available')}
              title={tSw('available')}
              className="relative"
            >
              <Download className="size-4 text-[var(--accent)]" />
              <span
                className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[var(--accent)]"
                aria-hidden
              />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleHistory}
            aria-label={tHist('open')}
            title={tHist('openShortcut')}
            className="relative"
          >
            <History className="size-4" />
            {historyCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[var(--accent)]"
                aria-hidden
              />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLocale}
            aria-label={tApp('switchLanguage')}
            title={locale === 'pt-BR' ? 'Switch to English' : 'Trocar para português'}
          >
            <Languages className="size-4" />
            <span className="sr-only">{tApp('switchLanguage')}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={tApp('toggleTheme')}
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="size-4 hidden dark:block" />
          </Button>
        </div>
      </div>
    </header>
  )
}
