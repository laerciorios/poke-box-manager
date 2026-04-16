## ADDED Requirements

### Requirement: PokemonCard displays core Pokemon identity

The system SHALL render a `PokemonCard` component that displays the Pokemon's name (localized), national Dex number, primary and secondary types as colored badges, generation number, and category label (normal / legendary / mythical / baby / ultra-beast / paradox).

#### Scenario: Core identity fields are visible

- **WHEN** `PokemonCard` is opened for a Pokemon
- **THEN** the card SHALL display the localized name, `#<id>` number, type badge(s), generation, and category

#### Scenario: Localized name follows settings locale

- **WHEN** the user's locale is `pt-BR`
- **THEN** the card SHALL display the Pokemon name from the `pt-BR` key of `names`

### Requirement: PokemonCard shows sprite with shiny toggle

The system SHALL display the Pokemon's default sprite by default, with a toggle button that switches to the shiny sprite when one is available.

#### Scenario: Default sprite shown on open

- **WHEN** `PokemonCard` is opened
- **THEN** the default sprite SHALL be displayed

#### Scenario: Shiny toggle switches sprite

- **WHEN** the user activates the shiny toggle
- **THEN** the shiny sprite SHALL replace the default sprite

#### Scenario: Shiny toggle disabled when no shiny sprite

- **WHEN** the Pokemon entry has no `spriteShiny` value
- **THEN** the shiny toggle SHALL be disabled and visually indicated as unavailable

### Requirement: PokemonCard supports form/variation switcher

The system SHALL render a form switcher showing all available forms of the Pokemon. Selecting a form SHALL update the displayed sprite, types, and name to reflect that form.

#### Scenario: Form switcher shows all forms

- **WHEN** a Pokemon has one or more entries in `forms`
- **THEN** the card SHALL render a form list or tab selector with each form's name

#### Scenario: Selecting a form updates sprite and types

- **WHEN** the user selects a form
- **THEN** the card SHALL update the sprite to that form's `sprite`, the types to the form's `types` (falling back to base types if absent), and the name to the form's localized `names`

#### Scenario: No form switcher for single-form Pokemon

- **WHEN** a Pokemon has an empty `forms` array
- **THEN** no form switcher SHALL be rendered

### Requirement: PokemonCard displays evolution chain

The system SHALL show the evolution chain for the Pokemon by looking up its `evolutionChainId` in `evolution-chains.json` and rendering each Pokemon in the chain with its sprite and name. Below the evolution chain display, the card SHALL render an `AcquisitionChecklist` for the currently displayed Pokémon when non-trivial acquisition steps exist.

#### Scenario: Evolution chain rendered in order

- **WHEN** the Pokemon has a non-null `evolutionChainId`
- **THEN** the card SHALL display all Pokemon in the chain in `pokemonIds` order, each with sprite and localized name

#### Scenario: No evolution section for standalone Pokemon

- **WHEN** the Pokemon has no `evolutionChainId`
- **THEN** no evolution chain section SHALL be rendered

#### Scenario: Acquisition checklist shown below evolution chain

- **WHEN** the displayed Pokémon has at least one non-trivial evolution step targeting it
- **THEN** an `AcquisitionChecklist` section SHALL be rendered below the evolution chain

#### Scenario: No acquisition checklist for trivial evolutions

- **WHEN** all steps leading to the displayed Pokémon are trivial (simple level-up)
- **THEN** no checklist section SHALL be rendered in the card

### Requirement: PokemonCard opens as a side sheet

The system SHALL render `PokemonCard` inside a shadcn/ui `Sheet` component (side panel) triggered by caller interaction (click or programmatic open).

#### Scenario: Sheet opens on trigger

- **WHEN** the parent component signals open (e.g., via `isOpen` prop or click on tooltip)
- **THEN** the `Sheet` SHALL slide in from the right and display the card content

#### Scenario: Sheet closes on dismiss

- **WHEN** the user presses Escape or clicks outside the sheet
- **THEN** the `Sheet` SHALL close

### Requirement: PokemonCard accepts pokemonId as primary prop

