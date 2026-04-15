import type { EvolutionChain, EvolutionMethod, EvolutionStep } from '../../types/game'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function normalizeEvolutionChain(chainData: any): EvolutionChain {
  const id: number = chainData.id
  const pokemonIds: number[] = []
  const steps: EvolutionStep[] = []

  collectChain(chainData.chain, pokemonIds, steps)

  return { id, pokemonIds, steps }
}

function extractId(node: any): number | null {
  const url: string = node.species?.url ?? ''
  const match = url.match(/\/pokemon-species\/(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

function collectChain(node: any, ids: number[], steps: EvolutionStep[]): void {
  if (!node) return
  const fromId = extractId(node)
  if (fromId === null) return
  ids.push(fromId)

  for (const evoNode of node.evolves_to ?? []) {
    const toId = extractId(evoNode)
    if (toId === null) continue

    // PokéAPI may list multiple valid methods for the same evolution; one step per method
    const details: any[] = evoNode.evolution_details ?? []
    if (details.length === 0) {
      steps.push({ fromId, toId, method: { trigger: 'other' } })
    } else {
      for (const detail of details) {
        steps.push({ fromId, toId, method: normalizeMethod(detail) })
      }
    }

    collectChain(evoNode, ids, steps)
  }
}

function normalizeMethod(detail: any): EvolutionMethod {
  const triggerName: string = detail.trigger?.name ?? 'other'
  const trigger = normalizeTrigger(triggerName)

  const method: EvolutionMethod = { trigger }

  if (detail.min_level) method.minLevel = detail.min_level
  if (detail.item?.name) method.item = detail.item.name
  if (detail.held_item?.name) method.heldItem = detail.held_item.name
  if (detail.trade_species?.url) {
    const m = detail.trade_species.url.match(/\/pokemon-species\/(\d+)/)
    if (m) method.tradeSpeciesId = parseInt(m[1], 10)
  }
  if (detail.min_happiness) method.happiness = detail.min_happiness
  if (detail.time_of_day && detail.time_of_day !== '') {
    method.timeOfDay = detail.time_of_day as 'day' | 'night' | 'dusk'
  }
  if (detail.location?.name) method.location = detail.location.name
  if (detail.known_move?.name) method.knownMove = detail.known_move.name
  if (detail.known_move_type?.name) method.knownMoveType = detail.known_move_type.name
  if (detail.needs_overworld_rain) method.needsRain = true
  if (detail.turn_upside_down) method.turnUpsideDown = true
  if (detail.min_affection) method.affection = detail.min_affection
  if (detail.min_beauty) method.beauty = detail.min_beauty
  if (detail.relative_physical_stats !== null && detail.relative_physical_stats !== undefined) {
    method.relativePhysicalStats = detail.relative_physical_stats as 1 | -1 | 0
  }

  return method
}

const KNOWN_TRIGGERS = new Set([
  'level-up', 'trade', 'use-item', 'shed', 'spin',
  'tower-of-darkness', 'tower-of-waters', 'three-critical-hits',
  'take-damage',
])

function normalizeTrigger(name: string): EvolutionMethod['trigger'] {
  if (KNOWN_TRIGGERS.has(name)) return name as EvolutionMethod['trigger']
  return 'other'
}
