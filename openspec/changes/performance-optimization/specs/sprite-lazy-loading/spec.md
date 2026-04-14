## ADDED Requirements

### Requirement: BoxGrid defers sprite loading until the box enters the viewport
`BoxGrid` SHALL mount a single `IntersectionObserver` on its container element. Sprites inside the box SHALL NOT load (i.e., no `<img>` or `<source>` src shall be set) until the `IntersectionObserver` fires with `isIntersecting: true`. Once visible, the observer SHALL disconnect to avoid repeated callbacks.

#### Scenario: Box outside viewport shows placeholders only
- **WHEN** a `BoxGrid` is rendered but is scrolled outside the viewport
- **THEN** all 30 slots SHALL render the `SpritePlaceholder` SVG
- **THEN** no sprite network requests SHALL be made for that box

#### Scenario: Box enters viewport and sprites begin loading
- **WHEN** the user scrolls and a `BoxGrid` enters the viewport (IntersectionObserver fires)
- **THEN** the `visible` flag SHALL be set to `true`
- **THEN** `BoxSlotCell` children SHALL render their `<picture>/<img>` elements, initiating sprite loads
- **THEN** the IntersectionObserver SHALL disconnect after the first intersection

#### Scenario: Observer disconnects after first intersection
- **WHEN** a `BoxGrid` has entered the viewport once
- **THEN** the `IntersectionObserver` SHALL be disconnected
- **THEN** scrolling the box out of and back into view SHALL NOT re-trigger loading (sprites are already loaded)

### Requirement: Placeholder slot dimensions are fixed to prevent CLS
The `BoxSlotCell` container SHALL have fixed CSS dimensions regardless of whether the sprite has loaded, so that the layout does not shift when sprites appear. The placeholder SHALL fill the same space as the loaded sprite.

#### Scenario: Layout does not shift when sprite loads
- **WHEN** a sprite transitions from placeholder to loaded state in a `BoxSlotCell`
- **THEN** the surrounding layout SHALL not shift (Cumulative Layout Shift contribution = 0)

#### Scenario: Placeholder fills the slot exactly
- **WHEN** the `SpritePlaceholder` is rendered inside a slot
- **THEN** it SHALL have the same width and height as the sprite it will replace
