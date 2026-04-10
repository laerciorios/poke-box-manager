## 1. Settings Store — Change Tracking

- [ ] 1.1 Add `pendingChanges: number` (default `0`) to `SettingsState` interface in `src/types/settings.ts` and to `DEFAULT_SETTINGS`
- [ ] 1.2 Add `recordChange()` and `recordBackup()` actions to `useSettingsStore` (increment counter / reset counter + set `lastBackup`)
- [ ] 1.3 Bump `useSettingsStore` schema version from `2` to `3`; add v2→v3 migration that sets `pendingChanges: 0` on persisted state missing the field
- [ ] 1.4 Call `useSettingsStore.getState().recordChange()` in every mutating action in `useBoxStore` (setSlot, clearSlot, swapSlots, reorderSlot, setBulkSlots, toggleShiny, etc.)
- [ ] 1.5 Call `recordChange()` in every mutating action in `usePokedexStore` (toggleRegistered, registerAll, unregisterAll, clearAll)
- [ ] 1.6 Call `recordChange()` in every mutating action in `usePresetsStore` (createPreset, updatePreset, deletePreset, duplicatePreset)

## 2. Export Library

- [ ] 2.1 Create `src/lib/export/types.ts` with the `ExportEnvelope` interface (version, exportedAt, app, data: {boxes, registered, settings, presets})
- [ ] 2.2 Create `src/lib/export/export.ts` with `buildExportPayload(): ExportEnvelope` — reads current state from all four stores via `getState()`, excludes `pendingChanges` from settings
- [ ] 2.3 Add `downloadJson(payload: ExportEnvelope): void` to `export.ts` — serialises to JSON, creates a `Blob`, triggers download via `URL.createObjectURL` with filename `poke-box-manager-YYYY-MM-DD.json`, calls `recordBackup()` on success
- [ ] 2.4 Add `exportMissingText(registered: string[], locale: Locale): string` to `export.ts` — crosses `registered` with `pokemon.json`, formats each missing entry as `#NNNN Name`, sorts by dex number
- [ ] 2.5 Add `downloadText(content: string, filename: string): void` to `export.ts` — creates a `text/plain` Blob and triggers download via `URL.createObjectURL`

## 3. Import Library

- [ ] 3.1 Create `src/lib/import/schema.ts` with the `ImportValidationError` class and `validateExportSchema(parsed: unknown): ExportEnvelope` — checks top-level shape, `app` guard, array checks on `data.boxes`, `data.registered`, `data.presets`, spot-checks first box (id: string, slots array length 30)
- [ ] 3.2 Create `src/lib/import/import.ts` with `parseImportFile(file: File): Promise<ExportEnvelope>` — wraps `FileReader.readAsText` in a Promise, parses JSON, calls `validateExportSchema`, throws `ImportValidationError` on any failure
- [ ] 3.3 Add `applyImportReplace(envelope: ExportEnvelope): void` to `import.ts` — clears all four stores then loads `boxes`, `registered`, `presets`, and `settings` (minus `pendingChanges`) from the envelope; calls `recordBackup()`
- [ ] 3.4 Add `applyImportMerge(envelope: ExportEnvelope): void` to `import.ts` — unions `registered`, appends `boxes` and `presets` by id (skip duplicates), leaves settings unchanged; calls `recordBackup()`

## 4. i18n Translation Keys

- [ ] 4.1 Add PT-BR translation keys: "Data & Backup" section title and description, "Export JSON" button, "Export missing list" button, "Import" button, "Download as .txt" option, "Copy to clipboard" option, "Copied!" confirmation, ImportConfirmDialog title/body/metadata labels, "Replace all data" button, "Merge" button, "Cancel" button, import error messages, backup reminder banner text, "Export now" link
- [ ] 4.2 Add the same keys to the EN translation file

## 5. UI Components

- [ ] 5.1 Create `src/components/settings/ImportConfirmDialog.tsx` — shadcn/ui `Dialog` showing file metadata (exportedAt date, counts of boxes/registrations/presets), two primary actions ("Replace all data" in destructive style, "Merge" as default), "Cancel"; accepts `envelope`, `onReplace`, `onMerge`, `onClose` props
- [ ] 5.2 Create `src/components/settings/DataBackupPanel.tsx` — client component with "Export JSON" button (calls `downloadJson`), "Export missing list" section with "Download .txt" and "Copy to clipboard" buttons, hidden `<input type="file" accept=".json">` wired to import flow; manages `importError: string | null` state and renders error inline; opens `ImportConfirmDialog` after successful validation
- [ ] 5.3 Create `src/components/layout/BackupReminderBanner.tsx` — client component reading `pendingChanges` and `lastBackup` from `useSettingsStore`; renders a dismissible `Alert` banner when threshold is met (`pendingChanges ≥ 20` AND `lastBackup` undefined or > 7 days ago); dismiss sets in-memory session flag; "Export now" button triggers `downloadJson` inline
- [ ] 5.4 Add the `DataBackupPanel` as a new section in `src/app/[locale]/settings/page.tsx` (below existing sections)
- [ ] 5.5 Add `BackupReminderBanner` to `src/app/[locale]/layout.tsx` (rendered inside the main content area, above page content)

## 6. Polish & Edge Cases

- [ ] 6.1 Verify that `URL.createObjectURL` URLs are revoked after download (call `URL.revokeObjectURL` after a short delay or on the next tick) to avoid memory leaks
- [ ] 6.2 Verify copy-to-clipboard shows a "Copied!" feedback for 2 seconds then resets
- [ ] 6.3 Verify Replace import: after applying, all four stores reflect only the imported data (no residual previous data)
- [ ] 6.4 Verify Merge import: duplicate box/preset ids are not duplicated; registered union is correct with no duplicates
- [ ] 6.5 Verify `pendingChanges` is absent from the exported JSON file (open file in text editor and confirm)
- [ ] 6.6 Verify backup banner disappears immediately after clicking "Export now" (counter resets to 0)
- [ ] 6.7 Verify banner does not reappear after session dismiss even if `pendingChanges` is still ≥ 20 (in-memory flag survives in-page navigation but resets on page reload)
- [ ] 6.8 Test import with a deliberately corrupted file and confirm the error message is shown without data loss
