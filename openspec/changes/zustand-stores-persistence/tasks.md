## 1. Infrastructure Setup

- [ ] 1.1 Install `idb-keyval` dependency
- [ ] 1.2 Create IndexedDB storage adapter at `src/lib/indexeddb-storage.ts` implementing Zustand's `StateStorage` interface with error handling for unavailable contexts
- [ ] 1.3 Update `src/lib/store.ts` to default to IndexedDB storage adapter and accept `version` + `migrate` options

## 2. Pokedex Store

- [ ] 2.1 Create `src/stores/usePokedexStore.ts` with registered set state and `toggleRegistered`, `isRegistered` actions
- [ ] 2.2 Add bulk operations: `registerAll`, `unregisterAll`, `clearAll`
- [ ] 2.3 Configure persistence with store name `"pokedex"` and version `1`

## 3. Box Store

- [ ] 3.1 Create `src/stores/useBoxStore.ts` with boxes array state and `createBox`, `deleteBox`, `renameBox` actions
- [ ] 3.2 Add slot management: `setSlot`, `clearSlot`, `moveSlot` (with swap logic)
- [ ] 3.3 Add `reorderBox` and `setBoxes` (bulk replace) actions
- [ ] 3.4 Configure persistence with store name `"boxes"` and version `1`

## 4. Settings Store

- [ ] 4.1 Create `src/stores/useSettingsStore.ts` with `SettingsState` initialized from `DEFAULT_SETTINGS`
- [ ] 4.2 Add variation actions: `setVariation`, `setVariations`
- [ ] 4.3 Add filter actions: `setActiveGenerations`, `setGameFilter`, `setActiveGames`
- [ ] 4.4 Add display actions: `setTheme`, `setLocale`, `setSpriteStyle`
- [ ] 4.5 Add `resetSettings` action
- [ ] 4.6 Configure persistence with store name `"settings"` and version `1`

## 5. Presets Store

- [ ] 5.1 Create `src/stores/usePresetsStore.ts` with presets array state and `getPreset` selector
- [ ] 5.2 Add custom preset CRUD: `createPreset`, `updatePreset`, `deletePreset` (with built-in protection)
- [ ] 5.3 Add `duplicatePreset` action
- [ ] 5.4 Configure persistence with store name `"presets"` and version `1`

## 6. Barrel Export & Verification

- [ ] 6.1 Create `src/stores/index.ts` barrel export for all four stores
- [ ] 6.2 Verify TypeScript compilation passes with `tsc --noEmit`
