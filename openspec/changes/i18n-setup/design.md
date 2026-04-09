## Context

The app ships with hardcoded English strings, a `LanguageSwitch` component that only persists locale to `localStorage` (no routing effect), and an empty `src/i18n/messages/` directory. `next-intl` is listed as a planned dependency but is not yet installed. The `Locale` type, `LOCALES` constant, and `DEFAULT_LOCALE = 'pt-BR'` already exist in `src/types/locale.ts`. All Pokémon entries and forms in static JSON already carry `names: Record<Locale, string>`.

## Goals / Non-Goals

**Goals:**
- Install `next-intl` and configure App Router locale routing (`/pt-BR/...`, `/en/...`)
- Automatic browser language detection with PT-BR fallback
- All UI strings extracted to `i18n/messages/{locale}.json` and accessed via `useTranslations`
- Typed navigation utilities via `next-intl` (`Link`, `useRouter`, `usePathname`, `redirect`)
- `LanguageSwitch` wired to next-intl router (replaces the localStorage-only implementation)
- `i18n/pokemon-names/{locale}.json` generated as flat `{ id: name }` maps from existing `src/data/`

**Non-Goals:**
- Languages beyond PT-BR and EN (architecture is modular for future additions)
- Removing `locale` from `useSettingsStore` (kept for backwards compat; routing locale is the source of truth)
- Translating Pokémon ability/move descriptions
- ICU message format or pluralization (simple key → string for now)

## Decisions

### 1. Route structure: `src/app/[locale]/` segment

**Decision**: All page routes move under `src/app/[locale]/`:

```
src/app/
  layout.tsx          # root — minimal HTML shell, no locale-specific code
  [locale]/
    layout.tsx        # NextIntlClientProvider + lang attribute
    page.tsx
    boxes/page.tsx
    presets/page.tsx
    settings/page.tsx
    pokedex/page.tsx
    missing/page.tsx
    stats/page.tsx
```

`src/middleware.ts` handles locale detection and redirects:
- `/` → `/{detected-locale}/`
- `/boxes` → `/{detected-locale}/boxes`
- Known locale prefix → pass through

**Rationale**: This is the standard next-intl App Router integration. It keeps locale in the URL (shareable, crawlable) and avoids cookie-based hacks.

**Alternative considered**: Cookie-based locale without URL prefix. Rejected — spec explicitly requires `/pt-BR/boxes` URL format.

### 2. Navigation: `src/i18n/navigation.ts` typed exports

**Decision**: Export typed `Link`, `useRouter`, `usePathname`, `redirect`, and `permanentRedirect` from `src/i18n/navigation.ts` using `createNavigation(routing)`. All app code imports navigation from `@/i18n/navigation`, never from `next/navigation`.

```ts
// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation'
import routing from './routing'

export const { Link, useRouter, usePathname, redirect, permanentRedirect } =
  createNavigation(routing)
```

**Rationale**: Typed navigation prevents locale-stripping bugs and is the idiomatic next-intl pattern.

### 3. LanguageSwitch: URL-based locale change

**Decision**: Replace the `localStorage`-only `LanguageSwitch` with a version that uses `useRouter().replace(pathname, { locale: next })` from `@/i18n/navigation`. The component still shows "PT" / "EN" as currently specced.

**Rationale**: Locale is now in the URL. Updating just `localStorage` would leave a stale URL with the old locale prefix.

### 4. Pokémon names: data lookup, not translations

**Decision**: Pokémon and form names are NOT loaded through `next-intl`. Instead:
- `i18n/pokemon-names/` files are generated at build time by extending the data pipeline script
- At runtime, components use `PokemonEntry.names[locale]` directly from the static JSON (which is already imported module-level in several places)
- A `src/lib/pokemon-names.ts` utility exposes `getPokemonName(entry, locale)` and `getFormName(form, locale)` helpers

**Rationale**: Names are data, not UI copy. Loading ~3,000 name strings through next-intl's translation system would conflate two distinct concerns. The files in `i18n/pokemon-names/` satisfy the spec's structural requirement without routing them through `useTranslations`.

### 5. String extraction scope

**Decision**: Extract strings from all currently-implemented UI — settings panel, preset editor/list, registration mode UI, box view controls, layout chrome (header, sidebar), empty states. The i18n tasks for `variation-toggles` and `pokemon-registration` changes (currently marked pending due to missing next-intl) will be resolved by this change.

**Key namespaces**:
```
messages/{locale}.json
├── Common          # Save, Cancel, Delete, Confirm…
├── Layout          # nav labels, header title
├── Boxes           # "New Box", "Registration Mode", "Auto-fill"…
├── Settings        # variation names, subtitles, footer
├── Presets         # preset editor labels, rule row
├── VariationToggles # toggle labels and subtitles
└── FloatingBar     # "Mark as registered", "Unmark", "N selected"
```

### 6. `request.ts`: server-side message loading

**Decision**: Use `getRequestConfig` to load messages on the server per request:
```ts
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import routing from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  const validLocale = routing.locales.includes(locale as never)
    ? locale
    : routing.defaultLocale
  return {
    locale: validLocale,
    messages: (await import(`../../i18n/messages/${validLocale}.json`)).default,
  }
})
```

**Rationale**: Standard next-intl server configuration. Dynamic `import()` allows code-splitting per locale.

## Risks / Trade-offs

- **All pages move** → Any active change or branch that has page-level files in `src/app/<page>/` will have merge conflicts. Mitigation: implement this change before adding more pages; merge active branches first.
- **`useSettingsStore.locale` vs URL locale** → Two sources of locale truth exist during the transition. Mitigation: document that `useSettingsStore.locale` is deprecated; reading components should use `useLocale()` from next-intl. The store field can be removed in a later cleanup change.
- **Server components can't use `useTranslations`** → `useTranslations` is client-only. Server components use `getTranslations()`. Most current pages are already `'use client'`, so this is low risk but must be kept in mind. Mitigation: the `[locale]/layout.tsx` uses `getTranslations` for static metadata.
- **Large message files** → All UI strings in two JSON files. Not a real issue at this app's scale but worth noting for future splitting.

## Migration Plan

1. `npm install next-intl` 
2. Add `src/middleware.ts` + `src/i18n/routing.ts` + `src/i18n/navigation.ts` + `src/i18n/request.ts`
3. Update `next.config.ts` with `createNextIntlPlugin`
4. Create `src/app/[locale]/layout.tsx` with `NextIntlClientProvider`
5. Move page files (`boxes/`, `presets/`, `settings/`, etc.) into `src/app/[locale]/`
6. Create `i18n/messages/en.json` and `pt-BR.json` with all strings
7. Update all components to use `useTranslations`
8. Update `LanguageSwitch` to use `@/i18n/navigation`
9. Extend data pipeline to generate `i18n/pokemon-names/` files
10. Verify both locales via dev server

No data migration needed. IndexedDB stores are not locale-sensitive.

## Open Questions

- Should `useSettingsStore.locale` be removed in this change or deferred to a cleanup change? (Lean: defer, keep it as a no-op for now)
- Should the root `/` redirect or render a locale-detection landing? (Lean: redirect to `/{detected-locale}` via middleware, no landing page)
