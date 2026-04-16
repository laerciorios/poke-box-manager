'use client'

import { useTranslations } from 'next-intl'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RegistrationModeToggleProps {
  isActive: boolean
  onToggle: () => void
}

export function RegistrationModeToggle({ isActive, onToggle }: RegistrationModeToggleProps) {
  const t = useTranslations('Boxes')
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={onToggle}
      aria-pressed={isActive}
      aria-label={t('registrationMode')}
    >
      <BookOpen className="size-3.5" />
      {t('registrationMode')}
    </Button>
  )
}
