import type { EvolutionChain } from '../../types/game'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function normalizeEvolutionChain(chainData: any): EvolutionChain {
  const id: number = chainData.id
  const pokemonIds: number[] = []
  collectChainIds(chainData.chain, pokemonIds)

  return { id, pokemonIds }
}

function collectChainIds(node: any, ids: number[]): void {
  if (!node) return
  const speciesUrl: string = node.species?.url ?? ''
  const match = speciesUrl.match(/\/pokemon-species\/(\d+)/)
  if (match) {
    ids.push(parseInt(match[1], 10))
  }
  for (const evo of node.evolves_to ?? []) {
    collectChainIds(evo, ids)
  }
}
