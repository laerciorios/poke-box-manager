import { TagDot } from './TagDot'
import type { Tag } from '@/types/tags'

const MAX_DOTS = 3

interface TagDotGroupProps {
  tags: Tag[]
}

export function TagDotGroup({ tags }: TagDotGroupProps) {
  if (!tags.length) return null

  const visible = tags.slice(0, MAX_DOTS)
  const overflow = tags.length - MAX_DOTS

  return (
    <div className="flex items-center gap-[2px]">
      {visible.map((tag) => (
        <TagDot key={tag.id} tag={tag} size={6} />
      ))}
      {overflow > 0 && (
        <span className="text-[7px] leading-none text-muted-foreground font-medium">
          +{overflow}
        </span>
      )}
    </div>
  )
}
