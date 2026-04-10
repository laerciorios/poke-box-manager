## Context

The app currently only has `SpritePlaceholder.tsx` and an `index.ts` barrel in `src/components/pokemon/`. There is no tooltip or detail card. All required data already exists as static JSON (`pokemon.json`, `forms.json`, `evolution-chains.json`). No store changes are needed.

## Goals / Non-Goals

**Goals:**
- `PokemonTooltip` — lightweight hover preview (sprite, name, number, types); click opens detail
- `PokemonCard` — full-detail sheet/modal: name, number, types badge, generation, category, form switcher, evolution chain, shiny sprite toggle
- All components fully i18n-aware (pt-BR / en) via `useSettingsStore` locale

**Non-Goals:**
- Game availability display (removed — data cannot be reliably sourced from PokéAPI; see `remove-game-availability` change)
- Pokédex page routing or `[pokemonId]` route (separate concern)
- Marking Pokémon as registered from the card (separate capability)
- Drag-and-drop within the card

## Decisions

### 1. PokemonCard as a Sheet (not Dialog)

**Decision:** Use shadcn/ui `Sheet` (side panel) rather than a centered `Dialog`.

**Rationale:** The card shows dense info (evolution chain, multiple forms, game list). A side sheet gives more vertical space without obscuring the box grid, matching the Pokémon Home UX pattern. Evolution chains can be long and benefit from scrollable vertical layout.

**Alternative considered:** Centered modal — rejected because it covers the grid context the user is browsing.

### 2. Data access via direct JSON import + lookup helpers

**Decision:** Components receive a `pokemonId: number` prop and look up data internally from static JSON imports, via small lookup helpers (`getPokemonById`, `getEvolutionChain`).

**Rationale:** Consistent with the project's zero-runtime-fetch strategy. No new hooks needed; data is immutable at runtime.

**Alternative considered:** Passing the full `PokemonEntry` object as a prop — rejected because callers (BoxSlot, PokedexRow) only have `id`, and forcing them to resolve the entry creates duplication.

### 3. Form switcher as local UI state

**Decision:** The active form in the card is local `useState`, not persisted.

**Rationale:** Form selection in the detail view is ephemeral browsing, not user data. Persisting it adds store complexity for zero user value.

### 4. Shiny toggle as local UI state

**Decision:** Shiny toggle (default/shiny sprite) is local `useState` within `PokemonCard`.

**Rationale:** Same as form switcher — transient display preference, not part of any user model.

## Risks / Trade-offs

- **Evolution chain display complexity** → The chain may be branched (e.g., Eevee). Mitigation: render as a simple linear list for now; branching can be added in a follow-up. The `evolution-chains.json` stores `pokemonIds: number[]` linearly, which maps cleanly to a row.
- **Sprite URL availability** → Some forms may lack a shiny sprite. Mitigation: `PokemonSprite` already handles fallback; shiny toggle disables if `spriteShiny` is absent.
- **Performance on tooltip render** → JSON import is ~1 MB total. Mitigation: Next.js tree-shaking and the fact lookups are O(1) by index make this acceptable. No virtualization needed for the card itself.
- **i18n for Pokémon names** → Names come from `names: Record<Locale, string>` on each entry. Forms also have `names`. Mitigation: read locale from `useSettingsStore` and access the correct key.

## Open Questions

- Should `PokemonTooltip` use Radix `Tooltip` (delay-based hover) or `HoverCard` (richer content)? Recommend `HoverCard` since the preview includes a sprite image — but this can be decided at implementation time without blocking the spec.
