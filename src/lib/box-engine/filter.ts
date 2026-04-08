import type { PokemonEntry } from '@/types/pokemon'
import type { PokemonFilter } from '@/types/preset'

export function filterPokemon(
  pokemon: PokemonEntry[],
  filter: PokemonFilter,
): PokemonEntry[] {
  return pokemon.filter((p) => {
    // Check exclude first — exclusion overrides all include criteria
    if (filter.exclude) {
      if (
        filter.exclude.categories?.includes(p.category) ||
        filter.exclude.pokemonIds?.includes(p.id)
      ) {
        return false
      }
    }

    // categories: AND — pokemon must match one of the listed categories
    if (filter.categories && filter.categories.length > 0) {
      if (!filter.categories.includes(p.category)) return false
    }

    // generations: pokemon must belong to one of the listed generations
    if (filter.generations && filter.generations.length > 0) {
      if (!filter.generations.includes(p.generation)) return false
    }

    // types: pokemon primary type must be in the list
    if (filter.types && filter.types.length > 0) {
      if (!filter.types.includes(p.types[0])) return false
    }

    // formTypes: pokemon must have at least one form matching a listed formType
    if (filter.formTypes && filter.formTypes.length > 0) {
      const hasMatchingForm = p.forms.some((f) =>
        filter.formTypes!.includes(f.formType),
      )
      if (!hasMatchingForm) return false
    }

    return true
  })
}
