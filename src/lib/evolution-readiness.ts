import evolutionChains from '@/data/evolution-chains.json'
import type { EvolutionChain } from '@/types/game'

const CHAINS = evolutionChains as unknown as Record<string, EvolutionChain>

/**
 * Returns the set of base Pokémon ids for which the pre-evolution is already
 * registered but they themselves are not. These are "next-up" candidates —
 * Pokémon you're one step away from completing once you evolve what you have.
 */
export function computeEvolutionReady(registeredSet: Set<string>): Set<number> {
  const ready = new Set<number>()

  for (const chain of Object.values(CHAINS)) {
    for (const step of chain.steps) {
      const fromRegistered = registeredSet.has(String(step.fromId))
      const toRegistered = registeredSet.has(String(step.toId))
      if (fromRegistered && !toRegistered) {
        ready.add(step.toId)
      }
    }
  }

  return ready
}
