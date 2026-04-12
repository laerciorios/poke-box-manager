'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useSearch } from '@/contexts/SearchContext'
import type { PokemonCategory } from '@/types/pokemon'
import type { SearchFilters } from '@/lib/search/types'

const TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const CATEGORIES: PokemonCategory[] = ['normal', 'legendary', 'mythical', 'ultra-beast', 'paradox']

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-muted text-muted-foreground hover:border-primary/50 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  )
}

export function SearchFilterChips() {
  const t = useTranslations('Search')
  const { filters, setFilter } = useSearch()

  function toggle<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilter(key, filters[key] === value ? null : value)
  }

  const categoryLabel = (cat: PokemonCategory): string => {
    switch (cat) {
      case 'normal': return t('categoryNormal')
      case 'legendary': return t('categoryLegendary')
      case 'mythical': return t('categoryMythical')
      case 'ultra-beast': return t('categoryUltraBeast')
      case 'paradox': return t('categoryParadox')
      default: return cat
    }
  }

  return (
    <div className="flex flex-col gap-2 border-b pb-2">
      {/* Generation */}
      <ChipRow label={t('filterGeneration')}>
        {GENERATIONS.map((g) => (
          <Chip key={g} active={filters.generation === g} onClick={() => toggle('generation', g)}>
            Gen {g}
          </Chip>
        ))}
      </ChipRow>

      {/* Type */}
      <ChipRow label={t('filterType')}>
        {TYPES.map((type) => (
          <Chip key={type} active={filters.type === type} onClick={() => toggle('type', type)}>
            <span className="capitalize">{type}</span>
          </Chip>
        ))}
      </ChipRow>

      {/* Category */}
      <ChipRow label={t('filterCategory')}>
        {CATEGORIES.map((cat) => (
          <Chip key={cat} active={filters.category === cat} onClick={() => toggle('category', cat)}>
            {categoryLabel(cat)}
          </Chip>
        ))}
      </ChipRow>

      {/* Registration status */}
      <ChipRow label={t('filterStatus')}>
        <Chip active={filters.registered === true} onClick={() => toggle('registered', true)}>
          {t('statusRegistered')}
        </Chip>
        <Chip active={filters.registered === false} onClick={() => toggle('registered', false)}>
          {t('statusMissing')}
        </Chip>
      </ChipRow>
    </div>
  )
}
