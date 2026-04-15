import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { PokemonEntry } from '../types/pokemon'
import type { TypeEntry, GenerationEntry, EvolutionStep } from '../types/game'

const DATA_DIR = join(process.cwd(), 'src', 'data')

const REQUIRED_FILES = [
  'pokemon.json',
  'forms.json',
  'types.json',
  'generations.json',
  'evolution-chains.json',
]

let errors = 0
let warnings = 0

function error(msg: string) {
  console.error(`  ❌ ${msg}`)
  errors++
}

function warn(msg: string) {
  console.warn(`  ⚠ ${msg}`)
  warnings++
}

function ok(msg: string) {
  console.log(`  ✅ ${msg}`)
}

function loadJson<T>(filename: string): T | null {
  const path = join(DATA_DIR, filename)
  if (!existsSync(path)) {
    error(`Missing file: ${filename}`)
    return null
  }
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as T
  } catch {
    error(`Invalid JSON in ${filename}`)
    return null
  }
}

function main() {
  console.log('🔍 Validating Pokemon data files...\n')

  // ─── Check files exist ─────────────────────────────────────────────
  console.log('File existence:')
  let allExist = true
  for (const file of REQUIRED_FILES) {
    const path = join(DATA_DIR, file)
    if (existsSync(path)) {
      ok(file)
    } else {
      error(`Missing: ${file}`)
      allExist = false
    }
  }

  if (!allExist) {
    console.log('\n❌ Cannot continue validation — missing files.')
    process.exit(1)
  }

  // ─── Load data ─────────────────────────────────────────────────────
  const pokemon = loadJson<PokemonEntry[]>('pokemon.json')!
  const forms = loadJson<Record<string, unknown>>('forms.json')!
  const types = loadJson<TypeEntry[]>('types.json')!
  const generations = loadJson<GenerationEntry[]>('generations.json')!
  const evolutionChains = loadJson<Record<string, { pokemonIds: number[]; steps: EvolutionStep[] }>>('evolution-chains.json')!

  // ─── Schema validation ─────────────────────────────────────────────
  console.log('\nSchema validation:')

  // Validate PokemonEntry required fields
  let invalidPokemon = 0
  for (let i = 0; i < pokemon.length; i++) {
    const entry = pokemon[i]
    const missing: string[] = []
    if (typeof entry.id !== 'number') missing.push('id')
    if (typeof entry.name !== 'string') missing.push('name')
    if (!entry.names) missing.push('names')
    if (typeof entry.generation !== 'number') missing.push('generation')
    if (!Array.isArray(entry.types)) missing.push('types')
    if (typeof entry.category !== 'string') missing.push('category')
    if (typeof entry.sprite !== 'string') missing.push('sprite')
    if (typeof entry.homeAvailable !== 'boolean') missing.push('homeAvailable')

    if (missing.length > 0) {
      error(`pokemon[${i}] (id=${entry.id}): missing fields: ${missing.join(', ')}`)
      invalidPokemon++
    }
  }
  if (invalidPokemon === 0) {
    ok(`All ${pokemon.length} PokemonEntry objects have required fields`)
  }

  // Validate form types
  const VALID_FORM_TYPES = new Set([
    'regional-alola', 'regional-galar', 'regional-hisui', 'regional-paldea',
    'mega', 'gmax', 'gender', 'unown', 'vivillon', 'alcremie',
    'color', 'size', 'costume', 'battle', 'origin', 'tera', 'other',
  ])

  let invalidForms = 0
  for (const [formId, form] of Object.entries(forms)) {
    const f = form as { formType?: string }
    if (f.formType && !VALID_FORM_TYPES.has(f.formType)) {
      error(`Form "${formId}" has invalid formType: "${f.formType}"`)
      invalidForms++
    }
  }
  if (invalidForms === 0) {
    ok(`All ${Object.keys(forms).length} forms have valid formType values`)
  }

  // ─── Completeness checks ───────────────────────────────────────────
  console.log('\nCompleteness checks:')

  // Check for National Dex gaps
  const dexIds = new Set(pokemon.map((p) => p.id))
  const maxId = Math.max(...pokemon.map((p) => p.id))
  const gaps: number[] = []
  for (let i = 1; i <= maxId; i++) {
    if (!dexIds.has(i)) gaps.push(i)
  }
  if (gaps.length === 0) {
    ok(`No gaps in National Dex (1-${maxId})`)
  } else {
    warn(`National Dex gaps found: ${gaps.slice(0, 10).join(', ')}${gaps.length > 10 ? ` ... (${gaps.length} total)` : ''}`)
  }

  // Check type references
  const typeNames = new Set(types.map((t) => t.name))
  let invalidTypeRefs = 0
  for (const entry of pokemon) {
    for (const t of entry.types) {
      if (t && !typeNames.has(t)) {
        error(`Pokemon #${entry.id} references unknown type: "${t}"`)
        invalidTypeRefs++
      }
    }
  }
  if (invalidTypeRefs === 0) {
    ok('All Pokemon type references are valid')
  }

  // Check evolution chain references
  const chainIds = new Set(Object.keys(evolutionChains).map(Number))
  let invalidChainRefs = 0
  for (const entry of pokemon) {
    if (entry.evolutionChainId !== undefined && !chainIds.has(entry.evolutionChainId)) {
      invalidChainRefs++
    }
  }
  if (invalidChainRefs === 0) {
    ok('All evolution chain references are valid')
  } else {
    warn(`${invalidChainRefs} Pokemon reference unknown evolution chains`)
  }

  // ─── Summary ───────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════')
  console.log('  DATA VALIDATION SUMMARY')
  console.log('══════════════════════════════════════')
  console.log(`  Pokemon:          ${pokemon.length}`)
  console.log(`  Forms:            ${Object.keys(forms).length}`)
  console.log(`  Types:            ${types.length}`)
  console.log(`  Generations:      ${generations.length}`)
  console.log(`  Evolution Chains: ${Object.keys(evolutionChains).length}`)
  console.log('──────────────────────────────────────')
  console.log(`  Errors:   ${errors}`)
  console.log(`  Warnings: ${warnings}`)
  console.log(`  Status:   ${errors === 0 ? '✅ PASS' : '❌ FAIL'}`)
  console.log('══════════════════════════════════════')

  process.exit(errors > 0 ? 1 : 0)
}

main()
