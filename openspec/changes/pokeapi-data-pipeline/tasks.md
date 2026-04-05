## 1. TypeScript Type Definitions

- [ ] 1.1 Create `src/types/pokemon.ts` with PokemonEntry, PokemonForm, and FormType interfaces matching spec section 2.3
- [ ] 1.2 Create `src/types/game.ts` with GameId, Generation, and game-related types
- [ ] 1.3 Add Locale type and ensure `Record<Locale, string>` works for PT-BR and EN

## 2. PokeAPI HTTP Client

- [ ] 2.1 Install `p-limit` as a dev dependency for concurrency control
- [ ] 2.2 Install `tsx` as a dev dependency for running TypeScript scripts
- [ ] 2.3 Create `src/scripts/pokeapi-client.ts` with batched HTTP fetcher (20 concurrent, 100ms delay between batches)
- [ ] 2.4 Implement retry logic with exponential backoff (3 attempts: 1s, 2s, 4s)
- [ ] 2.5 Implement local disk cache in `.cache/pokeapi/` with read/write/invalidation (`--no-cache` flag)
- [ ] 2.6 Add `.cache/` to `.gitignore`
- [ ] 2.7 Implement progress reporting to stdout (batch number, percentage, ETA)

## 3. Category and FormType Mapping

- [ ] 3.1 Create `src/scripts/pokemon-categories.ts` with hardcoded lists for ultra-beasts and paradox Pokemon IDs
- [ ] 3.2 Implement category classification function: normal, legendary, mythical, baby, ultra-beast, paradox
- [ ] 3.3 Implement FormType mapping function from PokeAPI form names to spec FormType enum (regional-*, mega, gmax, gender, unown, vivillon, alcremie, color, size, costume, battle, origin, tera, other)

## 4. Data Normalization Pipeline

- [ ] 4.1 Create `src/scripts/normalizers/pokemon-normalizer.ts` — transforms raw species + pokemon data into PokemonEntry
- [ ] 4.2 Create `src/scripts/normalizers/form-normalizer.ts` — transforms raw form data into PokemonForm
- [ ] 4.3 Create `src/scripts/normalizers/type-normalizer.ts` — transforms raw type data into typed output with translated names
- [ ] 4.4 Create `src/scripts/normalizers/game-normalizer.ts` — transforms version/version-group data into game objects
- [ ] 4.5 Create `src/scripts/normalizers/generation-normalizer.ts` — transforms generation data into metadata
- [ ] 4.6 Create `src/scripts/normalizers/evolution-normalizer.ts` — transforms evolution chain data into chainId → Pokemon ID arrays
- [ ] 4.7 Implement PT-BR/EN name extraction with EN fallback and missing translation warnings

## 5. Main Fetch Script

- [ ] 5.1 Create `src/scripts/fetch-pokemon-data.ts` as the main entry point with 4-stage pipeline:
  1. Fetch National Dex (get all Pokemon IDs)
  2. Fetch details (species, pokemon, forms — batched)
  3. Fetch metadata (types, generations, games, evolution chains — batched)
  4. Normalize and save JSONs
- [ ] 5.2 Add `--no-cache` CLI flag support for cache invalidation
- [ ] 5.3 Add summary output: total Pokemon, forms, types, games, generations, chains fetched
- [ ] 5.4 Add `fetch-data` script to `package.json`: `"fetch-data": "tsx src/scripts/fetch-pokemon-data.ts"`

## 6. Output JSON Generation

- [ ] 6.1 Write `pokemon.json` — Array of PokemonEntry (all National Dex entries)
- [ ] 6.2 Write `forms.json` — Map of formId to PokemonForm
- [ ] 6.3 Write `types.json` — Array of type objects with translated names
- [ ] 6.4 Write `games.json` — Array of game objects with generation and version group info
- [ ] 6.5 Write `generations.json` — Array of generation metadata
- [ ] 6.6 Write `evolution-chains.json` — Map of chainId to Pokemon ID arrays
- [ ] 6.7 Add `src/data/*.json` to `.gitignore` (generated files, not committed)

## 7. Data Validation Script

- [ ] 7.1 Create `src/scripts/validate-data.ts` that checks all 6 JSON files exist
- [ ] 7.2 Implement schema validation: required fields present and correct types for each interface
- [ ] 7.3 Implement completeness checks: no National Dex gaps, valid type/game/chain references
- [ ] 7.4 Implement summary output with counts and pass/fail status
- [ ] 7.5 Add `validate-data` script to `package.json`: `"validate-data": "tsx src/scripts/validate-data.ts"`

## 8. Verification

- [ ] 8.1 Run `npm run fetch-data` end-to-end and verify all 6 JSON files are generated
- [ ] 8.2 Run `npm run validate-data` and verify all checks pass
- [ ] 8.3 Spot-check pokemon.json: verify Pikachu (#25), Mewtwo (#150), and a Gen 9 Pokemon have correct data
- [ ] 8.4 Verify forms: check Alolan Vulpix, Mega Charizard, and Gigantamax Pikachu have correct formType
- [ ] 8.5 Verify cache works: re-run fetch-data and confirm it uses cache (fast completion)
