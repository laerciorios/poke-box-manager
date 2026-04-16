'use client'

import { useTranslations } from 'next-intl'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FloatingActionBarProps {
  selectedCount: number
  onMarkRegistered: () => void
  onUnmark: () => void
}

export function FloatingActionBar({
  selectedCount,
  onMarkRegistered,
  onUnmark,
}: FloatingActionBarProps) {
  const t = useTranslations('FloatingBar')
  if (selectedCount === 0) return null

  return (
    <div role="toolbar" className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 shadow-md">
      <span className="text-sm text-muted-foreground">{t('selected', { count: selectedCount })}</span>
      <Button size="sm" onClick={onMarkRegistered}>
        <CheckCircle className="size-3.5" />
        {t('markAsRegistered')}
      </Button>
      <Button size="sm" variant="outline" onClick={onUnmark}>
        <XCircle className="size-3.5" />
        {t('unmark')}
      </Button>
    </div>
  )
}
