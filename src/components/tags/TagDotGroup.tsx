'use client'

import { useTagsStore } from '@/stores/useTagsStore'

interface Props {
  tagIds: string[]
  /** Hide the group beyond this number; show "+N" instead. */
  max?: number
  className?: string
}

/**
 * Compact row of colored dots representing tags applied to a slot.
 * Reads tag definitions from the store and resolves color/name.
 */
export function TagDotGroup({ tagIds, max = 3, className }: Props) {
  const tags = useTagsStore((s) => s.tags)
  if (!tagIds || tagIds.length === 0) return null

  const byId = new Map(tags.map((t) => [t.id, t]))
  const resolved = tagIds.map((id) => byId.get(id)).filter(Boolean) as { id: string; name: string; color: string }[]
  if (resolved.length === 0) return null

  const shown = resolved.slice(0, max)
  const extra = resolved.length - shown.length

  // Tooltip: list of names — kept on the wrapper so hover/focus shows all
  const tooltip = resolved.map((t) => t.name).join(', ')

  return (
    <span
      className={className ?? 'inline-flex items-center gap-0.5'}
      title={tooltip}
      aria-label={tooltip}
    >
      {shown.map((tag) => (
        <span
          key={tag.id}
          className="inline-block size-1.5 rounded-full ring-1 ring-[var(--card)]"
          style={{ backgroundColor: tag.color }}
          aria-hidden
        />
      ))}
      {extra > 0 && (
        <span
          className="text-[8px] font-mono font-semibold text-[var(--muted-foreground)] tabular-nums leading-none ml-0.5"
          aria-hidden
        >
          +{extra}
        </span>
      )}
    </span>
  )
}
