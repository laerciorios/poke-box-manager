## Context

All user data lives in four Zustand stores backed by IndexedDB via `idb-keyval`. `SettingsState` already carries `lastBackup?: string` (ISO date string) and `autoSave: boolean` — the field was reserved for exactly this feature. No existing export/import code exists in `src/lib/export/` or `src/lib/import/`. The Settings page (`src/app/[locale]/settings/page.tsx`) is a server component that renders client panels; the same pattern will be used for the new Data & Backup section.

Stores to round-trip:

| Store | Persisted key | Relevant state |
|---|---|---|
| `useBoxStore` | `"boxes"` | `boxes: Box[]` |
| `usePokedexStore` | `"pokedex"` | `registered: string[]` |
| `useSettingsStore` | `"settings"` | `SettingsState` (excluding `pendingChanges`) |
| `usePresetsStore` | `"presets"` | `presets: OrganizationPreset[]` |

## Goals / Non-Goals

**Goals:**
- Full-fidelity JSON round-trip for all four stores
- Schema version in the export envelope so future migrations can be applied on import
- Client-side only — no server, no third-party storage
- Schema validation on import that rejects structurally invalid files with a human-readable error
- Merge mode: union `registered`, append non-duplicate `boxes` and `presets` (by id), ignore imported settings
- Replace mode: overwrite all four stores
- Missing Pokémon text export: plain-text list (name + dex number), derived from `usePokedexStore.registered` crossed with static Pokémon data
- Backup reminder: non-blocking banner shown when `pendingChanges ≥ 20` AND `lastBackup` is more than 7 days ago (or undefined)

**Non-Goals:**
- Progress image export (spec 3.8 — deferred; requires canvas rendering, separate change)
- Missing list image export (deferred — same reason)
- Cloud sync / remote backup
- Importing from third-party Pokémon Home tools with different schemas
- Automatic scheduled export (requires Service Worker or native notifications — out of scope)

## Decisions

### 1. Export envelope schema — versioned, self-describing

```ts
interface ExportEnvelope {
  version: number           // bumped when shape changes; current: 1
  exportedAt: string        // ISO 8601 timestamp
  app: 'poke-box-manager'   // guard against importing unrelated JSON
  data: {
    boxes: Box[]
    registered: string[]
    settings: Omit<SettingsState, 'pendingChanges'>
    presets: OrganizationPreset[]
  }
}
```

`version` enables forward-compatible import logic: future importers can detect version 1 files and apply upgrade transforms before applying.

### 2. Validation — manual structural checks, no Zod

Zod is not currently a dependency. Adding it for a single use case adds ~12 kB. Instead, `validateExportSchema(parsed: unknown): ExportEnvelope` in `src/lib/import/schema.ts` performs:

1. Top-level shape check (`version`, `exportedAt`, `app`, `data` present and typed)
2. `app === 'poke-box-manager'` guard
3. Array checks for `data.boxes`, `data.registered`, `data.presets`
4. Spot-check representative fields of the first box and first preset (id: string, slots: array of length 30)
5. Throws `ImportValidationError` (custom error class) with a descriptive message on failure

This is intentionally permissive (not exhaustive field-by-field) to avoid false rejections on minor future schema additions.

**Why not Zod?** Avoids a runtime dependency for a single validation path; the corpus is small (one JSON object); manual checks are easier to read and maintain here.

### 3. Merge mode semantics

| Data | Merge behaviour |
|---|---|
| `registered` | Union: `new Set([...existing, ...imported])` |
| `boxes` | Append imported boxes whose `id` does not already exist in the store; skip duplicates |
| `presets` | Same as boxes — append by id, skip duplicates |
| `settings` | Ignored — user's current settings take precedence |

Replace mode: calls `clearAll()` on box/pokedex/presets stores, then `applyImport()` with the full payload.

### 4. Change tracking — `pendingChanges` counter in settings store

`pendingChanges: number` is added to `SettingsState` (default `0`). Two new actions:

- `recordChange()` — increments by 1 (called by every mutating action across all stores via direct `useSettingsStore.getState().recordChange()`)
- `recordBackup()` — sets `lastBackup` to `new Date().toISOString()` and resets `pendingChanges` to 0

Calling `getState()` directly (not via hook) avoids triggering re-renders in the calling stores and keeps the cross-store dependency clean.

**Why a counter vs a hash?** A counter is O(1) to update, requires no serialization, and the threshold (`≥ 20 changes`) is easy to reason about and tune. A content hash would need to snapshot the full state on every mutation.

### 5. Backup reminder as a client component in the root layout

`BackupReminderBanner` reads `pendingChanges` and `lastBackup` from `useSettingsStore`. It renders a dismissible banner (shadcn/ui `Alert`) in the layout when the threshold is met. Dismissing sets a session flag (in-memory, no persistence) so it doesn't re-appear until the next session or the counter resets.

**Why not a toast?** A banner is persistent and harder to miss; toasts auto-dismiss and could be missed if the user is focused elsewhere.

### 6. Missing Pokémon text export — client-side, one function

`exportMissingText(registered: string[], locale: Locale): string` in `src/lib/export/export.ts`:
1. Import `pokemon.json` statically
2. For each entry not in `registered`, emit `#NNNN Name` (locale-resolved name)
3. Join with `\n`
4. Trigger download via `Blob` + `URL.createObjectURL` with MIME `text/plain`

The output is also offered as a **"Copy to clipboard"** fallback via `navigator.clipboard.writeText()`.

### 7. UI — new section in Settings page

The Settings page gains a `<DataBackupPanel />` client component with:
- **Export JSON** button — triggers download immediately, no dialog
- **Export missing list** button — triggers download + shows a "Copy to clipboard" option
- **Import** button — opens a `<input type="file" accept=".json">` picker, then shows `ImportConfirmDialog`
- `ImportConfirmDialog` — shadcn/ui `Dialog` showing file metadata (exported date, counts) and two actions: "Replace all data" (destructive, red) and "Merge" (safe, default)

## Risks / Trade-offs

- **`pendingChanges` cross-store coupling** → Every mutating action in box/pokedex/presets stores must call `recordChange()`. Missing one means the counter under-counts. Mitigation: document the requirement in a code comment in each store; verify in tasks checklist.
- **Merge id collision** → Two boxes from different exports could have the same UUID if the user exports, clears, re-imports, and imports again. Mitigation: UUID collision is astronomically unlikely; document that IDs are UUIDs and skip by `id` is safe.
- **Large export file** → A user with 30+ boxes and 1006 registrations produces a file of ~150–300 kB — well within browser memory limits.
- **`FileReader` async** → `FileReader.onload` is callback-based. Mitigation: wrap in a `Promise` in `parseImportFile()` for ergonomic async/await use.
- **`pendingChanges` excluded from backup** → The counter itself should not be exported (it would always appear as 0 on re-import). Mitigation: `Omit<SettingsState, 'pendingChanges'>` in the envelope type.
