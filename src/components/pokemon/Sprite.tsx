'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface SpriteProps {
  src?: string
  alt: string
  size?: number
  className?: string
  pixelated?: boolean
  priority?: boolean
}

export function Sprite({
  src,
  alt,
  size = 64,
  className,
  pixelated,
  priority,
}: SpriteProps) {
  const [errored, setErrored] = React.useState(false)
  if (!src || errored) {
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
        pixelated && 'sprite-pixel',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
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
