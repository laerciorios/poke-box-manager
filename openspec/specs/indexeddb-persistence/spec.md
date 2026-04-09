## ADDED Requirements

### Requirement: IndexedDB storage adapter for Zustand
The system SHALL provide an IndexedDB-backed `StateStorage` implementation at `src/lib/indexeddb-storage.ts` using the `idb-keyval` library. The adapter SHALL implement Zustand's `StateStorage` interface (`getItem`, `setItem`, `removeItem`).

#### Scenario: Store and retrieve state
- **WHEN** `setItem(key, value)` is called with a string key and serialized state
- **THEN** the value SHALL be stored in IndexedDB
- **THEN** `getItem(key)` SHALL return the same value

#### Scenario: Remove state
- **WHEN** `removeItem(key)` is called with an existing key
- **THEN** the key SHALL be removed from IndexedDB
- **THEN** `getItem(key)` SHALL return `null`

#### Scenario: Handle IndexedDB unavailability gracefully
- **WHEN** IndexedDB is not available (SSR, restricted context)
- **THEN** `getItem` SHALL return `null` without throwing
- **THEN** `setItem` and `removeItem` SHALL be no-ops without throwing

### Requirement: Schema versioning support
Each store created with `createPersistedStore` SHALL support a `version` number and an optional `migrate` function. The version SHALL start at `1` for all stores in this change.

#### Scenario: First-time store creation
- **WHEN** a store is created and no persisted data exists
- **THEN** the store SHALL initialize with default state at version `1`

#### Scenario: Version match on hydration
- **WHEN** persisted data exists with the same version as the store definition
- **THEN** the persisted state SHALL be restored as-is with no migration

#### Scenario: Version mismatch triggers migration
- **WHEN** persisted data exists with a lower version than the store definition
- **THEN** the `migrate` function SHALL be called with the persisted state and old version
- **THEN** the migrated state SHALL be used and persisted with the new version
