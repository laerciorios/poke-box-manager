import type { Locale } from './locale'

export type SpriteStyle = 'home-3d' | 'pixel-gen5' | 'pixel-gen8' | 'official-art'
export type PokedexView = 'table' | 'grid'

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
  theme: 'light' | 'dark' | 'system'
  locale: Locale
  spriteStyle: SpriteStyle
  autoSave: boolean
  lastBackup?: string
  showPokemonNamesInBox: boolean
  sidebarCollapsed: boolean
  shinyTrackerEnabled: boolean
  pokedexView: PokedexView
  pendingChanges: number
}

export const DEFAULT_VARIATIONS: VariationToggles = {
  regionalForms: true,
  genderForms: false,
  unownLetters: false,
  vivillonPatterns: false,
  alcremieVariations: false,
  colorVariations: false,
  sizeVariations: false,
  // Mega Evolutions and Gigantamax forms are battle-only — they can't be
  // stored in a Pokémon Home box slot, so they're off by default to avoid
  // bloating the dex with unreachable targets. Users can still opt-in
  // from Settings to count them in stats.
  megaEvolutions: false,
  gmaxForms: false,
  battleForms: false,
  originForms: true,
  costumedPokemon: false,
}

export const DEFAULT_SETTINGS: SettingsState = {
  variations: DEFAULT_VARIATIONS,
  activeGenerations: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  theme: 'dark',
  locale: 'pt-BR',
  spriteStyle: 'home-3d',
  autoSave: true,
  showPokemonNamesInBox: false,
  sidebarCollapsed: false,
  // On by default — shiny tracking is one of the main selling points of the
  // tool, and the marker UI in the box slot only appears when this is true.
  // Existing persisted state keeps whatever value the user had (no migrate).
  shinyTrackerEnabled: true,
  pokedexView: 'table',
  pendingChanges: 0,
}
