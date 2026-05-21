'use client'

import * as React from 'react'
import { Moon, Sun, Languages } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useParams } from 'next/navigation'

export function Header() {
  const tApp = useTranslations('Layout')
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const setLocale = useSettingsStore((s) => s.setLocale)
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
