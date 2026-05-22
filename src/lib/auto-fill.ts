import type { Box, BoxSlot } from '@/types/box'
import { BOX_SIZE } from '@/types/box'
import type { VariationToggles } from '@/types/settings'
import type { PokemonEntry } from '@/types/pokemon'
import pokemonData from '@/data/pokemon.json'
import { TOGGLE_FORM_TYPES } from '@/lib/variation-counts'

const ALL: PokemonEntry[] = pokemonData as PokemonEntry[]

interface AutoFillContext {
  activeGenerations: number[]
  variations: VariationToggles
}

export interface Slottable {
  pokemonId: number
  formId?: string
}

/** Compute the ordered list of Pokémon (and forms) that should populate boxes. */
export function buildAutoFillCandidates(ctx: AutoFillContext): Slottable[] {
  const gens = new Set(ctx.activeGenerations)
  const enabledTypes = new Set(
    (Object.entries(TOGGLE_FORM_TYPES) as [keyof VariationToggles, string[]][])
      .filter(([key]) => ctx.variations[key])
      .flatMap(([, types]) => types),
  )

  const out: Slottable[] = []
  for (const pokemon of ALL) {
    if (gens.size > 0 && !gens.has(pokemon.generation)) continue
    out.push({ pokemonId: pokemon.id })
    for (const form of pokemon.forms) {
      if (enabledTypes.has(form.formType)) {
        out.push({ pokemonId: pokemon.id, formId: form.id })
      }
    }
  }
  return out
}

/** Returns a set of `key` strings (`id` or `id:formId`) already present in any box. */
export function collectPresentKeys(boxes: Box[]): Set<string> {
  const set = new Set<string>()
  for (const box of boxes) {
    for (const slot of box.slots) {
      if (!slot) continue
      set.add(slot.formId ? `${slot.pokemonId}:${slot.formId}` : String(slot.pokemonId))
    }
  }
  return set
}

export interface AutoFillResult {
  /** Updated boxes (existing slots untouched, empty slots filled in order). */
  boxes: Box[]
  /** How many empty slots got filled across the existing boxes. */
  filledCount: number
  /** Candidates that didn't fit in any existing box (need new boxes). */
  remaining: Slottable[]
  /** True when nothing was filled (no empty slots or no eligible candidates). */
  isNoop: boolean
}

/**
 * Fill empty slots across all boxes in order with candidates, skipping any
 * candidate whose key is already present. Returns metadata so callers can
 * decide to auto-create extra boxes or show feedback.
 */
export function applyAutoFill(
  boxes: Box[],
  ctx: AutoFillContext,
  isRegistered: (id: number, formId?: string) => boolean,
): AutoFillResult {
  const candidates = buildAutoFillCandidates(ctx)
  const present = collectPresentKeys(boxes)
  let cursor = 0
  let filledCount = 0

  const result = boxes.map((box) => {
    const slots: (BoxSlot | null)[] = box.slots.map((slot) => {
      if (slot) return slot
      while (cursor < candidates.length) {
        const next = candidates[cursor++]
        const key = next.formId ? `${next.pokemonId}:${next.formId}` : String(next.pokemonId)
        if (present.has(key)) continue
        present.add(key)
        filledCount++
        return {
          pokemonId: next.pokemonId,
          formId: next.formId,
          registered: isRegistered(next.pokemonId, next.formId),
        }
      }
      return slot
    })
    return { ...box, slots }
  })

  // Collect any candidates that haven't been used and aren't already present.
  const remaining: Slottable[] = []
  while (cursor < candidates.length) {
    const next = candidates[cursor++]
    const key = next.formId ? `${next.pokemonId}:${next.formId}` : String(next.pokemonId)
    if (present.has(key)) continue
    remaining.push(next)
  }

  return {
    boxes: result,
    filledCount,
    remaining,
    isNoop: filledCount === 0 && remaining.length === 0,
  }
}

/**
 * Builds extra boxes filled with the leftover candidates. Used by the
 * page when AutoFill produces candidates that don't fit existing boxes.
 *
 * Names follow the convention `Box {N+1}` based on the previous box count
 * so they line up with addBox()-generated names.
 */
export function buildOverflowBoxes(
  remaining: Slottable[],
  previousBoxCount: number,
  isRegistered: (id: number, formId?: string) => boolean,
): Box[] {
  const out: Box[] = []
  for (let i = 0; i < remaining.length; i += BOX_SIZE) {
    const chunk = remaining.slice(i, i + BOX_SIZE)
    const slots: (BoxSlot | null)[] = Array.from({ length: BOX_SIZE }, (_, j) => {
      const next = chunk[j]
      if (!next) return null
      return {
        pokemonId: next.pokemonId,
        formId: next.formId,
        registered: isRegistered(next.pokemonId, next.formId),
      }
    })
    out.push({
      id: crypto.randomUUID(),
      name: `Box ${previousBoxCount + out.length + 1}`,
      slots,
    })
  }
  return out
}
