# Pokemon Box Manager — Specification Document

**Version:** 1.0
**Date:** April 4, 2026
**Stack:** Next.js 14+ (App Router) · TypeScript · Tailwind CSS · Zustand · PokéAPI

---

## 1. Overview

**Pokemon Box Manager** is a web platform that helps players manage their Pokémon Home boxes intelligently, offering tools to organize, track progress, and plan Pokédex completion.

The platform delivers a simple experience by default (for casual players) with advanced options accessible for dedicated players, all running in the browser with no backend required.

### 1.1 Design Principles

- **Simplicity first:** The default experience should work with zero configuration. The player opens the app, picks a preset, and starts marking.
- **Depth on demand:** Every simple feature has an advanced layer accessible via toggle or settings menu.
- **Faithful visuals:** The main view simulates real Pokémon Home boxes (6×5 grids = 30 slots per box).
- **Offline-first:** All user data stays in the browser. No information is sent to servers.
- **Extensible:** Architecture ready to add future generations, new games, and languages without refactoring.

---

## 2. Technical Architecture

### 2.1 Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Next.js 14+** (App Router) | SSG for static pages, RSC for performance, built-in SEO |
| Language | **TypeScript** (strict mode) | Strong typing for complex Pokémon data models |
| Styles | **Tailwind CSS** + **shadcn/ui** | Modern design system, accessible components, native dark mode |
| Global State | **Zustand** + persist middleware | Local state persisted to localStorage/IndexedDB automatically |
| Pokémon Data | **PokéAPI** (build-time consumption + cache) | Canonical and free Pokémon data source |
| i18n | **next-intl** | Internationalization with PT-BR and EN support from the start |
| Drag & Drop | **@dnd-kit/core** | Lightweight and accessible library for box reorganization |
| Icons | **Lucide React** | Consistent and lightweight icons |
| Tests | **Vitest** + **Testing Library** | Fast unit and integration tests |

