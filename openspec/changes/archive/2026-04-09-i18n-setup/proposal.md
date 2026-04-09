## Why

The app's UI strings are hardcoded in English, there is no locale routing, and the `language-switch` spec defines a LanguageSwitch component that currently has no infrastructure to back it. This change installs and wires up `next-intl` end-to-end so that PT-BR and EN are fully supported from day one (spec section 7).

## What Changes

- **New**: Install `next-intl` and configure Next.js middleware for locale-based routing (`/pt-BR/boxes`, `/en/boxes`)
- **New**: Introduce `[locale]` route segment — all pages move from `src/app/<page>/` to `src/app/[locale]/<page>/`
- **New**: Create `i18n/messages/pt-BR.json` and `i18n/messages/en.json` with all UI strings
- **New**: Generate `i18n/pokemon-names/pt-BR.json` and `i18n/pokemon-names/en.json` from PokéAPI data already in `src/data/pokemon.json` (each entry already has `names: Record<Locale, string>`)
- **New**: Language selector in the header (implements `language-switch` spec)
- **Modified**: All hardcoded UI strings across existing components replaced with `useTranslations` calls
- **Modified**: Automatic browser language detection via `next-intl` middleware with fallback to PT-BR

## Capabilities

### New Capabilities

- `i18n-routing`: Locale-based routing via `next-intl` middleware — URL prefix (`/pt-BR`, `/en`), automatic browser detection, redirect from `/` to detected locale, `next.config` integration
- `ui-translations`: All UI strings extracted to `i18n/messages/pt-BR.json` and `en.json`; components use `useTranslations` hook from `next-intl`
- `pokemon-name-locale`: Pokémon names and form names served from `i18n/pokemon-names/` locale files, generated from existing `src/data/` static JSON at build time

### Modified Capabilities

- `language-switch`: Existing spec defines the component and toggle behavior; this change implements it using `next-intl`'s `useRouter` + `useLocale` instead of a settings-store locale field

## Impact

- `package.json` — adds `next-intl` dependency
- `next.config.ts` — adds `createNextIntlPlugin` wrapper
- `src/middleware.ts` — new file; handles locale detection and routing
- `src/i18n/` — `routing.ts`, `navigation.ts`, `request.ts` configuration files
- `src/app/layout.tsx` + `src/app/[locale]/layout.tsx` — restructured for locale routing
- `src/app/[locale]/<page>/` — all pages move into `[locale]` segment
- All UI components with hardcoded strings — `useTranslations` calls added
- `src/scripts/fetch-pokemon-data.ts` — extend or add a step to generate locale name files from `PokemonEntry.names` and `PokemonForm.names`
- `src/components/layout/LanguageSwitch.tsx` — implements existing spec
