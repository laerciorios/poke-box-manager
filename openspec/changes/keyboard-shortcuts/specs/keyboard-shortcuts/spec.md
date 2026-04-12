## ADDED Requirements

### Requirement: KeyboardShortcutProvider owns the global keydown listener
The system SHALL provide a `KeyboardShortcutProvider` React context component that attaches a single `window keydown` listener. All global keyboard shortcuts SHALL be dispatched through this provider. The provider SHALL be rendered inside `Providers` so it wraps the entire application.

#### Scenario: Provider mounts and registers listener
- **WHEN** the application loads and `KeyboardShortcutProvider` mounts
- **THEN** exactly one `keydown` listener SHALL be attached to `window`

#### Scenario: Provider unmounts and removes listener
- **WHEN** `KeyboardShortcutProvider` unmounts
- **THEN** the `keydown` listener SHALL be removed from `window`

### Requirement: Input guard suppresses shortcuts when typing
The `KeyboardShortcutProvider` SHALL NOT dispatch any shortcut action when the event target is an `<input>`, `<textarea>`, `<select>`, `[contenteditable]`, or any element with a `data-no-shortcuts` attribute.

#### Scenario: Shortcut suppressed inside text input
- **WHEN** an `<input>` has focus and the user presses a shortcut key (e.g., `/`)
- **THEN** the shortcut action SHALL NOT be triggered
- **THEN** the key SHALL produce its default browser behavior (e.g., typing the character)

#### Scenario: Shortcut active when no input is focused
- **WHEN** no input element has focus and the user presses a shortcut key
- **THEN** the corresponding shortcut action SHALL be triggered

### Requirement: "/" shortcut focuses the global search bar
Pressing `/` when no input is focused SHALL focus the global search bar and prevent the browser default (find-in-page or character input).

#### Scenario: "/" focuses search input
- **WHEN** no input is focused and the user presses `/`
- **THEN** the global search bar input SHALL receive focus
- **THEN** `e.preventDefault()` SHALL be called to suppress browser find-in-page

#### Scenario: "/" does nothing when search bar already focused
- **WHEN** the search bar is already focused and the user presses `/`
- **THEN** no additional action SHALL occur (the `/` character SHALL be typed normally)

### Requirement: "Escape" closes the topmost open modal, sheet, or panel
The system SHALL maintain a LIFO stack of close callbacks (`ModalStack`). Each Dialog and Sheet SHALL push its close handler when it opens and pop it when it closes. Pressing `Escape` when at least one entry is in the stack SHALL call the topmost close callback.

#### Scenario: Escape closes topmost modal
- **WHEN** a Dialog is open and the user presses `Escape` with focus outside the dialog
- **THEN** the dialog's close callback SHALL be called
- **THEN** the dialog SHALL close

#### Scenario: Escape closes topmost sheet when multiple are open
- **WHEN** two modals are open (A opened, then B opened) and the user presses `Escape`
- **THEN** modal B (most recently opened) SHALL close
- **THEN** modal A SHALL remain open

#### Scenario: Escape is no-op when modal stack is empty
- **WHEN** no modal or sheet is open and the user presses `Escape`
- **THEN** no action SHALL occur

### Requirement: "?" opens the shortcut help overlay
Pressing `?` (Shift+/) when no input is focused SHALL open the `ShortcutHelpOverlay` dialog listing all available shortcuts.

#### Scenario: "?" opens help overlay
- **WHEN** no input is focused and the user presses `?`
- **THEN** the `ShortcutHelpOverlay` dialog SHALL open

#### Scenario: Escape or click-outside closes help overlay
- **WHEN** the `ShortcutHelpOverlay` is open and the user presses `Escape` or clicks outside
- **THEN** the overlay SHALL close

### Requirement: ShortcutHelpOverlay lists all shortcuts with i18n labels
The `ShortcutHelpOverlay` SHALL render a table or list of all registered shortcuts. Each row SHALL display the key combination and a translated description. Labels SHALL be sourced from the `ui` translation namespace and available in both PT-BR and EN.

#### Scenario: Overlay renders all shortcuts
- **WHEN** the `ShortcutHelpOverlay` is open
- **THEN** the following shortcuts SHALL be listed: `↑ ↓ ← →` (navigate slots), `Enter` (toggle registration), `/` (focus search), `Escape` (close panel), `?` (show help)

#### Scenario: Labels render in current locale
- **WHEN** the app locale is `pt-BR` and the overlay is open
- **THEN** shortcut descriptions SHALL be displayed in Portuguese
- **WHEN** the app locale is `en` and the overlay is open
- **THEN** shortcut descriptions SHALL be displayed in English