### 2.2 Directory Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home / Dashboard
│   │   ├── boxes/
│   │   │   ├── page.tsx            # Main box visualization
│   │   │   └── [boxId]/page.tsx    # Individual box (detail)
│   │   ├── pokedex/
│   │   │   ├── page.tsx            # Full Pokédex (list/search)
│   │   │   └── [pokemonId]/page.tsx# Pokémon detail
│   │   ├── stats/
│   │   │   └── page.tsx            # Statistics and progress
│   │   ├── missing/
│   │   │   └── page.tsx            # Missing Pokémon (with filters)
│   │   ├── settings/
│   │   │   └── page.tsx            # General settings
│   │   └── presets/
│   │       └── page.tsx            # Organization preset manager
│   └── api/                        # (reserved for future integrations)
├── components/
│   ├── ui/                         # Base components (shadcn/ui)
│   ├── boxes/
│   │   ├── BoxGrid.tsx             # 6×5 grid for individual box
│   │   ├── BoxSlot.tsx             # Individual slot in grid
│   │   ├── BoxNavigation.tsx       # Navigation between boxes (< Box 1 >)
│   │   ├── BoxOverview.tsx         # Overview of all boxes
│   │   └── BoxDragLayer.tsx        # Drag & drop layer
│   ├── pokemon/
│   │   ├── PokemonSprite.tsx       # Sprite with fallback and loading
│   │   ├── PokemonCard.tsx         # Expanded card with info
│   │   ├── PokemonTooltip.tsx      # Hover tooltip with summary
│   │   └── PokemonGameList.tsx     # List of games where it appears
│   ├── pokedex/
│   │   ├── PokedexTable.tsx        # Pokédex table (list mode)
│   │   ├── PokedexFilters.tsx      # Filters and variation toggles
│   │   └── PokedexSearch.tsx       # Search by name/number
│   ├── stats/
│   │   ├── ProgressBar.tsx         # Overall progress bar
│   │   ├── ProgressByGen.tsx       # Progress by generation
│   │   ├── ProgressByType.tsx      # Progress by type
│   │   └── CompletionChart.tsx     # Completion chart
│   ├── settings/
│   │   ├── VariationToggles.tsx    # Variation toggles
│   │   ├── GameFilter.tsx          # Game filter
│   │   ├── GenerationFilter.tsx    # Generation filter
│   │   └── LanguageSwitch.tsx      # Language switcher
│   └── layout/
│       ├── Sidebar.tsx             # Main navigation
│       ├── Header.tsx              # Header with search and quick config
│       └── ThemeToggle.tsx         # Light/Dark mode
├── stores/
│   ├── useBoxStore.ts              # Box state and organization
│   ├── usePokedexStore.ts          # Registered/marked Pokémon
│   ├── useSettingsStore.ts         # User settings
│   └── usePresetsStore.ts         # Organization presets
├── data/
│   ├── pokemon.json                # Static data generated at build
│   ├── forms.json                  # Forms and variations
│   ├── games.json                  # Availability per game
│   ├── presets/                    # Pre-defined presets
│   │   ├── national-order.json
│   │   ├── legends-first.json
│   │   ├── gen-by-gen.json
│   │   └── type-sorted.json
│   └── generations.json            # Generation metadata
├── lib/
│   ├── pokeapi/
│   │   ├── client.ts               # PokéAPI consumption client
│   │   ├── fetcher.ts              # Fetch functions with retry/cache
│   │   └── types.ts                # PokéAPI types
│   ├── box-engine/
│   │   ├── organizer.ts            # Box organization logic
│   │   ├── presets.ts              # Preset system
│   │   └── calculator.ts           # Slot and box calculations
│   ├── export/
│   │   ├── json-export.ts          # Export/Import JSON
│   │   ├── image-export.ts         # Progress export as image
│   │   └── text-export.ts          # List export as text
│   ├── filters.ts                  # Filter and variation logic
│   ├── search.ts                   # Local search engine
│   └── utils.ts                    # General utilities
├── hooks/
│   ├── usePokemonData.ts           # Hook to access Pokémon data
│   ├── useBoxNavigation.ts         # Navigation between boxes
│   ├── useProgress.ts              # Progress calculations
│   ├── useSearch.ts                # Search with debounce
│   └── useExport.ts                # Export logic
├── types/
│   ├── pokemon.ts                  # Pokémon and variation types
│   ├── box.ts                      # Box and Slot types
│   ├── preset.ts                   # Preset types
│   ├── settings.ts                 # Settings types
│   └── game.ts                     # Game and version types
├── i18n/
│   ├── messages/
│   │   ├── pt-BR.json              # PT-BR translations
│   │   └── en.json                 # EN translations
│   ├── pokemon-names/
│   │   ├── pt-BR.json              # Pokémon names in PT-BR
│   │   └── en.json                 # Names in English
│   └── config.ts                   # next-intl configuration
└── scripts/
    ├── fetch-pokemon-data.ts        # Build script to fetch PokéAPI data
    ├── generate-sprites.ts          # Sprite optimization
    └── validate-data.ts             # Generated data validation
```

### 2.3 Data Strategy (PokéAPI)

The PokéAPI will be consumed **at build time** (not runtime), ensuring performance and eliminating API server dependency during usage.

**Data pipeline:**

1. **Build script** (`scripts/fetch-pokemon-data.ts`) fetches all necessary data from PokéAPI during `npm run build` or via dedicated script `npm run fetch-data`.
2. Data is processed, normalized, and saved as **static JSON** in `src/data/`.
3. The Next.js app imports these JSONs as static data — zero runtime requests.
4. A **runtime fallback** fetches from PokéAPI if any data doesn't exist locally (e.g., a newly added Pokémon).

**PokéAPI endpoints used:**

| Endpoint | Usage |
|---|---|
| `/api/v2/pokemon-species/{id}` | Name, generation, category (legendary, mythical, baby), variations, evolution |
| `/api/v2/pokemon/{id}` | Sprites, types, forms |
| `/api/v2/pokemon-form/{id}` | Regional forms, mega, gmax, etc. |
| `/api/v2/pokedex/1` | National Dex (complete list) |
| `/api/v2/generation/{id}` | Pokémon per generation |
| `/api/v2/version-group/{id}` | Game version grouping |
| `/api/v2/version/{id}` | Individual games |
| `/api/v2/type/{id}` | Types and relationships |

**Normalized data model (generated at build):**

```typescript
// types/pokemon.ts

