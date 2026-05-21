'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TypeChip } from '@/components/pokemon/TypeChip'
import { ALL_TYPES, ALL_CATEGORIES, type RegistrationStatus } from '@/lib/pokedex-filters'
import type { PokemonCategory } from '@/types/pokemon'
import { cn } from '@/lib/utils'

interface Props {
  generations: number[]
  activeGen: number | 'all'
  onGenChange: (g: number | 'all') => void
  types: Set<string>
  onToggleType: (type: string) => void
  categories: Set<PokemonCategory>
  onToggleCategory: (c: PokemonCategory) => void
  status: RegistrationStatus
  onStatusChange: (s: RegistrationStatus) => void
  onClear: () => void
  resultCount: number
}

export function PokedexFilters({
  generations,
  activeGen,
  onGenChange,
  types,
  onToggleType,
  categories,
  onToggleCategory,
  status,
  onStatusChange,
  onClear,
  resultCount,
}: Props) {
  const t = useTranslations('Pokedex.filters')
  const tCat = useTranslations('Pokedex.categories')

  return (
    <div className="space-y-4">
      <div>
        <Label>{t('type')}</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ALL_TYPES.map((type) => {
            const active = types.has(type)
            return (
              <button
                key={type}
                type="button"
                onClick={() => onToggleType(type)}
                aria-pressed={active}
                className={cn(
                  'rounded-md border transition-all',
                  active
                    ? 'border-[var(--foreground)] ring-1 ring-[var(--foreground)]'
                    : 'border-[var(--border)] opacity-70 hover:opacity-100',
                )}
              >
                <TypeChip type={type} />
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <Label>{t('category')}</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={categories.has(cat) ? 'accent' : 'outline'}
              onClick={() => onToggleCategory(cat)}
            >
              {categories.has(cat) && <Check className="size-3" strokeWidth={3} />}
              {tCat(cat)}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>{t('status')}</Label>
        <div className="mt-2 flex gap-1.5">
          {(['all', 'registered', 'missing'] as RegistrationStatus[]).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? 'accent' : 'outline'}
              onClick={() => onStatusChange(s)}
            >
              {s === 'all' ? t('any') : s === 'registered' ? t('onlyRegistered') : t('onlyMissing')}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>{`Gen`}</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={activeGen === 'all' ? 'accent' : 'outline'}
            onClick={() => onGenChange('all')}
          >
            {t('any')}
          </Button>
          {generations.map((g) => (
            <Button
              key={g}
              size="sm"
              variant={activeGen === g ? 'accent' : 'outline'}
              onClick={() => onGenChange(g)}
            >
              Gen {g}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
        <span className="text-xs text-[var(--muted-foreground)] tabular-nums">
          {t('results', { count: resultCount })}
        </span>
        <Button size="sm" variant="ghost" onClick={onClear}>
          {t('clear')}
        </Button>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)]">
      {children}
    </p>
  )
}
