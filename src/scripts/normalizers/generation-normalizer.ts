import type { GenerationEntry } from '../../types/game'
import { extractNames } from './names'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function normalizeGeneration(genData: any): GenerationEntry {
  return {
    id: genData.id,
    name: genData.name,
    names: extractNames(genData.names ?? [], genData.name),
    mainRegion: genData.main_region?.name ?? '',
    pokemonCount: genData.pokemon_species?.length ?? 0,
  }
}