interface PokemonEntry {
  id: number;                        // National Dex number
  name: string;                      // Default name (en)
  names: Record<Locale, string>;     // Translated names
  generation: number;                // Generation (1-9)
  types: [string, string?];          // Types [primary, secondary?]
  category: 'normal' | 'legendary' | 'mythical' | 'baby' | 'ultra-beast' | 'paradox';
  sprite: string;                    // Default sprite URL
  spriteShiny?: string;              // Shiny sprite URL
  forms: PokemonForm[];              // Variations/forms
  gameAvailability: GameId[];        // IDs of games where it appears
  evolutionChainId?: number;         // For grouping evolution lines
  homeAvailable: boolean;            // Available in Pokémon Home
}

interface PokemonForm {
  id: string;                        // E.g.: "pikachu-alola", "unown-a"
  name: string;                      // Form name
  names: Record<Locale, string>;     // Translated names
  formType: FormType;                // Variation type
  sprite: string;                    // Sprite for this form
  types?: [string, string?];         // Types (if different from base)
  gameAvailability?: GameId[];       // Specific availability
}

type FormType =
  | 'regional-alola'
  | 'regional-galar'
  | 'regional-hisui'
  | 'regional-paldea'
  | 'mega'
  | 'gmax'
  | 'gender'          // E.g.: Meowstic M/F
  | 'unown'           // Unown letters
  | 'vivillon'        // Vivillon patterns
  | 'alcremie'        // Alcremie variations
  | 'color'           // E.g.: Minior cores, Flabébé
  | 'size'            // E.g.: Pumpkaboo sizes
  | 'costume'         // E.g.: Pikachu with hats
  | 'battle'          // E.g.: Darmanitan Zen, Aegislash
  | 'origin'          // E.g.: Giratina Origin, Dialga Origin
  | 'tera'            // Terastal forms
  | 'other';          // Other variations

// types/box.ts

interface Box {
  id: string;
  name: string;                      // Box name (editable)
  label?: string;                    // Visual label/color
  slots: (BoxSlot | null)[];         // 30 slots (6×5 grid)
  wallpaper?: string;                // Box background
}

interface BoxSlot {
  pokemonId: number;                 // National Dex ID
  formId?: string;                   // Specific form ID
  registered: boolean;               // Whether the player has registered it
}

// types/preset.ts

interface OrganizationPreset {
  id: string;
  name: string;
  names: Record<Locale, string>;
  description: string;
  descriptions: Record<Locale, string>;
  isBuiltIn: boolean;                // Built-in preset vs custom
  rules: PresetRule[];               // Organization rules
  boxNames?: Record<number, string>; // Custom names per box
}

interface PresetRule {
  order: number;                     // Priority order
  filter: PokemonFilter;            // Which Pokémon to include
  sort: SortCriteria;               // Sorting criteria
  boxNameTemplate?: string;         // Box name template
}

interface PokemonFilter {
  categories?: PokemonCategory[];    // normal, legendary, mythical...
  generations?: number[];            // Included generations
  types?: string[];                  // Included types
  formTypes?: FormType[];            // Included form types
  exclude?: {                        // Exclusions
    categories?: PokemonCategory[];
    pokemonIds?: number[];
  };
}

type SortCriteria =
  | 'dex-number'
  | 'name'
  | 'type-primary'
  | 'generation'
  | 'evolution-chain';
```

### 2.4 Local Persistence (Zustand + IndexedDB)

```typescript
// stores/usePokedexStore.ts — Simplified example

interface PokedexState {
  // Registered Pokémon: Map<pokemonId, Set<formId | 'base'>>
  registered: Record<number, string[]>;

  // Actions
  toggleRegistered: (pokemonId: number, formId?: string) => void;
  bulkRegister: (entries: { pokemonId: number; formId?: string }[]) => void;
  clearAll: () => void;

  // Queries
  isRegistered: (pokemonId: number, formId?: string) => boolean;
  getRegisteredCount: () => number;
  getMissingPokemon: () => number[];
}

// stores/useSettingsStore.ts

interface SettingsState {
  // Variations included in tracking
  variations: {
    regionalForms: boolean;       // Regional forms (Alola, Galar, etc.)
    genderForms: boolean;         // Gender differences
    unownLetters: boolean;        // 28 Unown forms
    vivillonPatterns: boolean;    // 18+ Vivillon patterns
    alcremieVariations: boolean;  // 63 Alcremie variations
    colorVariations: boolean;     // Minior, Flabébé, etc.
    sizeVariations: boolean;      // Pumpkaboo, Gourgeist
    megaEvolutions: boolean;      // Mega evolutions
    gmaxForms: boolean;           // Gigantamax forms
    battleForms: boolean;         // Battle forms
    originForms: boolean;         // Origin forms (Legends)
    costumedPokemon: boolean;     // Costumed Pokémon
  };

