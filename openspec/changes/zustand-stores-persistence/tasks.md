## 1. Infrastructure Setup

- [x] 1.1 Install `idb-keyval` dependency
- [x] 1.2 Create IndexedDB storage adapter at `src/lib/indexeddb-storage.ts` implementing Zustand's `StateStorage` interface with error handling for unavailable contexts
- [x] 1.3 Update `src/lib/store.ts` to default to IndexedDB storage adapter and accept `version` + `migrate` options

## 2. Pokedex Store

- [x] 2.1 Create `src/stores/usePokedexStore.ts` with registered set state and `toggleRegistered`, `isRegistered` actions
- [x] 2.2 Add bulk operations: `registerAll`, `unregisterAll`, `clearAll`
- [x] 2.3 Configure persistence with store name `"pokedex"` and version `1`

## 3. Box Store

- [x] 3.1 Create `src/stores/useBoxStore.ts` with boxes array state and `createBox`, `deleteBox`, `renameBox` actions
- [x] 3.2 Add slot management: `setSlot`, `clearSlot`, `moveSlot` (with swap logic)
- [x] 3.3 Add `reorderBox` and `setBoxes` (bulk replace) actions
- [x] 3.4 Configure persistence with store name `"boxes"` and version `1`

## 4. Settings Store

- [x] 4.1 Create `src/stores/useSettingsStore.ts` with `SettingsState` initialized from `DEFAULT_SETTINGS`
- [x] 4.2 Add variation actions: `setVariation`, `setVariations`
- [x] 4.3 Add filter actions: `setActiveGenerations`, `setGameFilter`, `setActiveGames`
- [x] 4.4 Add display actions: `setTheme`, `setLocale`, `setSpriteStyle`
- [x] 4.5 Add `resetSettings` action
- [x] 4.6 Configure persistence with store name `"settings"` and version `1`

## 5. Presets Store

- [x] 5.1 Create `src/stores/usePresetsStore.ts` with presets array state and `getPreset` selector
- [x] 5.2 Add custom preset CRUD: `createPreset`, `updatePreset`, `deletePreset` (with built-in protection)
- [x] 5.3 Add `duplicatePreset` action
- [x] 5.4 Configure persistence with store name `"presets"` and version `1`

## 6. Barrel Export & Verification

- [x] 6.1 Create `src/stores/index.ts` barrel export for all four stores
- [x] 6.2 Verify TypeScript compilation passes with `tsc --noEmit`
