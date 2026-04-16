## ADDED Requirements

### Requirement: Tag data model

The system SHALL define a `Tag` interface in `src/types/tags.ts` with fields `id: string` (UUID), `name: string` (max 32 chars), `color: string` (hex value from predefined palette), and `createdAt: number` (timestamp ms).

#### Scenario: Tag has required fields

- **WHEN** a new tag is created
- **THEN** it SHALL have a unique UUID `id`, a non-empty `name`, a valid `color` from the palette, and a `createdAt` timestamp

### Requirement: Tags store manages tag CRUD

The system SHALL provide a `useTagsStore` Zustand store at `src/stores/useTagsStore.ts` that manages an array of `Tag` objects. The store SHALL expose `createTag`, `updateTag`, and `deleteTag` actions.

#### Scenario: Create a tag

- **WHEN** calling `createTag({ name, color })` with a valid name and color
- **THEN** a new `Tag` SHALL be appended to the tags array with a generated UUID and `createdAt` timestamp

#### Scenario: Update a tag name or color

- **WHEN** calling `updateTag(id, { name?, color? })` with a valid tag ID
- **THEN** the matching tag SHALL have its `name` and/or `color` updated

#### Scenario: Delete a tag

- **WHEN** calling `deleteTag(id)` with a valid tag ID
- **THEN** the tag SHALL be removed from the tags array
- **THEN** `deleteTag` SHALL dispatch a cleanup action to `useBoxStore` to remove the tag ID from all slot `tagIds` arrays

### Requirement: Tags store persists to IndexedDB

The `useTagsStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"tags"` and schema version `1`.

#### Scenario: Tags survive page reload

- **WHEN** tags are created and the page is reloaded
- **THEN** all tags SHALL be restored from IndexedDB

### Requirement: Predefined color palette

The system SHALL define a constant `TAG_COLOR_PALETTE` in `src/lib/tag-colors.ts` containing at least 12 distinct hex color strings that render legibly in both dark and light themes.

#### Scenario: Palette covers common use cases

- **WHEN** a user creates a tag
- **THEN** they SHALL be able to choose from at least 12 colors via swatches

### Requirement: Tag manager UI

The system SHALL provide a `TagManagerModal` component that allows users to create, rename, recolor, and delete tags.

#### Scenario: Create a new tag

- **WHEN** the user enters a name, selects a color swatch, and confirms
- **THEN** a new tag SHALL appear in the tag list

#### Scenario: Rename a tag

- **WHEN** the user edits the name of an existing tag and confirms
- **THEN** the tag name SHALL be updated everywhere it is displayed

#### Scenario: Change tag color

- **WHEN** the user selects a different color swatch for an existing tag
- **THEN** the tag's color SHALL be updated in all indicators

#### Scenario: Delete a tag

- **WHEN** the user deletes a tag and confirms the destructive action
- **THEN** the tag SHALL be removed and all its assignments SHALL be cleared

#### Scenario: Empty state when no tags exist

- **WHEN** the tag list is empty
- **THEN** the modal SHALL display a prompt to create the first tag
