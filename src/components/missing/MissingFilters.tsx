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
import type { CategoryFilter } from '@/lib/missing-pokemon'

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

const CATEGORIES: CategoryFilter[] = ['all', 'normal', 'legendary', 'mythical']

export function MissingFilters() {
  const t = useTranslations('Missing')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentGen = searchParams.get('gen') ?? ''
  const currentType = searchParams.get('type') ?? ''
  const currentCat = (searchParams.get('cat') ?? 'all') as CategoryFilter

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Generation filter */}
      <Select value={currentGen || 'all'} onValueChange={(v) => updateParam('gen', v === 'all' ? null : v)}>
        <SelectTrigger size="sm" className="w-40">
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
      <Select value={currentType || 'all'} onValueChange={(v) => updateParam('type', v === 'all' ? null : v)}>
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
      <Select value={currentCat} onValueChange={(v) => updateParam('cat', v === 'all' ? null : v)}>
        <SelectTrigger size="sm" className="w-36">
          {currentCat === 'all'
            ? t('allCategories')
            : currentCat === 'normal'
              ? t('categoryNormal')
              : currentCat === 'legendary'
                ? t('categoryLegendary')
                : t('categoryMythical')}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allCategories')}</SelectItem>
          <SelectItem value="normal">{t('categoryNormal')}</SelectItem>
          <SelectItem value="legendary">{t('categoryLegendary')}</SelectItem>
          <SelectItem value="mythical">{t('categoryMythical')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
