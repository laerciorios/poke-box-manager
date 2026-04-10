import type { PokemonForm } from '../../types/pokemon'
import { classifyFormType } from '../pokemon-categories'
import { extractNames } from './names'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function normalizeForms(
  formsData: any[],
  speciesId: number,
  defaultPokemonName: string,
  altPokemonByName: Map<string, any> = new Map(),
): PokemonForm[] {
  // Filter out the default form (same name as species)
  const altForms = formsData.filter(
    (form) => form.name !== defaultPokemonName && form.form_name !== '',
  )

  return altForms.map((form) => {
    const altPokemon = altPokemonByName.get(form.name)
    return normalizeForm(form, speciesId, altPokemon)
  })
}

function normalizeForm(formData: any, speciesId: number, altPokemonData?: any): PokemonForm {
  const id: string = formData.name
  const name: string = formData.form_name || formData.name
  const names = extractNames(formData.form_names ?? [], name)
  const formType = classifyFormType(formData.name, speciesId)

  const sprite =
    altPokemonData?.sprites?.other?.home?.front_default ??
    formData.sprites?.front_default ??
    ''

  const spriteShiny: string | undefined =
    altPokemonData?.sprites?.other?.home?.front_shiny ??
    formData.sprites?.front_shiny ??
    undefined

  const types: [string, string?] | undefined = formData.types?.length
    ? extractFormTypes(formData.types)
    : undefined

  return {
    id,
    name,
    names,
    formType,
    sprite,
    ...(spriteShiny && { spriteShiny }),
    ...(types && { types }),
  }
}

function extractFormTypes(types: any[]): [string, string?] {
  const sorted = [...types].sort((a, b) => a.slot - b.slot)
  if (sorted.length >= 2) {
    return [sorted[0].type.name, sorted[1].type.name]
  }
  return [sorted[0]?.type?.name ?? 'normal']
}
