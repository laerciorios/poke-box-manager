'use client'

import { useSettingsStore } from '@/stores/useSettingsStore'
import type { SpriteStyle } from '@/types/settings'

const HOME_REGEX = /\/other\/home\/(?:shiny\/)?(\d+)\.png$/i

const BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/'

const STYLE_PATHS: Record<SpriteStyle, { normal: string; shiny: string }> = {
  'home-3d': {
    normal: 'sprites/pokemon/other/home/$ID.png',
    shiny: 'sprites/pokemon/other/home/shiny/$ID.png',
  },
  'official-art': {
    normal: 'sprites/pokemon/other/official-artwork/$ID.png',
    shiny: 'sprites/pokemon/other/official-artwork/shiny/$ID.png',
  },
  'pixel-gen5': {
    normal: 'sprites/pokemon/versions/generation-v/black-white/$ID.png',
    shiny: 'sprites/pokemon/versions/generation-v/black-white/shiny/$ID.png',
  },
  'pixel-gen8': {
    normal: 'sprites/pokemon/versions/generation-viii/icons/$ID.png',
    shiny: 'sprites/pokemon/versions/generation-viii/icons/$ID.png',
  },
}

export function getStyledSprite(
  src: string | undefined,
  style: SpriteStyle,
  shiny: boolean,
): string | undefined {
  if (!src) return src
  if (style === 'home-3d') return src
  const m = HOME_REGEX.exec(src)
  if (!m) return src
  const id = m[1]
  // Form ids (>=10000) only have home/official-art rendered; fall back to home-3d.
  if (Number(id) >= 10000 && (style === 'pixel-gen5' || style === 'pixel-gen8')) return src
  return BASE + STYLE_PATHS[style][shiny ? 'shiny' : 'normal'].replace('$ID', id)
}

export function isPixelStyle(style: SpriteStyle): boolean {
  return style === 'pixel-gen5' || style === 'pixel-gen8'
}

/**
 * Reactive sprite resolver. Re-renders when user changes spriteStyle in Settings.
 */
export function useStyledSprite(src: string | undefined, shiny = false): {
  src: string | undefined
  pixelated: boolean
} {
  const style = useSettingsStore((s) => s.spriteStyle)
  return {
    src: getStyledSprite(src, style, shiny),
    pixelated: isPixelStyle(style),
  }
}
