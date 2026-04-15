import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fetchEndpoint, fetchBatched, setUseCache } from './pokeapi-client'
import { normalizePokemon } from './normalizers/pokemon-normalizer'
import { normalizeType } from './normalizers/type-normalizer'
import { normalizeGame, enrichGameWithGeneration } from './normalizers/game-normalizer'
import { normalizeGeneration } from './normalizers/generation-normalizer'
import { normalizeEvolutionChain } from './normalizers/evolution-normalizer'
import type { PokemonEntry, PokemonForm } from '../types/pokemon'
import type { TypeEntry, GameEntry, GenerationEntry, EvolutionChain, EvolutionStep } from '../types/game'

/* eslint-disable @typescript-eslint/no-explicit-any */

const DATA_DIR = join(process.cwd(), 'src', 'data')

// Parse CLI flags
const args = process.argv.slice(2)
if (args.includes('--no-cache')) {
  setUseCache(false)
  console.log('⚠ Cache disabled — fetching all data from PokeAPI\n')
}

async function main() {
  const startTime = Date.now()
  mkdirSync(DATA_DIR, { recursive: true })

  // ─── Stage 1: Fetch National Dex ───────────────────────────────────
  console.log('📋 Stage 1: Fetching National Dex...')
  const nationalDex = (await fetchEndpoint('pokedex/1')) as any
  const pokemonIds: number[] = nationalDex.pokemon_entries
    .map((entry: any) => {
      const url: string = entry.pokemon_species.url
      const match = url.match(/\/pokemon-species\/(\d+)/)
      return match ? parseInt(match[1], 10) : null
    })
    .filter((id: number | null): id is number => id !== null)
    .sort((a: number, b: number) => a - b)

  console.log(`  Found ${pokemonIds.length} Pokemon in National Dex\n`)

  // ─── Stage 2: Fetch Pokemon Details ────────────────────────────────
  console.log('🔍 Stage 2: Fetching Pokemon details...')

  const speciesEndpoints = pokemonIds.map((id) => `pokemon-species/${id}`)
  const speciesDataList = await fetchBatched<any>(speciesEndpoints, 'species')

  const pokemonEndpoints = pokemonIds.map((id) => `pokemon/${id}`)
  const pokemonDataList = await fetchBatched<any>(pokemonEndpoints, 'pokemon')

  // Collect alternate variety URLs from species data (mega, gmax, regional, etc.)
  const varietyUrlsBySpecies = new Map<number, string[]>()
  for (const species of speciesDataList) {
    const altVarieties = (species.varieties ?? [])
      .filter((v: any) => !v.is_default)
      .map((v: any) => v.pokemon.url)
    if (altVarieties.length > 0) {
      varietyUrlsBySpecies.set(species.id, altVarieties)
    }
  }

  const allVarietyUrls = Array.from(varietyUrlsBySpecies.values()).flat()
  console.log(`  Fetching ${allVarietyUrls.length} alternate form pokemon data...`)
  const altPokemonRaw = await fetchBatched<any>(allVarietyUrls, 'alt-forms')

  // Build name → pokemon data index for Home 3D sprite lookup in form normalizer
  const altPokemonByName = new Map<string, any>()
  for (const p of altPokemonRaw) {
    altPokemonByName.set(p.name, p)
  }

  // Now fetch form details for alt forms
  const altFormUrls = new Set<string>()
  for (const pokemon of altPokemonRaw) {
    for (const form of pokemon.forms ?? []) {
      if (form.url) altFormUrls.add(form.url)
    }
  }
  // Also collect form URLs from default pokemon
  for (const pokemon of pokemonDataList) {
    for (const form of pokemon.forms ?? []) {
      if (form.url) altFormUrls.add(form.url)
    }
  }
  console.log(`  Fetching ${altFormUrls.size} form details...`)
  const allFormsRaw = await fetchBatched<any>(Array.from(altFormUrls), 'forms')

  // Index forms by species ID
  const formsBySpecies = new Map<number, any[]>()
  for (const form of allFormsRaw) {
    // Match form to species via the pokemon endpoint
    const pokemonUrl: string = form.pokemon?.url ?? ''
    const pokemonMatch = pokemonUrl.match(/\/pokemon\/(\d+)/)
    if (!pokemonMatch) continue

    const pokemonId = parseInt(pokemonMatch[1], 10)
    // Find which species this pokemon belongs to
    let speciesId: number | null = null

    // Check if it's a default pokemon (id matches species id for ids <= 10000)
    if (pokemonId <= 10000) {
      speciesId = pokemonId
    } else {
      // It's an alternate form — find it in our alt pokemon data
      const altPokemon = altPokemonRaw.find((p: any) => p.id === pokemonId)
      if (altPokemon) {
        const speciesUrl: string = altPokemon.species?.url ?? ''
        const speciesMatch = speciesUrl.match(/\/pokemon-species\/(\d+)/)
        speciesId = speciesMatch ? parseInt(speciesMatch[1], 10) : null
      }
    }

    if (speciesId) {
      const existing = formsBySpecies.get(speciesId) ?? []
      existing.push(form)
      formsBySpecies.set(speciesId, existing)
    }
  }

  console.log()

  // ─── Stage 3: Fetch Metadata ───────────────────────────────────────
  console.log('📊 Stage 3: Fetching metadata...')

  // Types (18 main types + some special ones)
  const typeEndpoints = Array.from({ length: 18 }, (_, i) => `type/${i + 1}`)
  const typesRaw = await fetchBatched<any>(typeEndpoints, 'types')

  // Generations (1-9)
  const genEndpoints = Array.from({ length: 9 }, (_, i) => `generation/${i + 1}`)
  const gensRaw = await fetchBatched<any>(genEndpoints, 'generations')

  // Versions (games) — fetch all listed in the first generation's version_groups
  const versionUrls = new Set<string>()
  for (const gen of gensRaw) {
    for (const vg of gen.version_groups ?? []) {
      versionUrls.add(vg.url)
    }
  }
  const versionGroupsRaw = await fetchBatched<any>(Array.from(versionUrls), 'version-groups')

  const gameVersionUrls = new Set<string>()
  for (const vg of versionGroupsRaw) {
    for (const v of vg.versions ?? []) {
      gameVersionUrls.add(v.url)
    }
  }
  const versionsRaw = await fetchBatched<any>(Array.from(gameVersionUrls), 'versions')

  // Evolution chains — collect unique chain IDs from species data
  const chainUrls = new Set<string>()
  for (const species of speciesDataList) {
    if (species.evolution_chain?.url) {
      chainUrls.add(species.evolution_chain.url)
    }
  }
  console.log(`  Fetching ${chainUrls.size} evolution chains...`)
  const chainsRaw = await fetchBatched<any>(Array.from(chainUrls), 'evolution-chains')

  console.log()

  // ─── Stage 4: Normalize and Save ───────────────────────────────────
  console.log('💾 Stage 4: Normalizing and saving data...')

  // Normalize pokemon
  const pokemonEntries: PokemonEntry[] = []
  const allForms: Record<string, PokemonForm> = {}

  for (let i = 0; i < pokemonIds.length; i++) {
    const speciesData = speciesDataList[i]
    const pokemonData = pokemonDataList[i]
    const formsData = formsBySpecies.get(pokemonIds[i]) ?? []

    const entry = normalizePokemon(speciesData, pokemonData, formsData, altPokemonByName)
    pokemonEntries.push(entry)

    for (const form of entry.forms) {
      allForms[form.id] = form
    }
  }

  // Normalize types
  const types: TypeEntry[] = typesRaw.map(normalizeType)

  // Normalize games
  const vgMap = new Map<number, any>()
  for (const vg of versionGroupsRaw) {
    vgMap.set(vg.id, vg)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const games: GameEntry[] = versionsRaw.map((v: any) => {
    const game = normalizeGame(v)
    const vg = vgMap.get(game.versionGroupId)
    return vg ? enrichGameWithGeneration(game, vg) : game
  })

  // Normalize generations
  const generations: GenerationEntry[] = gensRaw.map(normalizeGeneration)

  // Normalize evolution chains
  const evolutionChains: Record<number, { pokemonIds: number[]; steps: EvolutionChain['steps'] }> = {}
  for (const chainRaw of chainsRaw) {
    const chain: EvolutionChain = normalizeEvolutionChain(chainRaw)
    evolutionChains[chain.id] = { pokemonIds: chain.pokemonIds, steps: chain.steps }
  }

  // Write JSON files
  writeJson('pokemon.json', pokemonEntries)
  writeJson('forms.json', allForms)
  writeJson('types.json', types)
  writeJson('generations.json', generations)
  writeJson('evolution-chains.json', evolutionChains)

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log()
  console.log('✅ Data pipeline complete!')
  console.log(`   Pokemon:    ${pokemonEntries.length}`)
  console.log(`   Forms:      ${Object.keys(allForms).length}`)
  console.log(`   Types:      ${types.length}`)
  console.log(`   Generations:${generations.length}`)
  console.log(`   Evo Chains: ${Object.keys(evolutionChains).length}`)
  console.log(`   Time:       ${elapsed}s`)
}

function writeJson(filename: string, data: unknown) {
  const path = join(DATA_DIR, filename)
  writeFileSync(path, JSON.stringify(data, null, 2))
  console.log(`  Wrote ${filename}`)
}

main().catch((err) => {
  console.error('❌ Pipeline failed:', err)
  process.exit(1)
})
