'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export function LanguageSwitch() {
  const t = useTranslations('Layout')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    const next = locale === 'pt-BR' ? 'en' : 'pt-BR'
    router.replace(pathname, { locale: next })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={t('switchLanguage')}
      className="h-8 px-2 text-xs font-medium"
    >
      {locale === 'pt-BR' ? 'PT' : 'EN'}
    </Button>
  )
}
