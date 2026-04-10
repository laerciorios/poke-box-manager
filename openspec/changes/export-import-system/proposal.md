## Why

The app stores all user data (boxes, registrations, settings, presets) exclusively in IndexedDB. There is currently no way to back up that data, move it between browsers, or share a missing Pokémon list with trade partners. A single browser cache clear can wipe months of work with no recovery path. Spec section 3.8 defines export/import as a core feature; `SettingsState` already reserves `lastBackup?: string` and `autoSave: boolean` fields in anticipation of this work.

## What Changes

- Add a **JSON export** that serialises all four stores (boxes, registrations, settings, presets) into a single versioned envelope and downloads it via `Blob + URL.createObjectURL`
- Add a **JSON import** that reads an uploaded file via `FileReader`, validates the schema, and applies data via either **Replace** (overwrite everything) or **Merge** (union registrations, append boxes/presets, keep settings from file) after a confirmation dialog
- Add a **missing Pokémon text export** that generates a plain-text list of unregistered Pokémon names (one per line, optionally prefixed with dex number) suitable for copy-pasting into trade forums
- Add a **backup reminder notification** shown when the app detects significant unexported changes (tracked via a `pendingChanges` counter in `useSettingsStore`) and the last backup was more than 7 days ago (configurable)
- Surface all actions in a new **"Data & Backup"** section on the Settings page

## Capabilities

### New Capabilities

- `data-export`: Download full user data as a versioned JSON file and export missing Pokémon list as plain text
- `data-import`: Upload and apply a previously exported JSON file with schema validation and merge/replace confirmation
- `backup-reminder`: Detect significant unexported changes and surface a non-blocking reminder banner/toast

### Modified Capabilities

- `settings-store`: Add `pendingChanges: number` field to `SettingsState` (and `DEFAULT_SETTINGS`) for tracking mutations since last backup; add `recordChange()` and `recordBackup()` actions; store is already versioned and will require a migration

## Impact

- **Modified**: `src/types/settings.ts` — add `pendingChanges: number` to `SettingsState` and `DEFAULT_SETTINGS`
- **Modified**: `src/stores/useSettingsStore.ts` — add `recordChange()`, `recordBackup()` actions; bump schema version; add migration
- **Modified**: `src/stores/useBoxStore.ts`, `usePokedexStore.ts`, `usePresetsStore.ts` — call `useSettingsStore.getState().recordChange()` on every mutating action
- **Modified**: `src/app/[locale]/settings/page.tsx` — add "Data & Backup" section
- **New lib**: `src/lib/export/export.ts` — `buildExportPayload()`, `downloadJson()`, `exportMissingText()`
- **New lib**: `src/lib/import/import.ts` — `parseImportFile()`, `validateExportSchema()`, `applyImport(mode)`
- **New lib**: `src/lib/import/schema.ts` — `ExportEnvelope` type + validation logic
- **New components**: `src/components/settings/DataBackupPanel.tsx`, `BackupReminderBanner.tsx`, `ImportConfirmDialog.tsx`
- No new npm dependencies — uses browser-native `Blob`, `URL.createObjectURL`, `FileReader`, `JSON.parse`
- Relates to spec section **3.8 Data Export / Import**
