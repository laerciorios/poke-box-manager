import type { Locale } from '@/types/locale'

const UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> = [
  { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
  { unit: 'second', ms: 1000 },
]

const localeMap: Record<Locale, string> = {
  'pt-BR': 'pt-BR',
  en: 'en-US',
}

const JUST_NOW: Record<Locale, string> = {
  'pt-BR': 'agora',
  en: 'just now',
}

export function formatRelativeTime(timestamp: number, locale: Locale): string {
  const diff = timestamp - Date.now()
  const abs = Math.abs(diff)
  if (abs < 45_000) return JUST_NOW[locale]

  const rtf = new Intl.RelativeTimeFormat(localeMap[locale] ?? 'en-US', {
    numeric: 'auto',
    style: 'short',
  })

  for (const { unit, ms } of UNITS) {
    if (abs >= ms || unit === 'second') {
      const value = Math.round(diff / ms)
      return rtf.format(value, unit)
    }
  }
  return JUST_NOW[locale]
}
