## ADDED Requirements

### Requirement: SearchBar exposes imperative focus handle
The `SearchBar` component SHALL expose its internal input ref via a React context value (`SearchBarContext`) so that the `KeyboardShortcutProvider` can programmatically focus it in response to the `/` shortcut. The `SearchBar` SHALL NOT attach its own `window keydown` listener for the `/` shortcut; that responsibility moves to the central provider.

#### Scenario: SearchBar focus is triggered via context ref
- **WHEN** `SearchBarContext.inputRef.current?.focus()` is called
- **THEN** the search input SHALL receive focus

#### Scenario: Cmd/Ctrl+K still focuses the search input
- **WHEN** the user presses Cmd+K (macOS) or Ctrl+K (Windows/Linux)
- **THEN** the search input SHALL receive focus (handled by the central provider)
- **THEN** the browser default for that key combination SHALL be prevented

## MODIFIED Requirements

### Requirement: Keyboard shortcut to focus search
The SearchBar SHALL be focusable via the Cmd+K (macOS) or Ctrl+K (Windows/Linux) keyboard shortcut AND via the `/` key. Both shortcuts SHALL be handled by the central `KeyboardShortcutProvider`, not by a local listener in `SearchBar`.

#### Scenario: Cmd/Ctrl+K focuses the search input
- **WHEN** the user presses Cmd+K (macOS) or Ctrl+K (Windows/Linux) from anywhere in the app
- **THEN** the search input SHALL receive focus
- **THEN** the browser's default action for that shortcut SHALL be prevented

#### Scenario: "/" focuses the search input
- **WHEN** no input is focused and the user presses `/`
- **THEN** the search input SHALL receive focus
- **THEN** the browser's default find-in-page action SHALL be prevented

#### Scenario: Shortcut hint displayed in input
- **WHEN** the SearchBar is rendered and not focused
- **THEN** a visual hint showing "⌘K" (macOS) or "Ctrl+K" SHALL be displayed inside or beside the input
