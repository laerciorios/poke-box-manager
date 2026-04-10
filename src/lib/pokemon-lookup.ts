import pokemonData from '@/data/pokemon.json'
import evolutionChainsData from '@/data/evolution-chains.json'
import type { PokemonEntry } from '@/types/pokemon'
import type { EvolutionChain } from '@/types/game'

const pokemonList = pokemonData as unknown as PokemonEntry[]
const evolutionChainsRaw = evolutionChainsData as Record<string, number[]>

const pokemonById = new Map<number, PokemonEntry>(
  pokemonList.map((p) => [p.id, p]),
)

export function getPokemonById(id: number): PokemonEntry | undefined {
  return pokemonById.get(id)
}

export function getEvolutionChain(chainId: number): EvolutionChain | undefined {
  const pokemonIds = evolutionChainsRaw[chainId]
  if (!pokemonIds) return undefined
  return { id: chainId, pokemonIds }
}
