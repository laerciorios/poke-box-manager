'use client'

import { useTranslations } from 'next-intl'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TypeChip } from '@/components/pokemon/TypeChip'
import { ALL_TYPES, ALL_CATEGORIES } from '@/lib/pokedex-filters'
import type { PokemonCategory } from '@/types/pokemon'
import { cn } from '@/lib/utils'

export interface MissingFilterState {
  generation: number | 'all'
  type: string | 'all'
  category: PokemonCategory | 'all'
  evolutionReadyOnly: boolean
}

interface Props {
  state: MissingFilterState
  onChange: (next: MissingFilterState) => void
  generations: number[]
  resultCount: number
  evolutionReadyCount: number
}

export function MissingFilters({
  state,
  onChange,
  generations,
  resultCount,
  evolutionReadyCount,
}: Props) {
  const t = useTranslations('Missing.filters')
  const tCat = useTranslations('Pokedex.categories')

  const update = (changes: Partial<MissingFilterState>) =>
    onChange({ ...state, ...changes })

  const isClean =
    state.generation === 'all' &&
    state.type === 'all' &&
    state.category === 'all' &&
    !state.evolutionReadyOnly

  return (
    <div className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
      <div>
        <Label>{t('generation')}</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={state.generation === 'all' ? 'accent' : 'outline'}
            onClick={() => update({ generation: 'all' })}
          >
            {t('any')}
          </Button>
          {generations.map((g) => (
            <Button
              key={g}
              size="sm"
              variant={state.generation === g ? 'accent' : 'outline'}
              onClick={() => update({ generation: g })}
            >
              Gen {g}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>{t('type')}</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={state.type === 'all' ? 'accent' : 'outline'}
            onClick={() => update({ type: 'all' })}
          >
            {t('any')}
          </Button>
          {ALL_TYPES.map((type) => {
            const active = state.type === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => update({ type: active ? 'all' : type })}
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
          <Button
            size="sm"
            variant={state.category === 'all' ? 'accent' : 'outline'}
            onClick={() => update({ category: 'all' })}
          >
            {t('any')}
          </Button>
          {ALL_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={state.category === cat ? 'accent' : 'outline'}
              onClick={() => update({ category: cat })}
            >
              {state.category === cat && <Check className="size-3" strokeWidth={3} />}
              {tCat(cat)}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-(--radius-md) border border-[var(--border)] bg-[var(--surface)] p-3 flex items-start gap-3">
        <input
          id="missing-evo-ready"
          type="checkbox"
          checked={state.evolutionReadyOnly}
          onChange={(e) => update({ evolutionReadyOnly: e.target.checked })}
          className="mt-1 size-4 rounded border-[var(--border-strong)] accent-[var(--accent)]"
        />
        <label htmlFor="missing-evo-ready" className="flex-1 cursor-pointer">
          <span className="text-sm font-medium block">{t('evolutionReady')}</span>
          <span className="text-xs text-[var(--muted-foreground)]">
            {t('evolutionReadyHint', { count: evolutionReadyCount })}
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
        <span className="text-xs text-[var(--muted-foreground)] tabular-nums">
          {t('results', { count: resultCount })}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            onChange({
              generation: 'all',
              type: 'all',
              category: 'all',
              evolutionReadyOnly: false,
            })
          }
          disabled={isClean}
        >
          <X className="size-3.5" />
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
