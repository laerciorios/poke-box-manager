'use client'

import { BarChart3 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ComingSoon } from '@/components/layout/ComingSoon'

export default function StatsPage() {
  const t = useTranslations('Stats')
  return (
    <ComingSoon
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      bullets={t.raw('bullets') as string[]}
      icon={BarChart3}
      accentColor="var(--shiny)"
    />
  )
}
