## Context

The type infrastructure for presets is complete (`OrganizationPreset`, `PresetRule`, `PokemonFilter`, `SortCriteria` in `src/types/preset.ts`) and static data is available (`src/data/pokemon.json`, `src/data/evolution-chains.json`). The scaffolded directories `src/lib/box-engine/` and `src/lib/presets/` exist but are empty. The missing piece is the runtime logic that turns a preset definition into a concrete array of `Box` objects.

The organizer is a pure computation layer — no UI, no store writes, no async. It takes inputs and returns boxes. Store integration (writing the result via `useBoxStore.setBoxes`) is the caller's responsibility.

## Goals / Non-Goals

**Goals:**
- Define a pure `applyPreset(preset, pokemon, evolutionChains)` function returning `Box[]`
- Implement a filter engine evaluating `PokemonFilter` criteria against `PokemonEntry`
- Implement a sort engine for all `SortCriteria` values including `evolution-chain`
- Implement a box name template renderer with a defined set of substitution variables
- Define all 8 built-in `OrganizationPreset` objects as static typed data
- Write unit tests for the organizer, filter, sort, and each built-in preset's output shape

**Non-Goals:**
- UI for selecting/applying presets (separate change)
- Custom preset editor (separate change)
- Drag-and-drop reordering after organization (already handled by box store)
- Variation filtering based on `VariationToggles` from settings (caller must pre-filter the Pokémon list before passing to organizer)

## Decisions

### 1. Pure function organizer — no store coupling

**Choice**: `applyPreset` is a standalone pure function: `(preset: OrganizationPreset, pokemon: PokemonEntry[], evolutionChains: Record<number, number[]>) => Box[]`

**Why**: Pure functions are trivially testable and composable. The box store's `setBoxes` action already handles writing the result. Coupling the organizer to the store would make it impossible to preview results without side effects.

**Alternative considered**: A hook (`useOrganizer`) — rejected because organizing is a data transformation, not a UI concern.

### 2. Multi-rule pipeline: sequential rule application with remainder

**Choice**: Rules are applied in `order` sequence. Each rule claims a subset of the remaining Pokémon pool (filtered + sorted), appends them as boxes, and removes them from the pool. After all rules, any unclaimed Pokémon are appended in dex order.

**Why**: This models exactly how the spec describes Legends First ("Boxes 1–N: Legendaries… Boxes N+1–M: Mythicals… Boxes M+1–end: Remaining"). Rules are order-dependent — the remainder naturally falls through.

**Implementation**:
```
remaining = all pokemon
for each rule (sorted by rule.order):
  matched = filter(remaining, rule.filter)
  sorted  = sort(matched, rule.sort, evolutionChains)
  boxes  += chunkIntoBoxes(sorted, rule.boxNameTemplate)
  remaining = remaining.filter(p => !matched.includes(p))
// remainder (if any) gets appended in dex order
```

### 3. Box name template variables

**Choice**: Define a fixed set of template variables resolved per-rule at chunking time:

| Variable | Resolved to |
|---|---|
| `{n}` | Box sequence number within this rule (1, 2, 3…) |
| `{total}` | Total boxes this rule produces |
| `{start}` | Dex number of first Pokémon in the box (padded to 3 digits) |
| `{end}` | Dex number of last Pokémon in the box (padded to 3 digits) |
| `{gen}` | Generation number (only valid for Gen by Gen preset) |
| `{type}` | Primary type name (only valid for Type Sorted preset) |
| `{region}` | Region name derived from generation (only valid for Regional Dex) |

**Why**: Templates are the spec's mechanism for auto-naming boxes (spec section 3.2.2). A fixed set is simpler to implement and document than a DSL. Variables are resolved lazily — unused variables are left as-is if the rule doesn't set them in context.

### 4. Competitive Living Dex — generation-based viability heuristic

**Choice**: Since PokéAPI has no competitive tier data, "competitively viable" maps to: `category === 'normal'` (excludes legendaries, mythicals, ultra-beasts, paradox Pokémon). "Restricted" maps to: `category === 'legendary' | 'mythical'`. "Others" = paradox + ultra-beast + baby.

**Why**: The spec describes it as "competitively viable (OU, UU, etc.)" but no static tier data exists in the project. The `normal` category is the closest proxy — it covers the overwhelming majority of Smogon-eligible Pokémon. The preset can be refined later when tier data is available without changing the engine.

**Alternative considered**: A hardcoded allowlist of Pokémon IDs — rejected as unmaintainable and hard to reason about.

### 5. Regional Dex — generation maps to region

**Choice**: `generation` field on `PokemonEntry` maps directly to region (gen 1 = Kanto, gen 2 = Johto, gen 3 = Hoenn, gen 4 = Sinnoh, gen 5 = Unova, gen 6 = Kalos, gen 7 = Alola, gen 8 = Galar/Hisui, gen 9 = Paldea). Pokémon with multiple regional appearances are placed in their original generation's group.

**Why**: PokéAPI's `generation` field represents the game the species debuted in, which maps 1:1 to region for base species. This avoids needing a separate regional-dex mapping table.

**Note**: Gen 8 is split as Galar (non-Hisui forms) and Hisui (Hisui regional forms) using form type `regional-hisui`.

### 6. Evolution chain sort — chain-ordered within dex sequence

**Choice**: For `sort: 'evolution-chain'`, Pokémon are sorted by: (1) the lowest dex number in their chain, then (2) their own dex number within the chain. Pokémon without an `evolutionChainId` are placed at the end in dex order.

**Why**: This keeps families together (Bulbasaur → Ivysaur → Venusaur) while maintaining predictable ordering across chains. The `evolution-chains.json` maps chain ID to an array of species IDs in chain order.

## Risks / Trade-offs

**[Risk] Forms included in organizing** → The organizer works on `PokemonEntry` (base species), not `PokemonForm`. Forms within a species are grouped with their base species and placed in the same slot. The caller decides whether to include alternate forms as separate entries. This is appropriate since the box engine operates at the species level.

**[Risk] Competitive Living Dex preset may not match user expectations** → Mitigation: The preset description string clearly states the heuristic used. Users can customize from the preset if they need different groupings.

**[Risk] Box name template variables not matching context** → Using `{gen}` in a non-gen rule silently leaves the literal `{gen}` in the name. Mitigation: Each built-in preset only uses variables valid for its context; document the variable set.

**[Trade-off] Remainder Pokémon always appended** → Any Pokémon not matched by any rule are silently appended in dex order. This is intentional (no Pokémon are ever dropped), but means the output box count is not strictly predictable from the preset definition alone.
