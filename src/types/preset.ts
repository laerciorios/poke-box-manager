import type { Locale } from './locale'
import type { PokemonCategory, FormType } from './pokemon'

export type SortCriteria =
  | 'dex-number'
  | 'name'
  | 'type-primary'
  | 'generation'
  | 'evolution-chain'

export interface PokemonFilter {
  categories?: PokemonCategory[]
  generations?: number[]
  types?: string[]
  formTypes?: FormType[]
  exclude?: {
    categories?: PokemonCategory[]
    pokemonIds?: number[]
  }
}

export interface PresetRule {
  order: number
  filter: PokemonFilter
  sort: SortCriteria
  boxNameTemplate?: string
}

export interface OrganizationPreset {
  id: string
  name: string
  names: Record<Locale, string>
  description: string
  descriptions: Record<Locale, string>
  isBuiltIn: boolean
  rules: PresetRule[]
  boxNames?: Record<number, string>
}
