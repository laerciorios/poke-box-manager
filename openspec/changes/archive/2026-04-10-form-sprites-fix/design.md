## Context

The fetch script (`fetch-pokemon-data.ts`) already downloads two types of data for each alternate form:

1. **`altPokemonRaw`** — from `/pokemon/<id>` (e.g. `/pokemon/10033` for Mega Venusaur). Contains `sprites.other.home.front_default` and `sprites.other.home.front_shiny`. Already cached.
2. **`allFormsRaw`** — from `/pokemon-form/<id>` (e.g. `/pokemon-form/10033`). Contains only `sprites.front_default` and `sprites.front_shiny` (pixel). Has no `other.home`.

`form-normalizer.ts` receives only `allFormsRaw` data and reads only `sprites.front_default`. The `altPokemonRaw` is available in the fetch script but never forwarded to the normalizer.

**Linkage key**: the `name` field is identical across both endpoints — `pokemon/10033.name === "venusaur-mega"` and `pokemon-form/venusaur-mega.name === "venusaur-mega"`. This allows building a name-keyed index.

## Goals / Non-Goals

**Goals:**
- Alternate forms display Home 3D sprites when available (81% of forms)
- Alternate forms have `spriteShiny` when available (79% of forms)
- Fallback to pixel sprite for forms without a Home sprite (fanmade megas, alternate builds)
- Zero UI component changes beyond the one-line PokemonCard fix

**Non-Goals:**
- Fetching additional data from PokéAPI — everything is already cached
- Adding sprites for forms that genuinely do not exist in Pokémon Home
- Changing any sprite display logic beyond reading `activeForm?.spriteShiny`

## Decisions

### 1. `altPokemonByName` index built in fetch script, passed to normalizer

In `fetch-pokemon-data.ts`, after downloading `altPokemonRaw`:

```ts
const altPokemonByName = new Map<string, any>()
for (const p of altPokemonRaw) {
  altPokemonByName.set(p.name, p)
}
```

Pass this map into `normalizeForms(formsData, speciesId, defaultPokemonName, altPokemonByName)`.

**Why index by name rather than numeric id?** The form normalizer receives `formData` from the form API endpoint, which exposes `formData.name === "venusaur-mega"` directly. Extracting the numeric id would require URL parsing. The name is the simplest and most reliable linkage field.

### 2. Sprite priority: Home 3D → pixel fallback

```ts
const sprite =
  altPokemonData?.sprites?.other?.home?.front_default ??
  formData.sprites?.front_default ?? ''

const spriteShiny =
  altPokemonData?.sprites?.other?.home?.front_shiny ??
  formData.sprites?.front_shiny ?? undefined
```

The fallback to `formData.sprites.front_shiny` ensures that forms without a Home 3D sprite still get a pixel shiny sprite when one is available.

### 3. `spriteShiny` added to `PokemonForm` as an optional field

```ts
export interface PokemonForm {
  id: string
  name: string
  names: Record<Locale, string>
  formType: FormType
  sprite: string
  spriteShiny?: string  // new
  types?: [string, string?]
}
```

Making it optional preserves backward compatibility — no existing consumer that destructures `PokemonForm` needs to change.

### 4. One-line PokemonCard fix

The `PokemonCard` currently reads:
```ts
const shinySprite = pokemon.spriteShiny
```

This needs to also read from the active form:
```ts
const shinySprite = activeForm?.spriteShiny ?? pokemon.spriteShiny
```

This single line change makes the shiny toggle in PokemonCard work correctly for forms once the data is populated.

## Risks / Trade-offs

- **Fanmade megas and invalid forms** → 67 forms have no Home sprite in PokéAPI. They will continue using the pixel fallback. This is acceptable — these are forms that do not exist in real Pokémon Home.
- **Cache staleness** → If PokéAPI has updated sprites since the cache was generated, running `npm run fetch-data` will pull the latest data. This is the expected behavior and carries no risk.
- **`forms.json` size increase** → Each form entry gains an optional shiny URL (~60–80 bytes). Total file growth is under 30 KB. Acceptable.
