## Why

The app currently lacks systematic accessibility support, making it unusable for keyboard-only users and those relying on screen readers. Spec section 5.4 defines accessibility as a first-class requirement (full keyboard nav, ARIA labels, WCAG AA contrast, `prefers-reduced-motion`), and this pass delivers on that contract before the project reaches a wider audience.

## What Changes

- Add full keyboard navigation to box grid slots (arrow keys, Enter/Space to select, Tab to move between regions)
- Add keyboard navigation and focus management to the box list/switcher and main sidebar nav
- Add ARIA roles, labels, and `aria-live` regions to all interactive elements: slot cells, box headers, registration toggles, drag handles
- Add screen reader announcements for drag-and-drop operations (pick up, move, drop, cancel)
- Add screen reader announcements when a Pokémon is registered/unregistered
- Verify and fix WCAG AA contrast ratios across all light and dark theme tokens
- Implement `prefers-reduced-motion` suppression for CSS transitions and DnD animations
- Add focus trap and restore logic in Sheet/dialog components (box editor, preset editor, settings)
- Ensure all touch targets meet the 44×44px minimum (mobile)

## Capabilities

### New Capabilities

- `keyboard-navigation`: Full keyboard control of box grid, slot cells, and box switcher — arrow-key traversal, Enter/Space actions, Escape to cancel
- `aria-annotations`: ARIA roles, labels, descriptions, and `aria-live` regions across all interactive UI surfaces
- `focus-management`: Focus trap in Sheet/modal components, focus restore on close, roving tabindex patterns
- `reduced-motion`: `prefers-reduced-motion` media query integration for transitions and DnD animations
- `wcag-contrast`: Audit and remediation of light/dark theme color tokens against WCAG AA (4.5:1 text, 3:1 UI)

### Modified Capabilities

- `box-drag-drop`: Screen reader announcements during drag lifecycle (pick up, position update, drop, cancel); motion suppression when reduced-motion is on
- `registration-mode`: `aria-live` announcement when registration state changes (registered / unregistered)
- `box-slot-cell`: Keyboard-accessible slot interaction, ARIA role and label per slot
- `box-grid`: Roving tabindex grid navigation pattern (arrow keys within the 6×5 grid)

## Impact

- **Components**: `BoxGrid`, `BoxSlotCell`, `BoxNavigation`, `Sidebar`, `Sheet`-based modals (BoxMetadataEdit, PresetEditor, Settings), registration overlay
- **DnD**: `@dnd-kit` keyboard sensor configuration, announcements string map
- **Styles**: Tailwind / CSS custom properties for `motion-safe`/`motion-reduce` variants and theme contrast tokens
- **No new dependencies** — `@dnd-kit` already ships a keyboard sensor and accessibility announcements API
