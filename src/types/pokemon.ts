import type { Locale } from './locale'

export type FormType =
  | 'regional-alola'
  | 'regional-galar'
  | 'regional-hisui'
  | 'regional-paldea'
  | 'mega'
  | 'gmax'
  | 'gender'
  | 'unown'
  | 'vivillon'
  | 'alcremie'
  | 'color'
  | 'size'
  | 'costume'
  | 'battle'
  | 'origin'
  | 'tera'
  | 'other'

export type PokemonCategory =
  | 'normal'
  | 'legendary'
  | 'mythical'
  | 'baby'
  | 'ultra-beast'
  | 'paradox'

export interface PokemonForm {
  id: string
  name: string
  names: Record<Locale, string>
  formType: FormType
  sprite: string
  types?: [string, string?]
}

export interface PokemonEntry {
  id: number
  name: string
  names: Record<Locale, string>
  generation: number
  types: [string, string?]
  category: PokemonCategory
  sprite: string
  spriteShiny?: string
  forms: PokemonForm[]
  evolutionChainId?: number
  homeAvailable: boolean
}
