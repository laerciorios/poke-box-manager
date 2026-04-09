import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import pokemonData from '../data/pokemon.json'
import formsData from '../data/forms.json'
import { LOCALES } from '../types/locale'
import type { PokemonEntry, PokemonForm } from '../types/pokemon'
import type { Locale } from '../types/locale'

const OUTPUT_DIR = join(process.cwd(), 'src', 'i18n', 'pokemon-names')

const allPokemon = pokemonData as unknown as PokemonEntry[]
const allForms = formsData as unknown as Record<string, PokemonForm>

mkdirSync(OUTPUT_DIR, { recursive: true })

for (const locale of LOCALES as Locale[]) {
  const map: Record<string, string> = {}

  for (const pokemon of allPokemon) {
    map[String(pokemon.id)] = pokemon.names[locale]
  }

  for (const [formId, form] of Object.entries(allForms)) {
    map[formId] = form.names[locale]
  }

  writeFileSync(join(OUTPUT_DIR, `${locale}.json`), JSON.stringify(map, null, 2) + '\n')
  console.log(`✓ Written ${Object.keys(map).length} entries to src/i18n/pokemon-names/${locale}.json`)
}
