## 1. Install and Configure next-intl

- [ ] 1.1 Run `npm install next-intl` and verify it appears in `package.json`
- [ ] 1.2 Create `src/i18n/routing.ts` exporting `routing` with `locales: ['pt-BR', 'en']` and `defaultLocale: 'pt-BR'`
- [ ] 1.3 Create `src/i18n/navigation.ts` exporting typed `Link`, `useRouter`, `usePathname`, `redirect`, and `permanentRedirect` via `createNavigation(routing)`
- [ ] 1.4 Create `src/i18n/request.ts` with `getRequestConfig` that loads `i18n/messages/{locale}.json` per request
- [ ] 1.5 Create `src/middleware.ts` using `createMiddleware(routing)` with `localeDetection: true`
- [ ] 1.6 Update `next.config.ts` to wrap the config with `createNextIntlPlugin('./src/i18n/request.ts')`

## 2. Route Restructure — `[locale]` Segment

- [ ] 2.1 Create `src/app/[locale]/layout.tsx` with `NextIntlClientProvider` wrapping children; set `<html lang={locale}>` using locale from params
- [ ] 2.2 Strip locale-specific markup from `src/app/layout.tsx` (keep only root HTML shell: `<html>`, `<body>`, font variables)
- [ ] 2.3 Move `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- [ ] 2.4 Move `src/app/boxes/` → `src/app/[locale]/boxes/`
- [ ] 2.5 Move `src/app/presets/` → `src/app/[locale]/presets/`
- [ ] 2.6 Move `src/app/settings/` → `src/app/[locale]/settings/`
- [ ] 2.7 Move `src/app/pokedex/` → `src/app/[locale]/pokedex/`
- [ ] 2.8 Move `src/app/missing/` → `src/app/[locale]/missing/`
- [ ] 2.9 Move `src/app/stats/` → `src/app/[locale]/stats/`
- [ ] 2.10 Update all `<Link href="...">` references in `Sidebar.tsx` and other nav components to use the typed `Link` from `@/i18n/navigation`

## 3. Translation Message Files

- [ ] 3.1 Create `i18n/messages/en.json` with all UI string keys (Common, Layout, Boxes, Settings, Presets, VariationToggles, FloatingBar namespaces)
- [ ] 3.2 Create `i18n/messages/pt-BR.json` with Portuguese translations for all keys in `en.json` (identical key structure)
- [ ] 3.3 Verify key sets are identical between the two files (no missing keys)

## 4. Wire `useTranslations` into Components

- [ ] 4.1 Update layout components (`Sidebar`, `Header`, `AppShell`) to use `useTranslations('Layout')` for nav labels and static text
- [ ] 4.2 Update `src/components/boxes/RegistrationModeToggle.tsx` to use `useTranslations('Boxes')` for "Registration Mode" label (resolves `pokemon-registration` task 2.2)
- [ ] 4.3 Update `src/components/boxes/FloatingActionBar.tsx` to use `useTranslations('FloatingBar')` for "Mark as registered", "Unmark", "N selected" (resolves `pokemon-registration` task 3.4)
- [ ] 4.4 Update `src/components/boxes/AutoFillButton.tsx` to use `useTranslations('Boxes')` for "Auto-fill", confirmation dialog text (resolves `pokemon-registration` task 6.4)
- [ ] 4.5 Update `src/components/settings/VariationTogglesPanel.tsx` and `VariationToggleItem.tsx` to use `useTranslations('VariationToggles')` for all toggle labels and subtitles (resolves `variation-toggles` tasks 4.1–4.3)
- [ ] 4.6 Update `src/components/presets/PresetList.tsx`, `PresetEditor.tsx`, and `RuleRow.tsx` to use `useTranslations('Presets')` for all labels
- [ ] 4.7 Update all empty state messages, button labels, and page headings in `src/app/[locale]/` pages

## 5. LanguageSwitch — next-intl Integration

- [ ] 5.1 Rewrite `src/components/layout/LanguageSwitch.tsx` to use `useLocale()` from `next-intl` and `useRouter()` from `@/i18n/navigation` — remove the `localStorage` implementation
- [ ] 5.2 Verify the toggle navigates to `/{new-locale}/{current-path}` and the button label updates

## 6. Pokémon Name Locale Files

- [ ] 6.1 Add a step in `src/scripts/fetch-pokemon-data.ts` (or a separate `generate-name-locales.ts` script) that reads `src/data/pokemon.json` and outputs `i18n/pokemon-names/pt-BR.json` and `i18n/pokemon-names/en.json` as flat `{ "id": "name" }` maps
- [ ] 6.2 Do the same for form names from `src/data/forms.json` → append form entries to each locale file as `{ "formId": "name" }`
- [ ] 6.3 Create `src/lib/pokemon-names.ts` exporting `getPokemonName(entry: PokemonEntry, locale: Locale): string` and `getFormName(form: PokemonForm, locale: Locale): string` helpers
- [ ] 6.4 Update `src/app/[locale]/boxes/page.tsx` to pass locale-resolved names via `getPokemonName`/`getFormName` instead of raw `pokemon.name`
- [ ] 6.5 Update `npm run fetch-data` (or add `npm run generate-locales`) in `package.json` to include the name-locale generation step

## 7. Verification

- [ ] 7.1 Run `npm run dev`, open `/pt-BR/boxes` — confirm PT-BR UI strings render
- [ ] 7.2 Click LanguageSwitch — confirm URL changes to `/en/boxes` and EN strings render
- [ ] 7.3 Navigate to `/boxes` (no locale prefix) — confirm redirect to `/pt-BR/boxes`
- [ ] 7.4 Run `npm run build` — confirm no missing translation key errors
- [ ] 7.5 Confirm all pending i18n tasks in `variation-toggles` and `pokemon-registration` changes are now resolvable — mark them as done if so
