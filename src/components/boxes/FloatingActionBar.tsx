'use client'

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
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 shadow-md">
      <span className="text-sm text-muted-foreground">{selectedCount} selected</span>
      <Button size="sm" onClick={onMarkRegistered}>
        <CheckCircle className="size-3.5" />
        Mark as registered
      </Button>
      <Button size="sm" variant="outline" onClick={onUnmark}>
        <XCircle className="size-3.5" />
        Unmark
      </Button>
    </div>
  )
}
