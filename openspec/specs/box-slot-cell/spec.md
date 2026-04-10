## ADDED Requirements

### Requirement: BoxSlotCell renders visual states
The system SHALL provide a `BoxSlotCell` component at `src/components/boxes/BoxSlotCell.tsx` that renders a single box slot with visual states using CVA variants. The component SHALL accept a `slot` prop of type `BoxSlot | null` and a `state` variant.

#### Scenario: Registered state
- **WHEN** the slot contains a `BoxSlot` with `registered: true`
- **THEN** the Pokémon sprite SHALL be displayed at full opacity
- **THEN** a subtle green checkmark indicator SHALL appear in the corner

#### Scenario: Missing state
- **WHEN** the slot contains a `BoxSlot` with `registered: false`
- **THEN** the Pokémon sprite SHALL be displayed at 30% opacity or as a dark silhouette

#### Scenario: Empty state
- **WHEN** the slot is `null`
- **THEN** a dashed border SHALL be displayed
- **THEN** a "?" icon SHALL be shown in the center

#### Scenario: Hover state
- **WHEN** the user hovers over any non-empty slot
- **THEN** the slot SHALL show slight elevation via a shadow
- **THEN** a tooltip SHALL appear with the Pokémon's name

#### Scenario: Selected state
- **WHEN** the `selected` prop is `true`
- **THEN** the slot border SHALL use the accent color (`--accent`)

### Requirement: BoxSlotCell displays Pokémon sprite
The `BoxSlotCell` SHALL render the Pokémon's sprite image when the slot is occupied.

#### Scenario: Sprite renders for occupied slot
- **WHEN** a `BoxSlot` is provided with a `pokemonId`
- **THEN** a sprite image SHALL be rendered using the Pokémon's sprite URL
- **THEN** the image SHALL use lazy loading via Next.js `Image`

#### Scenario: Sprite placeholder during load
- **WHEN** the sprite image has not yet loaded
- **THEN** an SVG silhouette placeholder SHALL be displayed
- **THEN** the placeholder SHALL be replaced when the image finishes loading

### Requirement: BoxSlotCell is keyboard accessible
The `BoxSlotCell` SHALL be focusable and activatable via keyboard.

#### Scenario: Focus via keyboard navigation
- **WHEN** the user navigates to a slot using Tab
- **THEN** the slot SHALL show a visible focus ring (`--ring` color)

#### Scenario: Activate via keyboard
- **WHEN** the user presses Enter or Space on a focused slot
- **THEN** the `onClick` callback SHALL be triggered

## ADDED Requirements

### Requirement: BoxSlotCell shows sparkle overlay for shiny-registered Pokémon
When Shiny Tracker is enabled, `BoxSlotCell` SHALL accept an `isShinyRegistered?: boolean` prop and render a small ✦ sparkle overlay in the top-right corner of the slot when the value is `true`. The sparkle SHALL be visually distinct from the existing `slot.shiny` shiny-sprite indicator (which is a bottom-right action button).

#### Scenario: Sparkle appears for a shiny-registered Pokémon
- **WHEN** `isShinyRegistered` is `true` and `shinyTrackerEnabled` is `true`
- **THEN** a sparkle icon SHALL be visible in the top-right corner of the slot

#### Scenario: No sparkle when not shiny-registered
- **WHEN** `isShinyRegistered` is `false` or not provided
- **THEN** no sparkle overlay SHALL be rendered

#### Scenario: Sparkle is hidden when shiny tracker is disabled
- **WHEN** `isShinyRegistered` is `true` but the parent does not pass the prop (tracker disabled)
- **THEN** no sparkle SHALL appear (the cell itself does not read the settings store)

### Requirement: BoxSlotCell supports shiny registration toggle in Registration Mode
When Registration Mode is active and `shinyTrackerEnabled` is true, `BoxSlotCell` SHALL accept an optional `onShinyRegistrationToggle?: (e: React.MouseEvent) => void` callback and render a secondary ✦ mini-button for toggling shiny registration. The button SHALL be styled to indicate the current shiny-registration state (active/inactive).

#### Scenario: Shiny registration button visible in Registration Mode with tracker enabled
- **WHEN** `registrationModeActive` is `true` and `isShinyRegistered` prop is provided
- **THEN** a secondary ✦ button SHALL appear alongside the normal registration controls

#### Scenario: Clicking shiny button calls the callback
- **WHEN** the user clicks the ✦ button
- **THEN** `onShinyRegistrationToggle` SHALL be called
- **THEN** event propagation SHALL be stopped so the normal slot click is not also triggered
