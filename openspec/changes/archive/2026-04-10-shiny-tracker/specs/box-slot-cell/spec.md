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
