import { cn } from '@/lib/utils'

interface TagColorSwatchProps {
  color: string
  selected?: boolean
  onClick: (color: string) => void
}

export function TagColorSwatch({ color, selected, onClick }: TagColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(color)}
      aria-pressed={selected}
      style={{ backgroundColor: color }}
      className={cn(
        'w-7 h-7 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected && 'ring-2 ring-offset-2 ring-ring scale-110',
      )}
    />
  )
}
