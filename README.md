# Poke Box Manager

An offline-first Pokemon Home style box manager built with Next.js.

## About

Poke Box Manager is a client-side web app for organizing and tracking Pokemon collections without relying on a backend server. It uses static Pokemon data generated at build time and stores user progress locally in the browser (IndexedDB).

The project focuses on:

- Home-like box management (30 slots per box, drag and drop, box overview)
- Pokedex progress tracking
- Missing Pokemon analysis
- Collection stats (overall, by generation, by type, shiny progress)
- Preset-based organization workflows
- Internationalization (`pt-BR` and `en`)

## Main Features

- Offline-first experience (no runtime API dependency)
- Local persistence with Zustand + IndexedDB
- Build-time Pokemon data pipeline using PokeAPI
- Box management with drag-and-drop interactions (`@dnd-kit`)
- Shiny tracking and variation toggles
- Visual analytics with Recharts
- Responsive App Router UI with Next.js 16

## How to Run

### Prerequisites

- Node.js 20+
- npm 10+

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

Open `http://localhost:3000`.

### 3) Production build

```bash
npm run build
npm run start
```

### 4) Quality checks

```bash
npm run lint
npm run format
```

## Data Pipeline

Pokemon data is generated ahead of time and stored in `src/data/*.json`.

### Refresh data from PokeAPI

```bash
npm run fetch-data
```

### Generate localized Pokemon names

```bash
npm run generate-locales
```

### Validate generated data

```bash
npm run validate-data
```

Notes:

- The fetch script uses a local cache in `.cache/`.
- The app imports static JSON directly; there are no runtime API calls.

## Technologies

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling/UI:** Tailwind CSS 4, shadcn/ui, Base UI
- **State Management:** Zustand
- **Persistence:** IndexedDB (`idb-keyval`) via persisted Zustand stores
- **I18n:** `next-intl`
- **Drag and Drop:** `@dnd-kit`
- **Charts:** Recharts
- **Tooling:** ESLint, Prettier, tsx

## Architecture Overview

- **No backend:** everything runs client-side.
- **Static domain data:** fetched and normalized at build time.
- **Persisted user state:** stored locally in IndexedDB.
- **Modular stores:** dedicated stores for boxes, pokedex, settings, and presets.

### Core Stores

- `useBoxStore` - box CRUD, slot movement/reordering, shiny toggles
- `usePokedexStore` - registration state tracking
- `useSettingsStore` - preferences and display toggles
- `usePresetsStore` - organization preset management

## Project Structure

```text
src/
  app/                    # Next.js routes and layouts
  components/             # UI and feature components
  data/                   # Generated static Pokemon data
  hooks/                  # Reusable React hooks
  i18n/                   # Locale routing/messages/name dictionaries
  lib/                    # Shared utilities and engines
  scripts/                # Data fetch/normalize/validate scripts
  stores/                 # Zustand persisted stores
  types/                  # Domain types
openspec/                 # Structured change proposals/specs/tasks
```

## Localization

- Supported locales: `pt-BR` (default) and `en`
- Route structure is locale-aware (`/[locale]/...`)
- Messages are in `src/i18n/messages/`

## Important Notes

- User data is local to the browser and device.
- Clearing browser storage removes saved progress.
- This repository currently does not include a dedicated automated test suite.

## License

No license file is currently defined in this repository.
