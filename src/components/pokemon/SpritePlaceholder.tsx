import { cn } from "@/lib/utils"

interface SpritePlaceholderProps {
  size?: number
  className?: string
}

export function SpritePlaceholder({
  size = 64,
  className,
}: SpritePlaceholderProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("text-muted", className)}
    >
      {/* Pokéball silhouette */}
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
      <line
        x1="4"
        y1="32"
        x2="60"
        y2="32"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="32" r="4" fill="currentColor" />
    </svg>
  )
}
