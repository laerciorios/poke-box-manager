## ADDED Requirements

### Requirement: Locale-prefixed URL routing
The system SHALL route all pages under a locale URL prefix (`/pt-BR/...` or `/en/...`). Navigating to a path without a locale prefix (e.g., `/boxes`) SHALL redirect to the same path under the detected locale.

#### Scenario: Accessing a page with locale prefix
- **WHEN** the user navigates to `/pt-BR/boxes`
- **THEN** the boxes page SHALL render in PT-BR

#### Scenario: Accessing a page without locale prefix
- **WHEN** the user navigates to `/boxes`
- **THEN** the system SHALL redirect to `/{detected-locale}/boxes`

#### Scenario: Root redirect
- **WHEN** the user navigates to `/`
- **THEN** the system SHALL redirect to `/{detected-locale}/`

### Requirement: Automatic browser language detection
The system SHALL detect the user's preferred locale from the `Accept-Language` HTTP header and redirect to the matching locale prefix. If the detected language is not in the supported list, the system SHALL fall back to PT-BR.

#### Scenario: Browser language matches a supported locale
- **WHEN** the user's browser sends `Accept-Language: en`
- **AND** the user navigates to `/`
- **THEN** the system SHALL redirect to `/en/`

#### Scenario: Browser language is unsupported
- **WHEN** the user's browser sends `Accept-Language: ja`
- **AND** the user navigates to `/`
- **THEN** the system SHALL redirect to `/pt-BR/` (default locale)

### Requirement: Locale is preserved across navigation
The system SHALL maintain the active locale prefix when navigating between pages within the app.

#### Scenario: In-app navigation preserves locale
- **WHEN** the user is on `/en/boxes`
- **AND** clicks the "Presets" link in the sidebar
- **THEN** the URL SHALL change to `/en/presets`
- **THEN** the UI SHALL remain in EN
