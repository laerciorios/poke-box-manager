'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useStyledSprite } from '@/lib/sprite-style'

interface SpriteProps {
  src?: string
  alt: string
  size?: number
  className?: string
  /** Force pixelated rendering regardless of user style preference. */
  pixelated?: boolean
  priority?: boolean
  /** When true, the styled URL resolves to the shiny variant. */
  shiny?: boolean
  /** When true, ignore the user's spriteStyle preference and render `src` as-is. */
  unstyled?: boolean
}

export function Sprite({
  src,
  alt,
  size = 64,
  className,
  pixelated,
  priority,
  shiny = false,
  unstyled = false,
}: SpriteProps) {
  const styled = useStyledSprite(src, shiny)
  const resolved = unstyled ? src : styled.src
  const pixelMode = unstyled ? pixelated : pixelated || styled.pixelated
  const [errored, setErrored] = React.useState(false)

  React.useEffect(() => {
    setErrored(false)
  }, [resolved])

  if (!resolved || errored) {
    return (
      <div
        className={cn(
          'grid place-items-center rounded-md bg-[var(--surface-2)] text-[var(--muted-foreground)]',
          className,
        )}
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    )
  }
  return (
    <div
      className={cn(
        'relative grid place-items-center',
        pixelMode && 'sprite-pixel',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={resolved}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        unoptimized
        onError={() => setErrored(true)}
        className="object-contain"
      />
    </div>
  )
}
