import type { PokemonEntry } from '../../types/pokemon'
import { classifyCategory } from '../pokemon-categories'
import { extractNames } from './names'
import { normalizeForms } from './form-normalizer'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function normalizePokemon(
  speciesData: any,
  pokemonData: any,
  formsData: any[],
): PokemonEntry {
  const id: number = speciesData.id
  const name: string = speciesData.name

  const names = extractNames(speciesData.names ?? [], name)
  const generation = extractGenerationNumber(speciesData.generation?.url ?? '')
  const types: [string, string?] = extractTypes(pokemonData.types)
  const category = classifyCategory(speciesData, id)

  const sprite =
    pokemonData.sprites?.other?.home?.front_default ??
    pokemonData.sprites?.front_default ??
    ''
  const spriteShiny =
    pokemonData.sprites?.other?.home?.front_shiny ??
    pokemonData.sprites?.front_shiny ??
    undefined

  const evolutionChainId = extractEvolutionChainId(speciesData.evolution_chain?.url)
  const homeAvailable = sprite !== ''

  const forms = normalizeForms(formsData, id, pokemonData.name)

  return {
    id,
    name,
    names,
    generation,
    types,
    category,
    sprite,
    ...(spriteShiny && { spriteShiny }),
    forms,
    ...(evolutionChainId !== undefined && { evolutionChainId }),
    homeAvailable,
  }
}

function extractGenerationNumber(url: string): number {
  const match = url.match(/\/generation\/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

function extractTypes(types: any[]): [string, string?] {
  const sorted = [...types].sort((a, b) => a.slot - b.slot)
  if (sorted.length >= 2) {
    return [sorted[0].type.name, sorted[1].type.name]
  }
  return [sorted[0]?.type?.name ?? 'normal']
}

function extractEvolutionChainId(url?: string): number | undefined {
  if (!url) return undefined
  const match = url.match(/\/evolution-chain\/(\d+)/)
  return match ? parseInt(match[1], 10) : undefined
}
