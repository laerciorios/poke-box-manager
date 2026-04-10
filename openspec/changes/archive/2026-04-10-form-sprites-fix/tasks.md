## 1. Types

- [x] 1.1 Add `spriteShiny?: string` to the `PokemonForm` interface in `src/types/pokemon.ts`

## 2. Form Normalizer

- [x] 2.1 Update the signature of `normalizeForms` in `src/scripts/normalizers/form-normalizer.ts` to accept a fourth parameter `altPokemonByName: Map<string, any>`
- [x] 2.2 Update `normalizeForm` to receive and use an optional `altPokemonData?: any` argument — extract `sprite` from `altPokemonData?.sprites?.other?.home?.front_default` with fallback to `formData.sprites?.front_default`
- [x] 2.3 Extract `spriteShiny` from `altPokemonData?.sprites?.other?.home?.front_shiny` with fallback to `formData.sprites?.front_shiny`; include in the return object only when non-empty (`...(spriteShiny && { spriteShiny })`)
- [x] 2.4 Inside `normalizeForms`, perform the lookup: `const altPokemon = altPokemonByName.get(form.name)` and pass it to `normalizeForm(form, speciesId, altPokemon)`

## 3. Fetch Script

- [x] 3.1 In `src/scripts/fetch-pokemon-data.ts`, after downloading `altPokemonRaw`, build the index: `const altPokemonByName = new Map<string, any>(); for (const p of altPokemonRaw) altPokemonByName.set(p.name, p)`
- [x] 3.2 Pass `altPokemonByName` through to `normalizeForms` — update `normalizePokemon`'s signature to receive and forward the map

## 4. PokemonCard (single UI change)

- [x] 4.1 In `src/components/pokemon/PokemonCard.tsx`, update the `shinySprite` line to also read from the active form: `const shinySprite = activeForm?.spriteShiny ?? pokemon.spriteShiny`

## 5. Regenerate Data

- [x] 5.1 Run `npm run fetch-data` to regenerate `src/data/pokemon.json` and `src/data/forms.json` with corrected sprites
- [x] 5.2 Run `npm run validate-data` to confirm the generated files are valid
- [x] 5.3 Spot-check a few entries in the generated JSON — confirm a Mega form (e.g. `venusaur-mega`) has a Home 3D sprite URL and a shiny URL; confirm a form without Home sprite (e.g. `excadrill-mega`) still has a pixel `sprite` and a pixel `spriteShiny` as fallback
