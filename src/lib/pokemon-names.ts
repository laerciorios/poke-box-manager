import type { PokemonEntry, PokemonForm } from '@/types/pokemon'
import type { Locale } from '@/types/locale'

export function getPokemonName(pokemon: PokemonEntry, locale: Locale): string {
  return pokemon.names[locale] ?? pokemon.names['en'] ?? pokemon.name
}

export function getFormName(form: PokemonForm, locale: Locale): string {
  return form.names[locale] ?? form.names['en'] ?? form.name
}
