import type { Locale } from '../../types/locale'

const POKEAPI_LOCALE_MAP: Record<Locale, string> = {
  'pt-BR': 'pt-BR',
  en: 'en',
}

// Fallback chain: try exact match, then language prefix, then 'en'
function findName(
  names: Array<{ language: { name: string }; name: string }>,
  pokeapiLocale: string,
): string | undefined {
  const exact = names.find((n) => n.language.name === pokeapiLocale)
  if (exact) return exact.name

  // Try language prefix (e.g. 'pt' for 'pt-BR')
  const prefix = pokeapiLocale.split('-')[0]
  const prefixMatch = names.find((n) => n.language.name === prefix)
  if (prefixMatch) return prefixMatch.name

  return undefined
}

export function extractNames(
  names: Array<{ language: { name: string }; name: string }>,
  entityName: string,
): Record<Locale, string> {
  const enName = findName(names, POKEAPI_LOCALE_MAP.en) ?? entityName
  const ptBrName = findName(names, POKEAPI_LOCALE_MAP['pt-BR'])

  if (!ptBrName) {
    console.warn(`  ⚠ Missing PT-BR name for "${entityName}", using EN fallback`)
  }

  return {
    en: enName,
    'pt-BR': ptBrName ?? enName,
  }
}
