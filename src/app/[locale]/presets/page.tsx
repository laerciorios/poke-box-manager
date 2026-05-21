'use client'

import { Layers } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ComingSoon } from '@/components/layout/ComingSoon'

export default function PresetsPage() {
  const t = useTranslations('Presets')
  return (
    <ComingSoon
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      bullets={t.raw('bullets') as string[]}
      icon={Layers}
      accentColor="var(--accent)"
    />
  )
}
