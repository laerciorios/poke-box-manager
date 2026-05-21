'use client'

import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ComingSoon } from '@/components/layout/ComingSoon'

export default function MissingPage() {
  const t = useTranslations('Missing')
  return (
    <ComingSoon
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      bullets={t.raw('bullets') as string[]}
      icon={Search}
      accentColor="var(--warning)"
    />
  )
}