  // Active generation filters
  activeGenerations: number[];    // [1, 2, 3, 4, 5, 6, 7, 8, 9]

  // Game filter
  gameFilter: 'switch-only' | 'all';
  activeGames: GameId[];

  // Appearance
  theme: 'light' | 'dark' | 'system';
  locale: 'pt-BR' | 'en';
  spriteStyle: 'home-3d' | 'pixel-gen5' | 'pixel-gen8' | 'official-art';

  // Data
  autoSave: boolean;
  lastBackup?: string; // ISO date
}
```

**Storage strategy:**

- **Zustand persist** with `IndexedDB` driver (via `idb-keyval`) for larger data (boxes, registrations).
- **localStorage** as fallback for lightweight settings.
- **Automatic schema migration** when updating the version (versioning in the state).

---

## 3. Core Features

### 3.1 Box Visualization (Main Screen)

The main screen displays boxes in a **6×5 grid** (30 slots), faithfully simulating the Pokémon Home experience.

**Features:**

- Visual grid with Pokémon sprites in each slot
- Navigation between boxes with arrows (← Box 1 →) or swipe on mobile
- **Overview mode**: mini-grids of all boxes on the same screen
- Each slot shows:
  - Pokémon sprite
  - Visual indicator of "registered" (green checkmark) or "missing" (opaque/desaturated slot)
  - Hover tooltip: name, number, type(s), status
- **Empty box** = gray slot with "?" or expected Pokémon number (ghost mode)
- **Drag & drop** to reorganize Pokémon between slots and boxes
- Box names editable with double-click
- Labels/colors per box (to identify categories like "Legendaries", "Gen 1", etc.)
- Shortcut to mark/unmark Pokémon as registered (click or keyboard)
- "Auto-fill" button based on selected preset

**Quick marking mode:**

- Toggle button "Registration Mode" that when active, each click on a slot marks/unmarks as registered
- Multi-select capability (Shift+Click for range, Ctrl+Click for individual)
- Floating action bar: "Mark X as registered" / "Unmark X"

### 3.2 Organization Preset System

The preset system allows the user to choose how to distribute Pokémon across boxes. Each preset defines grouping, filtering, and sorting rules.

#### 3.2.1 Built-in Presets

**1. National Dex Order**
- The simplest and most straightforward layout
- Pokémon organized from #001 to #1025 (or the last in the dex)
- Sequentially, 30 per box
- Box 1: #001–#030, Box 2: #031–#060, etc.
- Box names: "001–030", "031–060", etc.
- Includes all Pokémon without distinction

**2. Legends First**
- Popular community organization
- Boxes 1–N: Legendary Pokémon in dex order
- Boxes N+1–M: Mythical Pokémon in dex order
- Boxes M+1–end: Remaining Pokémon in dex order (skipping legendaries and mythicals)
- Box names: "Legendaries 1", "Mythicals 1", "001–030 (no legends)", etc.

**3. Generation by Generation (Gen by Gen)**
- Each generation starts in a new box
- Gen 1 (#001–#151) → Boxes 1–6
- Gen 2 (#152–#251) → Boxes 7–10
- And so on
- Pokémon in dex order within each generation
- Box names: "Gen 1 (1/6)", "Gen 1 (2/6)", etc.

**4. Primary Type (Type Sorted)**
- Pokémon grouped by primary type
- Within each type, sorted by dex number
- Type order: Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy
- Box names: "Normal 1", "Fire 1", "Water 1", etc.

**5. Evolution Chain**
- Groups Pokémon by evolution chain
- Each family stays together (e.g.: Bulbasaur → Ivysaur → Venusaur)
- Pokémon without evolutions are grouped at the end
- Box names: "Families 1", "Families 2", etc.

**6. Competitive Living Dex**
- Popular variation among competitive players
- Boxes 1–N: Competitively viable Pokémon (OU, UU, etc.) in dex order
- Boxes N+1–M: Restricted legendaries/mythicals
- Boxes M+1–end: Remaining
- Box names: "Comp. 1", "Restricted", "Others 1", etc.

**7. Regional Dex**
- Organized by regional Pokédex
- Boxes grouped by region: Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar, Hisui, Paldea
- Pokémon appearing in multiple regions placed in their first appearance
- Box names: "Kanto 1", "Johto 1", etc.

**8. Regional Forms Together**
- Base form + all regional forms placed together
- E.g.: Vulpix (Kanto) + Vulpix (Alola) side by side
- Remaining follows dex order
- Ideal for those who want to visualize all variations

#### 3.2.2 Preset Configuration

The user can:

- **Use a preset as-is:** Select and apply directly
- **Customize from a preset:** Select preset as base → modify rules → save as new custom preset
- **Create from scratch:** Define rules manually using the visual interface

**Preset editor interface:**

```
┌─────────────────────────────────────────────┐
│  Preset Editor                               │
│                                              │
│  Name: [My Custom Preset          ]         │
│  Base: [Legends First ▼]                    │
│                                              │
│  ── Rule 1 ───────────────────────────       │
│  Group: [ Legendaries ▼ ]                   │
│  Sort by: [ Dex # ▼ ]                       │
│  Starting box: [ 1 ]                        │
│  Box name: [ Legendaries {n} ]              │
│                                              │
│  ── Rule 2 ───────────────────────────       │
│  Group: [ Mythicals ▼ ]                     │
│  Sort by: [ Dex # ▼ ]                       │
│  Starting box: [ Auto ]                     │
│  Box name: [ Mythicals {n} ]                │
│                                              │
│  ── Rule 3 ───────────────────────────       │
│  Group: [ Remaining ▼ ]                     │
│  Sort by: [ Dex # ▼ ]                       │
│  Starting box: [ Auto ]                     │
│  Box name: [ {start}–{end} ]                │
│                                              │
│  [+ Add Rule]                               │
│                                              │
│  [Preview] [Save] [Cancel]                  │
└─────────────────────────────────────────────┘
```

**Each rule defines:**

- **Group/Filter:** Which set of Pokémon (by category, generation, type, or combination)
- **Sorting criteria:** Dex number, name, type, evolution chain
- **Starting box:** Box number or "Auto" (continues from previous)
- **Name template:** With variables like `{n}` (sequential number), `{start}` and `{end}` (dex range), `{gen}` (generation)

The **"Preview"** button shows a miniature preview of how the boxes would look before applying.

### 3.3 Variation Toggles

Configuration panel that defines **which forms and variations are considered** in Pokédex tracking. This directly impacts the total count and box slots.

```
┌──────────────────────────────────────────────┐
│  What do you want to complete?                │
│                                               │
│  ☑ Regional Forms                             │
│    Alola, Galar, Hisui, Paldea               │
│    +34 pokémon                                │
│                                               │
│  ☐ Gender Differences                         │
│    Meowstic, Indeedee, etc.                  │
│    +12 pokémon                                │
│                                               │
│  ☐ Unown Forms                                │
│    28 letters + ! and ?                       │
│    +27 pokémon                                │
│                                               │
│  ☐ Vivillon Patterns                          │
│    18 wing patterns                           │
│    +17 pokémon                                │
│                                               │
│  ☐ Alcremie Variations                        │
│    63 combinations (9 sweets × 7 flavors)    │
│    +62 pokémon                                │
│                                               │
│  ☐ Color Variations                           │
│    Minior, Flabébé, Oricorio, etc.           │
│    +15 pokémon                                │
│                                               │
│  ☐ Size Variations                            │
│    Pumpkaboo, Gourgeist                      │
│    +6 pokémon                                 │
│                                               │
│  ☑ Mega Evolutions                            │
│    48 megas + 2 Mega X/Y                     │
│    +48 pokémon                                │
│                                               │
│  ☑ Gigantamax Forms                           │
│    32 Gmax forms                              │
│    +32 pokémon                                │
│                                               │
│  ☐ Battle Forms                               │
│    Darmanitan Zen, Aegislash, etc.           │
│    +20 pokémon                                │
│                                               │
│  ☑ Origin/Alternative Forms                   │
│    Giratina, Shaymin, Dialga, Palkia, etc.  │
│    +10 pokémon                                │
│                                               │
│  ☐ Costumed Pokémon                           │
│    Event Pikachu, etc.                       │
│    +8 pokémon                                 │
│                                               │
│  ─────────────────────────────────            │
│  Total with selected variations: 1,149        │
│  Base total (no variations): 1,025            │
└──────────────────────────────────────────────┘
```

**Behavior:**

- Each toggle shows how many additional Pokémon will be considered
- The total updates in real time as toggles change
- When disabling a toggle, registered Pokémon from those variations **are not deleted**, just hidden
- A warning appears if the toggle impacts already-organized boxes

### 3.4 Game Availability

When opening a Pokémon's detail (or via expanded tooltip), the user sees in which games that Pokémon is available.

**Settings:**

- **Default:** Show only Nintendo Switch games
  - Pokémon Sword / Shield (+ DLCs: Isle of Armor, Crown Tundra)
  - Pokémon Brilliant Diamond / Shining Pearl
  - Pokémon Legends: Arceus
  - Pokémon Scarlet / Violet (+ DLCs: Teal Mask, Indigo Disk)
  - Pokémon Let's Go Pikachu / Eevee
  - Pokémon HOME
- **Expanded:** Toggle in settings to show **all games** (DS, 3DS, GBA, etc.)
  - Pokémon Red/Blue/Yellow (Virtual Console)
  - Pokémon Gold/Silver/Crystal (Virtual Console)
  - Pokémon Ruby/Sapphire/Emerald
  - Pokémon FireRed/LeafGreen
  - Pokémon Diamond/Pearl/Platinum
  - Pokémon HeartGold/SoulSilver
  - Pokémon Black/White / Black 2/White 2
  - Pokémon X/Y
  - Pokémon Omega Ruby/Alpha Sapphire
  - Pokémon Sun/Moon / Ultra Sun/Ultra Moon
  - Pokémon GO (transfer via HOME)

**Visual:** Badges with game icon, colored if available, gray if not.

**Extra feature — "Where to catch?":**

- Reverse filter: given a missing Pokémon, shows in which games the user can obtain it
- Can highlight the "easiest path" (game with the most missing Pokémon available)

### 3.5 Statistics and Progress

Dedicated dashboard with Pokédex completion progress visualizations.

**Key metrics:**

- **Overall progress:** Circular/donut bar with percentage and numbers (e.g.: 847/1025 — 82.6%)
- **Progress by generation:** Horizontal bars for each gen (Gen 1: 151/151, Gen 2: 89/100, etc.)
- **Progress by type:** Type grid with percentage indicators
- **Missing Pokémon:** Total number with direct link to missing list
- **Complete boxes:** How many boxes are 100% registered vs partial vs empty
- **Completion estimate:** Based on registration pace (if history exists)
- **Streak:** Consecutive days registering at least one Pokémon (light gamification)

**Graphic visualizations:**

- Bar chart: registered vs missing by generation
- Radar chart: completeness by type
- Heatmap: boxes (green = complete, yellow = partial, red = empty)
- Timeline: progress over time (if tracking is active)

### 3.6 Missing Pokémon

Dedicated screen listing all Pokémon not yet registered.

**Features:**

- List with sprites, names, and numbers
- Filters: by generation, by type, by category (normal/legendary/mythical)
- Sorting: by dex, by name, by type, by generation
- "Quick add": button to mark as registered directly from the list
- **"Next up" mode:** Shows the next X missing Pokémon in dex order (useful for knowing the next target)
- **Grouping:** Group missing by game where they can be obtained — shows which games cover the most missing

### 3.7 Search and Navigation

- **Global search** (header): by Pokémon name or number
- Search support in both languages (PT-BR and EN)
- Results show: sprite, name, number, type(s), status (registered/missing), which box it's in
- Fuzzy search for common typos (e.g.: "charzard" → "Charizard")
- Quick filters: type, generation, category, registration status

### 3.8 Data Export / Import

**Export:**

- **Full JSON:** Saves all data (boxes, registrations, settings, presets) to a JSON file
- **Progress image:** Generates an image (PNG/JPG) with a visual progress summary, ideal for sharing
- **Missing list (text):** Exports plain text list of missing Pokémon, ready to copy/paste in forums or trade chats
- **Missing list (image):** Visual grid of missing Pokémon with sprites

**Import:**

- Upload of previously exported JSON file
- Schema validation before import
- "Merge" option (combine with existing data) or "replace" (overwrite everything)
- Confirmation prompt before overwriting data

**Auto backup:**

- Periodic reminder (configurable) to export backup
- Detection of significant changes without recent backup

---

## 4. Suggested Features (Extras)

### 4.1 Shiny Tracker Mode

Toggle to track shiny versions separately. When enabled, each Pokémon gets two states: "Normal registered" and "Shiny registered". Shiny progress has its own statistics.

### 4.2 Notes per Pokémon

Free text field in each slot for notes. Usage examples: "OT: John, Nature: Adamant", "Needs stone evolution", "Pending trade with @friend".

### 4.3 Acquisition Checklist

For Pokémon with complex acquisition methods, a mini-checklist:

- "Evolve Eevee with Water Stone" → Vaporeon
- "Trade while holding Metal Coat" → Scizor
- "Level up in magnetic field" → Magnezone

Data pulled from PokéAPI (evolution chains).

### 4.4 Box Calculator

Utility tool that calculates how many boxes the user needs based on settings (active variations, selected generations). Shows: "With your settings, you need X boxes (Y Pokémon / 30 per box)".

### 4.5 "What to Play?" Mode

Based on missing Pokémon, suggests which game offers the most coverage. Shows a game ranking by "new accessible Pokémon" to help the player decide where to focus.

### 4.6 Custom Tags

The user can create tags and apply them to Pokémon (e.g.: "For trade", "Favorites", "Needs evolution", "Special event"). Tag filters across all screens.

### 4.7 Keyboard Shortcuts

Quick navigation: arrows to move between slots/boxes, Enter to toggle registration, `/` to open search, `Esc` to close modals. Intended for power users.

### 4.8 Activity History

Log of recent actions (registrations, reorganizations) with timestamps. Allows undoing the last action (undo). Limited to 100 recent actions to prevent unbounded growth.

---

## 5. Design and UX

### 5.1 Visual Theme

- **Style:** Modern and minimalist
- **Base colors:** Dark mode as default, with light mode available
  - Dark: Background `#0f0f0f` / Surface `#1a1a2e` / Accent `#e63946` (Poké Ball red)
  - Light: Background `#f8f9fa` / Surface `#ffffff` / Accent `#e63946`
- **Typography:** Inter (UI) + JetBrains Mono (numbers/codes)
- **Borders:** Rounded (radius 8–12px), subtle shadows
- **Sprites:** Home 3D style as default, with pixel art option
- **Animations:** Smooth transitions (150–300ms), no mandatory animations that block usage

### 5.2 Responsive Layout

- **Desktop (>1024px):** Fixed sidebar + content area with full box grid
- **Tablet (768–1024px):** Collapsible sidebar + adapted grid
- **Mobile (<768px):** Bottom navigation + grid with horizontal scroll per box + swipe gestures

### 5.3 Slot Visual States

| State | Visual |
|---|---|
| Registered | Colored sprite + subtle green checkmark in corner |
| Missing | Sprite with reduced opacity (30%) or dark silhouette |
| Empty slot (no Pokémon assigned) | Dashed border + "?" icon |
| Hover | Slight elevation (shadow) + tooltip |
| Selected | Highlight border (accent color) |
| Drag in progress | Ghost sprite following cursor |

### 5.4 Accessibility

- Full keyboard navigation
- ARIA labels for all interactive elements
- Minimum WCAG AA contrast
- Minimum touch target size: 44×44px (mobile)
- Reduced animations respecting `prefers-reduced-motion`

---

## 6. Performance and Optimizations

### 6.1 Sprite Strategy

- **Build-time:** Download and optimize sprites via script
- **Sprites in WebP** with PNG fallback
- **Sprite sheet** (optional): combine sprites into a single large image to reduce requests
- **Lazy loading:** Sprites loaded only when box is visible (Intersection Observer)
- **Placeholder:** SVG silhouette while sprite loads (skeleton loading)

### 6.2 Virtualization

- **Box overview:** Virtualize the box list (react-window or similar) — only visible boxes are rendered
- **Pokédex list:** Virtualized table for 1000+ rows

### 6.3 Static Data

- Pokémon JSONs imported statically (Next.js tree-shaking)
- Data per generation in separate chunks (code splitting)
- Service Worker for aggressive caching of static assets

### 6.4 Performance Targets

| Metric | Target |
|---|---|
| LCP | < 1.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| JS Bundle (gzip) | < 150KB |
| Pokémon Data (gzip) | < 300KB |
| Time to Interactive | < 2s |

---

## 7. Internationalization (i18n)

### 7.1 Initial Scope

- **PT-BR:** Full interface + Pokémon names in Portuguese
- **EN:** Full interface + names in English (international standard)

### 7.2 Structure

- All UI strings in translation files (`i18n/messages/`)
- Pokémon names in separate files (`i18n/pokemon-names/`) — data from PokéAPI which already provides translated names
- Route with locale: `/pt-BR/boxes`, `/en/boxes`
- Automatic browser language detection
- Language selector in header

### 7.3 Future Preparation

- Modular structure allowing language additions without code changes
- Pokémon names available in all PokéAPI languages (ja, ko, fr, de, es, it, zh)

---

## 8. Development Roadmap

### Phase 1 — Foundation (Weeks 1–3)

- Next.js + TypeScript + Tailwind + shadcn/ui project setup
- PokéAPI data fetch script and static JSON generation
- Data models and TypeScript types
- Zustand store with persistence
- Basic BoxGrid and BoxSlot components
- Sprite rendering
- Box navigation

### Phase 2 — Core Features (Weeks 4–6)

- Preset system (all 8 built-in presets)
- Custom preset editor
- Functional variation toggles
- Pokémon registration marking
- Quick registration mode (bulk marking)
- Drag & drop between slots

### Phase 3 — Information and Stats (Weeks 7–8)

- Pokémon detail (expanded card)
- Game availability
- Statistics dashboard
- Missing Pokémon screen with filters
- Global search

### Phase 4 — Polish and Extras (Weeks 9–10)

- i18n (PT-BR + EN)
- JSON export/import
- Image and text export
- Keyboard shortcuts
- Mobile responsiveness
- Accessibility audit
- Performance optimizations

### Phase 5 — Suggested Features (Weeks 11–12+)

- Shiny Tracker
- Notes per Pokémon
- Custom tags
- "What to Play?" mode
- Acquisition checklist
- Activity history

---

## 9. Technical Considerations

### 9.1 PokéAPI — Limits and Strategy

- Rate limit: 100 requests/minute (IP-based)
- Build fetch strategy: use `Promise.allSettled` with batches of 20 requests + delay
- Local cache of API responses during build (avoid re-fetching in consecutive builds)
- Fallback: maintain a data snapshot in the repository (in case the API is down)

### 9.2 Pokémon Home Limits

- Maximum of **6,000 Pokémon** (200 boxes × 30 slots)
- The platform must respect this limit and warn the user
- Pokémon HOME currently supports Pokémon up to Gen 9 (Scarlet/Violet)

### 9.3 Data Updates

- When a new generation or DLC is released, simply re-run the fetch script
- The data model supports new Pokémon without migration
- User data migration: versioning in the Zustand store schema
- In settings screen, a "New Pokémon available!" badge when an update is detected

### 9.4 SEO and Meta Tags

- Static pages with meta tags for SEO
- Open Graph tags for sharing
- Automatically generated sitemap
- Structured data (JSON-LD) for Pokémon

---

## 10. Testing Structure

| Type | Tool | Scope |
|---|---|---|
| Unit | Vitest | Preset logic, filters, progress calculations, organizer |
| Component | Testing Library | Box rendering, toggle interactions, drag & drop |
| E2E | Playwright | Complete flows: create preset → organize → mark → export |
| Visual | Storybook (optional) | Component catalog with different states |
| Performance | Lighthouse CI | Automated audits on each PR |

---

## Appendix A — Glossary

| Term | Definition |
|---|---|
| **Box** | Container of 30 slots (6×5) for storing Pokémon in Pokémon Home |
| **Living Dex** | Complete collection where every Pokémon (and each form) is stored simultaneously |
| **National Dex** | Pokédex that includes all Pokémon from all regions |
| **Preset** | Pre-defined configuration for how to organize Pokémon across boxes |
| **Regional Form** | Pokémon variation adapted to a region (Alola, Galar, Hisui, Paldea) |
| **Registered** | Pokémon that the player has already obtained/registered in their Pokémon Home |
| **Slot** | Individual position within a box that can hold a Pokémon |

## Appendix B — References

- PokéAPI: https://pokeapi.co/
- PokéAPI GitHub: https://github.com/PokeAPI/pokeapi
- Pokémon Home: https://home.pokemon.com/
- Next.js Docs: https://nextjs.org/docs
- Zustand: https://github.com/pmndrs/zustand
- shadcn/ui: https://ui.shadcn.com/
- @dnd-kit: https://dndkit.com/
- next-intl: https://next-intl-docs.vercel.app/
