'use client'

import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { SpriteStyle } from '@/types/settings'
import { getStyledSprite, isPixelStyle } from '@/lib/sprite-style'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const SAMPLE_SRC = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png'

const STYLES: SpriteStyle[] = ['home-3d', 'pixel-gen5', 'pixel-gen8', 'official-art']

export function SpriteStylePanel() {
  const t = useTranslations('Settings.spriteStyle')
  const current = useSettingsStore((s) => s.spriteStyle)
  const setSpriteStyle = useSettingsStore((s) => s.setSpriteStyle)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {STYLES.map((style) => {
        const active = current === style
        const previewSrc = getStyledSprite(SAMPLE_SRC, style, false)
        const pixel = isPixelStyle(style)
        return (
          <button
            key={style}
            type="button"
            onClick={() => setSpriteStyle(style)}
            aria-pressed={active}
            className={cn(
              'rounded-md border p-3 flex flex-col items-center gap-2 transition-colors',
              active
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] ring-2 ring-[var(--accent)]/40'
                : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]/50',
            )}
          >
            <div
              className={cn(
                'size-16 rounded-md bg-[var(--surface-2)] grid place-items-center',
                pixel && 'sprite-pixel',
              )}
            >
              {previewSrc && (
                <Image
                  src={previewSrc}
                  alt={t(style)}
                  width={56}
                  height={56}
                  unoptimized
                  className="object-contain"
                />
              )}
            </div>
            <p className="text-xs font-medium text-center">{t(style)}</p>
          </button>
        )
      })}
    </div>
  )
}
