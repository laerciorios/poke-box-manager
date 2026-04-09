'use client'

import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RegistrationModeToggleProps {
  isActive: boolean
  onToggle: () => void
}

export function RegistrationModeToggle({ isActive, onToggle }: RegistrationModeToggleProps) {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={onToggle}
      aria-pressed={isActive}
    >
      <BookOpen className="size-3.5" />
      Registration Mode
    </Button>
  )
}
