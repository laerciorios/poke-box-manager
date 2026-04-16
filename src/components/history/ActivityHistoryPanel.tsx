'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function relativeTime(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 60) return `${diff}s ago`
  const mins = Math.floor(diff / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function ActivityHistoryPanel() {
  const t = useTranslations('ActivityHistory')
  const [isOpen, setIsOpen] = useState(false)

  const entries = useHistoryStore((s) => s.entries)
  const undoLast = useHistoryStore((s) => s.undoLast)

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{t('title')}</span>
          {entries.length > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {entries.length}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-border">
          {entries.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">{t('emptyState')}</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto divide-y divide-border">
              {entries.map((entry, index) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-2">
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-sm truncate', index > 0 && 'text-muted-foreground')}>
                      {entry.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{relativeTime(entry.timestamp)}</p>
                  </div>
                  {index === 0 && (
                    <Button variant="outline" size="sm" onClick={undoLast} className="shrink-0 h-7 px-2 text-xs">
                      {t('undo')}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
