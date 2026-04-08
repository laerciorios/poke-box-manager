import type { PokemonEntry } from '@/types/pokemon'
import type { SortCriteria } from '@/types/preset'

// Canonical type order per spec section 3.2.1
export const TYPE_ORDER: string[] = [
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

// Generation → region name mapping
export const GENERATION_REGION: Record<number, string> = {
  1: 'Kanto',
  2: 'Johto',
  3: 'Hoenn',
  4: 'Sinnoh',
  5: 'Unova',
  6: 'Kalos',
  7: 'Alola',
  8: 'Galar',
  9: 'Paldea',
}

export function sortPokemon(
  pokemon: PokemonEntry[],
  criteria: SortCriteria,
  evolutionChains: Record<number, number[]> = {},
): PokemonEntry[] {
  const arr = [...pokemon]

  switch (criteria) {
    case 'dex-number':
      return arr.sort((a, b) => a.id - b.id)

    case 'name':
      return arr.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

    case 'generation':
      return arr.sort((a, b) => a.generation - b.generation || a.id - b.id)

    case 'type-primary': {
      return arr.sort((a, b) => {
        const ai = TYPE_ORDER.indexOf(a.types[0])
        const bi = TYPE_ORDER.indexOf(b.types[0])
        const aIdx = ai === -1 ? TYPE_ORDER.length : ai
        const bIdx = bi === -1 ? TYPE_ORDER.length : bi
        return aIdx - bIdx || a.id - b.id
      })
    }

    case 'evolution-chain': {
      // Build a lookup: pokemonId → (minIdInChain, positionInChain)
      const chainKey = new Map<number, number>() // pokemonId → min chain dex id
      const chainPos = new Map<number, number>() // pokemonId → position within chain

      for (const members of Object.values(evolutionChains)) {
        const minId = Math.min(...members)
        members.forEach((id, idx) => {
          chainKey.set(id, minId)
          chainPos.set(id, idx)
        })
      }

      const withChain: PokemonEntry[] = []
      const withoutChain: PokemonEntry[] = []

      for (const p of arr) {
        if (chainKey.has(p.id)) {
          withChain.push(p)
        } else {
          withoutChain.push(p)
        }
      }

      withChain.sort((a, b) => {
        const aKey = chainKey.get(a.id)!
        const bKey = chainKey.get(b.id)!
        if (aKey !== bKey) return aKey - bKey
        return (chainPos.get(a.id) ?? 0) - (chainPos.get(b.id) ?? 0)
      })

      withoutChain.sort((a, b) => a.id - b.id)

      return [...withChain, ...withoutChain]
    }

    case 'regional-dex':
      return arr.sort((a, b) => a.generation - b.generation || a.id - b.id)

    default:
      return arr.sort((a, b) => a.id - b.id)
  }
}
