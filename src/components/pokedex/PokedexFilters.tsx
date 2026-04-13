'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import type { PokemonCategory } from '@/types/pokemon'

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

const CATEGORIES: Array<PokemonCategory | 'all'> = [
  'all', 'normal', 'legendary', 'mythical', 'baby', 'ultra-beast', 'paradox',
]

export function PokedexFilters() {
  const t = useTranslations('Pokedex')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentGen = searchParams.get('gen') ?? ''
  const currentType = searchParams.get('type') ?? ''
  const currentCat = (searchParams.get('cat') ?? 'all') as PokemonCategory | 'all'

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  function getCategoryLabel(cat: PokemonCategory | 'all'): string {
    switch (cat) {
      case 'all': return t('allCategories')
      case 'normal': return t('categoryNormal')
      case 'legendary': return t('categoryLegendary')
      case 'mythical': return t('categoryMythical')
      case 'baby': return t('categoryBaby')
      case 'ultra-beast': return t('categoryUltraBeast')
      case 'paradox': return t('categoryParadox')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Generation filter */}
      <Select
        value={currentGen || 'all'}
        onValueChange={(v) => updateParam('gen', v === 'all' ? null : v)}
      >
        <SelectTrigger size="sm" className="w-44">
          {currentGen ? `Gen ${currentGen}` : t('allGenerations')}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allGenerations')}</SelectItem>
          {GENERATIONS.map((g) => (
            <SelectItem key={g} value={String(g)}>
              {`Gen ${g}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type filter */}
      <Select
        value={currentType || 'all'}
        onValueChange={(v) => updateParam('type', v === 'all' ? null : v)}
      >
        <SelectTrigger size="sm" className="w-36">
          {currentType ? (
            <span className="capitalize">{currentType}</span>
          ) : (
            t('allTypes')
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allTypes')}</SelectItem>
          {TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              <span className="capitalize">{type}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category filter */}
      <Select
        value={currentCat}
        onValueChange={(v) => updateParam('cat', v === 'all' ? null : v)}
      >
        <SelectTrigger size="sm" className="w-36">
          {getCategoryLabel(currentCat)}
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {getCategoryLabel(cat)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
