'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/tags'

interface TagFilterPanelProps {
  tags: Tag[]
  selectedTagIds: Set<string>
  onToggle: (tagId: string) => void
}

export function TagFilterPanel({ tags, selectedTagIds, onToggle }: TagFilterPanelProps) {
  const tTags = useTranslations('Tags')

  if (!tags.length) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={tTags('filterLabel')}>
      {tags.map((tag) => {
        const active = selectedTagIds.has(tag.id)
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onToggle(tag.id)}
            aria-pressed={active}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors',
              active
                ? 'text-white border-transparent'
                : 'bg-background border-border text-foreground hover:bg-muted',
            )}
            style={active ? { backgroundColor: tag.color, borderColor: tag.color } : {}}
          >
            <span
              className="inline-block rounded-full shrink-0"
              style={{ backgroundColor: active ? 'rgba(255,255,255,0.6)' : tag.color, width: 6, height: 6 }}
            />
            {tag.name}
          </button>
        )
      })}
    </div>
  )
}
