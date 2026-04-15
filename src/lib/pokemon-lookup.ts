import pokemonData from '@/data/pokemon.json'
import evolutionChainsData from '@/data/evolution-chains.json'
import type { PokemonEntry } from '@/types/pokemon'
import type { EvolutionChain, EvolutionStep } from '@/types/game'

const pokemonList = pokemonData as unknown as PokemonEntry[]

interface RawChainEntry {
  pokemonIds: number[]
  steps: EvolutionStep[]
}

const evolutionChainsRaw = evolutionChainsData as Record<string, RawChainEntry>

const pokemonById = new Map<number, PokemonEntry>(
  pokemonList.map((p) => [p.id, p]),
)

export function getPokemonById(id: number): PokemonEntry | undefined {
  return pokemonById.get(id)
}

export function getEvolutionChain(chainId: number): EvolutionChain | undefined {
  const raw = evolutionChainsRaw[chainId]
  if (!raw) return undefined
  return { id: chainId, pokemonIds: raw.pokemonIds, steps: raw.steps }
}
