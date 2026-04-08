'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type Locale = 'pt-BR' | 'en'

const STORAGE_KEY = 'poke-box-locale'

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'pt-BR'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'pt-BR' || stored === 'en') return stored
  return 'pt-BR'
}

export function LanguageSwitch() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  const toggle = () => {
    const next: Locale = locale === 'pt-BR' ? 'en' : 'pt-BR'
    setLocale(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label="Switch language"
      className="h-8 px-2 text-xs font-medium"
    >
      {locale === 'pt-BR' ? 'PT' : 'EN'}
    </Button>
  )
}
