## ADDED Requirements

### Requirement: All UI strings use translation keys
The system SHALL have zero hardcoded UI strings in component files. All user-visible text SHALL be loaded via `useTranslations` (client components) or `getTranslations` (server components) from `next-intl`.

#### Scenario: String rendered in PT-BR
- **WHEN** the active locale is `pt-BR`
- **THEN** all UI labels, buttons, placeholders, and messages SHALL render in Portuguese

#### Scenario: String rendered in EN
- **WHEN** the active locale is `en`
- **THEN** all UI labels, buttons, placeholders, and messages SHALL render in English

### Requirement: Translation files are complete for both locales
The system SHALL maintain `i18n/messages/pt-BR.json` and `i18n/messages/en.json` with identical key sets. Missing keys SHALL be caught at build time.

#### Scenario: Missing key fallback
- **WHEN** a translation key is missing from the active locale's message file
- **THEN** next-intl SHALL warn in development and fall back to the key name rather than crashing

### Requirement: Translation namespaces match feature areas
The system SHALL organize translation keys into namespaces corresponding to feature areas (e.g., `Boxes`, `Settings`, `Presets`, `Common`, `Layout`). Components SHALL load only their relevant namespace.

#### Scenario: Component loads its namespace
- **WHEN** a component in the Boxes feature calls `useTranslations('Boxes')`
- **THEN** it SHALL only load keys scoped to the `Boxes` namespace
