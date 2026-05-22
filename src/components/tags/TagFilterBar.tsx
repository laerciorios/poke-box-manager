'use client'

import { Tags as TagsIcon, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTagsStore } from '@/stores/useTagsStore'
import { tagForeground } from '@/lib/tag-colors'
import { cn } from '@/lib/utils'

interface Props {
  selected: string[]
  onChange: (next: string[]) => void
}

/**
 * Multi-select tag filter chips. Selecting tags makes non-matching slots fade out
 * (the actual fade-out is applied in BoxView via the `dimmedSlotIds` mechanism).
 */
export function TagFilterBar({ selected, onChange }: Props) {
  const t = useTranslations('Tags')
  const tags = useTagsStore((s) => s.tags)

  if (tags.length === 0) return null

  const set = new Set(selected)

  function toggle(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange(Array.from(next))
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)] mr-1">
        <TagsIcon className="size-3" aria-hidden />
        {t('filterLabel')}
      </span>
      {tags.map((tag) => {
        const active = set.has(tag.id)
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            aria-pressed={active}
            className={cn(
              'inline-flex items-center gap-1 h-6 rounded-(--radius-pill) px-2 text-[11px] font-semibold transition-all',
              active
                ? 'shadow-[var(--shadow-soft)]'
                : 'border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--border-strong)] bg-transparent',
            )}
            style={
              active
                ? { backgroundColor: tag.color, color: tagForeground(tag.color) }
                : undefined
            }
          >
            <span
              className="size-1.5 rounded-full"
              style={{
                backgroundColor: active ? tagForeground(tag.color) : tag.color,
              }}
              aria-hidden
            />
            {tag.name}
          </button>
        )
      })}
      {selected.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="inline-flex items-center gap-1 h-6 px-2 text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <X className="size-3" aria-hidden />
          {t('clearFilter')}
        </button>
      )}
    </div>
  )
}
