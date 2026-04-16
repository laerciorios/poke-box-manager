import type { Tag } from '@/types/tags'

interface TagDotProps {
  tag: Tag
  size?: number
}

export function TagDot({ tag, size = 8 }: TagDotProps) {
  return (
    <span
      aria-label={tag.name}
      style={{ backgroundColor: tag.color, width: size, height: size }}
      className="inline-block rounded-full shrink-0"
    />
  )
}
