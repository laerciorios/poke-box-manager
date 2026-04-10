import type { Locale } from './locale'
import type { GameId } from './game'

export type SpriteStyle = 'home-3d' | 'pixel-gen5' | 'pixel-gen8' | 'official-art'

export interface VariationToggles {
  regionalForms: boolean
  genderForms: boolean
  unownLetters: boolean
  vivillonPatterns: boolean
  alcremieVariations: boolean
  colorVariations: boolean
  sizeVariations: boolean
  megaEvolutions: boolean
  gmaxForms: boolean
  battleForms: boolean
  originForms: boolean
  costumedPokemon: boolean
}

export interface SettingsState {
  variations: VariationToggles
  activeGenerations: number[]
  gameFilter: 'switch-only' | 'all'
  activeGames: GameId[]
  theme: 'light' | 'dark' | 'system'
  locale: Locale
  spriteStyle: SpriteStyle
  autoSave: boolean
  lastBackup?: string
  showPokemonNamesInBox: boolean
  sidebarCollapsed: boolean
}

export const DEFAULT_VARIATIONS: VariationToggles = {
  regionalForms: true,
  genderForms: false,
  unownLetters: false,
  vivillonPatterns: false,
  alcremieVariations: false,
  colorVariations: false,
  sizeVariations: false,
  megaEvolutions: true,
  gmaxForms: true,
  battleForms: false,
  originForms: true,
  costumedPokemon: false,
}

export const DEFAULT_SETTINGS: SettingsState = {
  variations: DEFAULT_VARIATIONS,
  activeGenerations: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  gameFilter: 'all',
  activeGames: [],
  theme: 'dark',
  locale: 'pt-BR',
  spriteStyle: 'home-3d',
  autoSave: true,
  showPokemonNamesInBox: false,
  sidebarCollapsed: false,
}