The system SHALL accept `pokemonId: number` as its primary data prop and resolve all Pokemon data internally from static JSON imports.

#### Scenario: Data resolved from static JSON

- **WHEN** `pokemonId` is provided
- **THEN** the card SHALL look up the entry from `pokemon.json` without any runtime API call

## ADDED Requirements

### Requirement: PokemonCard shows Register Shiny button when tracker is enabled

When `shinyTrackerEnabled` is `true` in `useSettingsStore`, `PokemonCard` SHALL render a "Register Shiny" button that reflects the current shiny-registration state for the displayed Pokémon (and the active form, if one is selected). Clicking the button SHALL call `usePokedexStore.toggleShinyRegistered(pokemonId, formId?)`.

#### Scenario: Register Shiny button is visible when tracker is enabled

- **WHEN** `PokemonCard` is open and `shinyTrackerEnabled` is `true`
- **THEN** a "Register Shiny" (or "Registered Shiny ✓") button SHALL be visible below the shiny sprite toggle

#### Scenario: Register Shiny button is hidden when tracker is disabled

- **WHEN** `PokemonCard` is open and `shinyTrackerEnabled` is `false`
- **THEN** no shiny registration button SHALL be rendered

#### Scenario: Button reflects current shiny-registration state

- **WHEN** the Pokémon is already shiny-registered
- **THEN** the button SHALL display in an "active" or "registered" visual state (e.g., filled variant)
- **WHEN** the Pokémon is not shiny-registered
- **THEN** the button SHALL display in an "inactive" or "outline" visual state

#### Scenario: Clicking the button toggles shiny registration

- **WHEN** the user clicks the "Register Shiny" button for an unregistered-shiny Pokémon
- **THEN** `toggleShinyRegistered(pokemonId)` SHALL be called (using active form's formId if a form is selected)
- **THEN** the button state SHALL update to reflect the new shiny-registration status

#### Scenario: Shiny registration uses the active form's key

- **WHEN** the user has selected an alternate form in the form switcher and clicks "Register Shiny"
- **THEN** `toggleShinyRegistered(pokemonId, activeFormId)` SHALL be called with the form's id

## ADDED Requirements

### Requirement: PokemonCard displays and edits the slot note when opened from a box slot

When `PokemonCard` is opened with a `boxId` and `slotIndex` context, it SHALL render a note section containing a textarea pre-filled with `slot.note`. Changes are saved to `useBoxStore` via `setSlotNote` on textarea blur. When opened without slot context (e.g., from the Pokédex page), no note section is rendered.

#### Scenario: Note section visible when opened from a box slot

- **WHEN** `PokemonCard` is opened with valid `boxId` and `slotIndex` props
- **THEN** a note textarea SHALL be rendered in the card content

#### Scenario: Textarea pre-filled with existing note

- **WHEN** `PokemonCard` opens for a slot whose `note` is `"Pending trade with @friend"`
- **THEN** the textarea SHALL display `"Pending trade with @friend"`

#### Scenario: Textarea shows placeholder when no note exists

- **WHEN** `PokemonCard` opens for a slot with no note
- **THEN** the textarea SHALL be empty with a localized placeholder text (e.g., "Add a note..." / "Adicionar uma nota...")

#### Scenario: Blur saves changed note

- **WHEN** the user edits the textarea and moves focus away from it
- **THEN** `setSlotNote(boxId, slotIndex, newValue)` SHALL be called with the current textarea value
- **THEN** the slot's note in the store SHALL reflect the new value

#### Scenario: Blur with empty textarea clears the note

- **WHEN** the user clears the textarea and moves focus away
- **THEN** `setSlotNote(boxId, slotIndex, "")` SHALL be called
- **THEN** `BoxSlot.note` SHALL become `undefined`

#### Scenario: Textarea enforces 500-character limit

- **WHEN** the note textarea is rendered
- **THEN** it SHALL have `maxLength={500}` to prevent input beyond the cap

#### Scenario: Note section absent when no slot context

- **WHEN** `PokemonCard` is opened without `boxId` or `slotIndex` props
- **THEN** no note textarea or note section SHALL be rendered
