'use client'

import * as React from 'react'
import type { GameEntry } from '@/types/availability'
import { cn } from '@/lib/utils'

interface Props {
  game: GameEntry
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Renders just the game logo — no card, no background, no border. All tiles
 * have the same fixed height so the row visually aligns regardless of each
 * logo's native aspect ratio. The width adapts to the logo's intrinsic
 * proportions via `width: auto`.
 *
 * When the PNG is missing, an inline SVG placeholder takes its place — sized
 * to the same height so the row stays uniform.
 */
export function GameBadge({ game, size = 'md', className }: Props) {
  const [failed, setFailed] = React.useState(false)
  const h = SIZE_MAP[size]
  const src = `/games/${game.id}.png`

  if (failed) {
    return (
      <Placeholder
        game={game}
        height={h}
        className={cn('shrink-0', className)}
      />
    )
  }

  // Plain <img> is intentional. next/image's onError doesn't reliably fire
  // for missing /public assets in Next 16, which would leave the slot blank
  // instead of falling back to the SVG placeholder.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={game.name}
      title={game.name}
      onError={() => setFailed(true)}
      className={cn(
        'shrink-0 w-auto object-contain select-none',
        className,
      )}
      style={{ height: h }}
    />
  )
}

const SIZE_MAP = {
  sm: 32,
  md: 48,
  lg: 64,
}

/**
 * SVG placeholder rendered when the PNG isn't present yet. Same height as
 * the logos so the row alignment doesn't break — slightly wider than tall
 * (1.6 ratio) to roughly match the cartouche shape of most Pokémon logos.
 */
function Placeholder({
  game,
  height,
  className,
}: {
  game: GameEntry
  height: number
  className?: string
}) {
  const initials = game.shortName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const stroke = darken(game.color, 0.6)
  const width = Math.round(height * 1.6)
  return (
    <svg
      viewBox="0 0 80 50"
      width={width}
      height={height}
      role="img"
      aria-label={game.name}
      className={className}
    >
      <title>{game.name}</title>
      <rect
        x="1"
        y="1"
        width="78"
        height="48"
        rx="8"
        fill={game.color}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <text
        x="40"
        y="31"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill={readableForeground(game.color)}
      >
        {initials}
      </text>
    </svg>
  )
}

/** Returns black or white depending on background luminance. Rough WCAG-ish. */
function readableForeground(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.6 ? '#111111' : '#FFFFFF'
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return { r: 100, g: 100, b: 100 }
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

function darken(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex)
  const d = (c: number) => Math.max(0, Math.round(c * factor))
  const h = (n: number) => n.toString(16).padStart(2, '0')
  return `#${h(d(r))}${h(d(g))}${h(d(b))}`
}
