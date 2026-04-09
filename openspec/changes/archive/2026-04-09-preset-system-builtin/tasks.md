## 1. Type Updates

- [x] 1.1 Add `'regional-dex'` to the `SortCriteria` union type in `src/types/preset.ts`

## 2. Filter Engine

- [x] 2.1 Create `src/lib/box-engine/filter.ts` — implement `filterPokemon(pokemon: PokemonEntry[], filter: PokemonFilter): PokemonEntry[]` applying `categories`, `generations`, `types`, `formTypes` with AND logic, and `exclude` overrides

## 3. Sort Engine

- [x] 3.1 Create `src/lib/box-engine/sort.ts` — implement `sortPokemon(pokemon: PokemonEntry[], criteria: SortCriteria, evolutionChains: Record<number, number[]>): PokemonEntry[]` for all 6 criteria values
- [x] 3.2 Implement `dex-number` sort (ascending by `id`)
- [x] 3.3 Implement `generation` sort (ascending `generation`, then `id`)
- [x] 3.4 Implement `type-primary` sort using the canonical 18-type order constant, then by `id`
- [x] 3.5 Implement `evolution-chain` sort: group by lowest chain dex ID, sort groups ascending, within group sort by chain position; Pokémon with no `evolutionChainId` appended at end in dex order
- [x] 3.6 Implement `name` sort (alphabetical by lowercase `name`)
- [x] 3.7 Implement `regional-dex` sort: group by `generation`, order groups chronologically (gen 1→9), sort within group by `id`

## 4. Box Name Template Renderer

- [x] 4.1 Create `src/lib/box-engine/name-template.ts` — implement `renderBoxName(template: string, context: Partial<BoxNameContext>): string` substituting `{n}`, `{total}`, `{start}`, `{end}`, `{gen}`, `{type}`, `{region}`; unknown variables left as-is; `{start}` and `{end}` padded to 3 digits
- [x] 4.2 Define and export the `BoxNameContext` interface with fields: `n: number`, `total: number`, `start: number`, `end: number`, `gen?: number`, `type?: string`, `region?: string`

## 5. Core Organizer

- [x] 5.1 Create `src/lib/box-engine/organizer.ts` — implement `applyPreset(preset: OrganizationPreset, pokemon: PokemonEntry[], evolutionChains: Record<number, number[]>): Box[]`
- [x] 5.2 Implement the multi-rule pipeline: iterate rules in ascending `order`, filter + sort each batch from remaining pool, chunk into 30-slot boxes with name rendering, remove matched Pokémon from pool
- [x] 5.3 Implement remainder handling: any unclaimed Pokémon after all rules appended in dex order with default box names (`"Box {n}"`)

## 6. Built-in Preset Definitions

- [x] 6.1 Create `src/lib/presets/builtin-presets.ts` — define `BUILTIN_PRESETS: OrganizationPreset[]` with all 8 presets
- [x] 6.2 Implement `national-dex-order`: 1 rule, empty filter, `dex-number` sort, template `"{start}–{end}"`
- [x] 6.3 Implement `legends-first`: 3 rules — legendaries (`"Legendaries {n}"`), mythicals (`"Mythicals {n}"`), remainder (`"{start}–{end} (no legends)"`)
- [x] 6.4 Implement `gen-by-gen`: 9 rules, one per generation, filter by `generations: [n]`, `dex-number` sort, template `"Gen {gen} ({n}/{total})"`
- [x] 6.5 Implement `type-sorted`: 1 rule, empty filter, `type-primary` sort, template `"{type} {n}"`
- [x] 6.6 Implement `evolution-chain`: 1 rule, empty filter, `evolution-chain` sort, template `"Families {n}"`
- [x] 6.7 Implement `competitive-living-dex`: 3 rules — `category: normal` (`"Comp. {n}"`), `category: legendary|mythical` (`"Restricted {n}"`), remainder (`"Others {n}"`)
- [x] 6.8 Implement `regional-dex`: 9 rules, one per region/generation (Kanto=gen 1 … Paldea=gen 9), `dex-number` sort, template `"{region} {n}"`
- [x] 6.9 Implement `regional-forms-together`: 1 rule, empty filter, `dex-number` sort with regional forms sorted adjacent to their base species, template `"Forms {n}"`
- [x] 6.10 Add translated `names` and `descriptions` in both `en` and `pt-BR` for all 8 presets

## 7. Verification

- [x] 7.1 Verify TypeScript compilation passes with `tsc --noEmit`
