import type { PokemonCategory, FormType } from '../types/pokemon'

// Ultra Beasts (Gen 7): PokeAPI has no specific field for these
export const ULTRA_BEAST_IDS = new Set([
  793, // Nihilego
  794, // Buzzwole
  795, // Pheromosa
  796, // Xurkitree
  797, // Celesteela
  798, // Kartana
  799, // Guzzlord
  803, // Poipole
  804, // Naganadel
  805, // Stakataka
  806, // Blacephalon
])

// Paradox Pokemon (Gen 9): PokeAPI has no specific field for these
export const PARADOX_IDS = new Set([
  984, // Great Tusk
  985, // Scream Tail
  986, // Brute Bonnet
  987, // Flutter Mane
  988, // Slither Wing
  989, // Sandy Shocks
  990, // Iron Treads
  991, // Iron Bundle
  992, // Iron Hands
  993, // Iron Jugulis
  994, // Iron Moth
  995, // Iron Thorns
  1005, // Roaring Moon
  1006, // Iron Valiant
  1007, // Walking Wake
  1008, // Iron Leaves
  1009, // Gouging Fire
  1010, // Raging Bolt
  1011, // Iron Boulder
  1012, // Iron Crown
])

// Species IDs that have gender-based form differences
const GENDER_FORM_SPECIES = new Set([
  678, // Meowstic
  876, // Indeedee
  902, // Basculegion
  916, // Oinkologne
])

// Species IDs mapped to special form types
const SPECIES_FORM_TYPE: Record<number, FormType> = {
  201: 'unown',
  666: 'vivillon',
  869: 'alcremie',
}

// Species with size variations
const SIZE_SPECIES = new Set([
  710, // Pumpkaboo
  711, // Gourgeist
])

// Species with color variations
const COLOR_SPECIES = new Set([
  669, // Flabebe
  670, // Floette
  671, // Florges
  741, // Oricorio
  774, // Minior
])

// Species with costume variations
const COSTUME_SPECIES = new Set([
  25, // Pikachu (various hats)
])

export function classifyCategory(
  speciesData: { is_legendary: boolean; is_mythical: boolean; is_baby: boolean },
  id: number,
): PokemonCategory {
  if (ULTRA_BEAST_IDS.has(id)) return 'ultra-beast'
  if (PARADOX_IDS.has(id)) return 'paradox'
  if (speciesData.is_mythical) return 'mythical'
  if (speciesData.is_legendary) return 'legendary'
  if (speciesData.is_baby) return 'baby'
  return 'normal'
}

export function classifyFormType(
  formName: string,
  speciesId: number,
): FormType {
  const name = formName.toLowerCase()

  // Costume variations FIRST (e.g. Pikachu caps/costumes that may contain regional keywords)
  if (COSTUME_SPECIES.has(speciesId) && name !== speciesId.toString()) {
    // Pikachu caps, cosplay, etc. — check for cap/costume patterns
    if (
      name.includes('-cap') ||
      name.includes('-cosplay') ||
      name.includes('-rock-star') ||
      name.includes('-belle') ||
      name.includes('-pop-star') ||
      name.includes('-phd') ||
      name.includes('-libre') ||
      name.includes('-partner') ||
      name.includes('-starter') ||
      name.includes('-world')
    ) {
      return 'costume'
    }
    // Gmax Pikachu is still gmax
    if (name.includes('-gmax')) return 'gmax'
    return 'costume'
  }

  // Regional forms
  if (name.includes('-alola')) return 'regional-alola'
  if (name.includes('-galar')) return 'regional-galar'
  if (name.includes('-hisui')) return 'regional-hisui'
  if (name.includes('-paldea')) return 'regional-paldea'

  // Mega evolutions
  if (name.includes('-mega')) return 'mega'

  // Gigantamax
  if (name.includes('-gmax')) return 'gmax'

  // Terastal
  if (name.includes('-tera')) return 'tera'

  // Battle forms
  if (
    name.includes('-zen') ||
    name.includes('-blade') ||
    name.includes('-pirouette') ||
    name.includes('-ash') ||
    name.includes('-school') ||
    name.includes('-complete')
  ) {
    return 'battle'
  }

  // Origin forms
  if (name.includes('-origin')) return 'origin'

  // Species-specific form types
  if (SPECIES_FORM_TYPE[speciesId]) return SPECIES_FORM_TYPE[speciesId]

  // Gender forms
  if (GENDER_FORM_SPECIES.has(speciesId) && (name.includes('-male') || name.includes('-female'))) {
    return 'gender'
  }

  // Size variations
  if (SIZE_SPECIES.has(speciesId)) return 'size'

  // Color variations
  if (COLOR_SPECIES.has(speciesId)) return 'color'

  return 'other'
}
