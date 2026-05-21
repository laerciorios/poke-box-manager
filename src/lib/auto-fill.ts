import type { Box, BoxSlot } from '@/types/box'
import type { VariationToggles } from '@/types/settings'
import type { PokemonEntry } from '@/types/pokemon'
import pokemonData from '@/data/pokemon.json'
import { TOGGLE_FORM_TYPES } from '@/lib/variation-counts'

const ALL: PokemonEntry[] = pokemonData as PokemonEntry[]

interface AutoFillContext {
  activeGenerations: number[]
  variations: VariationToggles
}

interface Slottable {
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

/**
 * Fill empty slots across all boxes in order with candidates, skipping
 * any candidate whose key is already present. Returns the updated boxes.
 */
export function applyAutoFill(
  boxes: Box[],
  ctx: AutoFillContext,
  isRegistered: (id: number, formId?: string) => boolean,
): Box[] {
  const candidates = buildAutoFillCandidates(ctx)
  const present = collectPresentKeys(boxes)
  let cursor = 0

  const result = boxes.map((box) => {
    const slots: (BoxSlot | null)[] = box.slots.map((slot) => {
      if (slot) return slot
      while (cursor < candidates.length) {
        const next = candidates[cursor++]
        const key = next.formId ? `${next.pokemonId}:${next.formId}` : String(next.pokemonId)
        if (present.has(key)) continue
        present.add(key)
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

  return result
}
