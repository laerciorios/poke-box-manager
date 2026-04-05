## ADDED Requirements

### Requirement: SpritePlaceholder renders an SVG silhouette
The system SHALL provide a `SpritePlaceholder` component at `src/components/pokemon/SpritePlaceholder.tsx` that renders a generic Pokéball-style SVG silhouette. The placeholder SHALL be used as a loading state while Pokémon sprite images are being fetched.

#### Scenario: Render placeholder at specified size
- **WHEN** `SpritePlaceholder` receives a `size` prop (number in pixels)
- **THEN** the SVG SHALL render at the specified width and height
- **THEN** the silhouette SHALL use muted colors from the design system (`--muted`)

#### Scenario: Placeholder is accessible
- **WHEN** the placeholder is rendered
- **THEN** the SVG SHALL have `aria-hidden="true"` since it is decorative

### Requirement: Sprite lazy loading with placeholder transition
Pokémon sprites in `BoxSlotCell` SHALL lazy-load with a smooth transition from placeholder to actual sprite.

#### Scenario: Placeholder shown before sprite loads
- **WHEN** a `BoxSlotCell` renders with a Pokémon that has a sprite URL
- **THEN** the `SpritePlaceholder` SHALL be visible initially
- **THEN** the actual sprite image SHALL use `loading="lazy"` via Next.js `Image`

#### Scenario: Smooth transition when sprite loads
- **WHEN** the sprite image finishes loading (fires `onLoad`)
- **THEN** the sprite SHALL fade in using a CSS transition (`--transition-fast`, 150ms)
- **THEN** the placeholder SHALL be hidden

#### Scenario: Fallback when sprite fails to load
- **WHEN** the sprite image fails to load (fires `onError`)
- **THEN** the `SpritePlaceholder` SHALL remain visible
- **THEN** no broken image icon SHALL be displayed
