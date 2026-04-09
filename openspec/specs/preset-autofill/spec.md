## ADDED Requirements

### Requirement: Preset engine generates Box layout from OrganizationPreset rules
The system SHALL provide a pure function `applyPreset` at `src/lib/preset-engine.ts` that takes an `OrganizationPreset`, the full Pokémon and form data, active `VariationToggles`, and the set of currently registered keys, and returns a fully-populated `Box[]` array ready for `useBoxStore.setBoxes`.

#### Scenario: Rules are applied in order
- **WHEN** `applyPreset` is called with a preset containing multiple rules
- **THEN** rules SHALL be processed in ascending `PresetRule.order`
- **THEN** Pokémon matched by an earlier rule SHALL be excluded from later rules' pools

#### Scenario: Each rule filters the remaining Pokémon pool
- **WHEN** a rule has a `PokemonFilter` with `categories: ['legendary']`
- **THEN** only Pokémon whose category is `'legendary'` SHALL be placed by that rule
- **THEN** those Pokémon SHALL be removed from the pool before the next rule runs

#### Scenario: Pokémon are placed 30 per box
- **WHEN** a rule's filtered and sorted Pokémon pool contains 75 entries
- **THEN** three `Box` objects SHALL be created for that rule (30 + 30 + 15 slots)

#### Scenario: Remaining rule catches unmatched Pokémon
- **WHEN** the last rule has a permissive or empty filter
- **THEN** all Pokémon not matched by prior rules SHALL be placed by the last rule

### Requirement: Preset engine applies variation filters from VariationToggles
The engine SHALL include or exclude form entries based on the provided `VariationToggles`. A form is included only if its corresponding toggle key is `true`.

#### Scenario: Forms for disabled toggles are excluded
- **WHEN** `variations.megaEvolutions` is `false`
- **THEN** no form with `formType: 'mega'` SHALL appear in the generated `Box[]`

#### Scenario: Forms for enabled toggles are included
- **WHEN** `variations.regionalForms` is `true`
- **THEN** forms with `formType` in `['regional-alola', 'regional-galar', 'regional-hisui', 'regional-paldea']` SHALL be included in the pool alongside their base species

### Requirement: Preset engine sets registered flag from pokedex state
Each generated `BoxSlot` SHALL have its `registered` field set to `true` if the slot's composite key (`"{pokemonId}"` or `"{pokemonId}:{formId}"`) exists in the provided `registeredKeys` set, and `false` otherwise.

#### Scenario: Previously registered Pokémon retain registered state after autofill
- **WHEN** `applyPreset` is called and Pokémon #25 is in `registeredKeys`
- **THEN** the generated `BoxSlot` for Pokémon #25 SHALL have `registered: true`

#### Scenario: Unregistered Pokémon have registered false
- **WHEN** `applyPreset` is called and a Pokémon's key is not in `registeredKeys`
- **THEN** its `BoxSlot` SHALL have `registered: false`

### Requirement: Box names are generated from the rule's boxNameTemplate
The engine SHALL apply the box name template for each rule, substituting supported variables: `{n}` (1-based box index within the group), `{start}` (first Pokémon's dex number in the box), `{end}` (last Pokémon's dex number in the box), `{gen}` (generation of the first Pokémon).

#### Scenario: Template {n} produces sequential names
- **WHEN** a rule has `boxNameTemplate: "Gen 1 ({n})"` and generates 3 boxes
- **THEN** the box names SHALL be `"Gen 1 (1)"`, `"Gen 1 (2)"`, `"Gen 1 (3)"`

#### Scenario: Template {start}–{end} produces range names
- **WHEN** a rule has `boxNameTemplate: "{start}–{end}"` and box 1 contains Pokémon #001–#030
- **THEN** the box name SHALL be `"001–030"`

#### Scenario: Missing template falls back to rule order and box number
- **WHEN** a rule has no `boxNameTemplate`
- **THEN** box names SHALL default to `"Box {n}"` (1-based global box number)

### Requirement: Auto-fill button applies preset to box store
The system SHALL provide an "Auto-fill" button in the box view that, when clicked, applies the currently selected preset via `applyPreset` and commits the result to `useBoxStore.setBoxes`.

#### Scenario: Auto-fill with empty boxes proceeds immediately
- **WHEN** the user clicks "Auto-fill" and `useBoxStore.boxes` has no non-null slots
- **THEN** `applyPreset` SHALL be called with the active preset and current store state
- **THEN** `useBoxStore.setBoxes(boxes)` SHALL be called with the result
- **THEN** the box grid SHALL display the newly generated layout

#### Scenario: Auto-fill with existing data shows confirmation dialog
- **WHEN** the user clicks "Auto-fill" and at least one box slot is non-null
- **THEN** an `AlertDialog` SHALL appear warning that the current layout will be replaced
- **THEN** the existing box data SHALL remain unchanged until the user confirms

#### Scenario: User confirms auto-fill
- **WHEN** the user clicks "Confirm" in the auto-fill confirmation dialog
- **THEN** `applyPreset` SHALL be called and `useBoxStore.setBoxes` SHALL be committed
- **THEN** the dialog SHALL be dismissed

#### Scenario: User cancels auto-fill
- **WHEN** the user clicks "Cancel" in the auto-fill confirmation dialog
- **THEN** no changes SHALL be made to `useBoxStore`
- **THEN** the dialog SHALL be dismissed

### Requirement: Auto-fill preset selector lets the user choose which preset to apply
The box view SHALL display the currently active preset name and allow the user to select a different preset before applying auto-fill. The selection SHALL be stored in local component state (not persisted).

#### Scenario: Default preset selection shows first available preset
- **WHEN** the box view mounts and presets exist in `usePresetsStore`
- **THEN** the first preset in the list SHALL be the default selection for auto-fill

#### Scenario: Selecting a different preset updates the pending selection
- **WHEN** the user selects a different preset from the preset selector
- **THEN** the auto-fill button SHALL use that preset when clicked
- **THEN** `usePresetsStore` SHALL NOT be modified (selection is local state)
