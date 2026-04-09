'use client'

import { useTranslations } from 'next-intl'
import { ChevronUp, ChevronDown, X, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import type { PresetRule } from '@/types/preset'
import type { PokemonCategory } from '@/types/pokemon'

const CATEGORIES: { value: PokemonCategory; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'legendary', label: 'Legendary' },
  { value: 'mythical', label: 'Mythical' },
  { value: 'baby', label: 'Baby' },
  { value: 'ultra-beast', label: 'Ultra Beast' },
  { value: 'paradox', label: 'Paradox' },
]

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const TYPES: string[] = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

const SORT_OPTION_KEYS = [
  'dex-number',
  'name',
  'type-primary',
  'generation',
  'evolution-chain',
  'regional-dex',
] as const

interface RuleRowProps {
  rule: PresetRule
  index: number
  total: number
  onChange: (updated: PresetRule) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function RuleRow({
  rule,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: RuleRowProps) {
  const t = useTranslations('Presets')

  const isMatchRemaining =
    !rule.filter.categories?.length &&
    !rule.filter.generations?.length &&
    !rule.filter.types?.length &&
    !rule.filter.formTypes?.length &&
    !rule.filter.exclude

  function toggleMatchRemaining(checked: boolean) {
    if (checked) {
      onChange({ ...rule, filter: {} })
    }
  }

  function toggleCategory(cat: PokemonCategory, checked: boolean) {
    const current = rule.filter.categories ?? []
    const next = checked ? [...current, cat] : current.filter((c) => c !== cat)
    onChange({
      ...rule,
      filter: { ...rule.filter, categories: next.length ? next : undefined },
    })
  }

  function toggleGeneration(gen: number, checked: boolean) {
    const current = rule.filter.generations ?? []
    const next = checked ? [...current, gen] : current.filter((g) => g !== gen)
    onChange({
      ...rule,
      filter: { ...rule.filter, generations: next.length ? next : undefined },
    })
  }

  function toggleType(type: string, checked: boolean) {
    const current = rule.filter.types ?? []
    const next = checked ? [...current, type] : current.filter((t) => t !== type)
    onChange({
      ...rule,
      filter: { ...rule.filter, types: next.length ? next : undefined },
    })
  }

  const filterDisabled = isMatchRemaining

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{t('rule')} {index + 1}</span>
        <div className="flex items-center gap-1">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Move rule up"
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label="Move rule down"
          >
            <ChevronDown className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={onDelete}
            disabled={total === 1}
            className="text-destructive hover:text-destructive"
            aria-label="Delete rule"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Match remaining toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isMatchRemaining}
          onChange={(e) => toggleMatchRemaining(e.target.checked)}
          className="size-4 rounded"
        />
        <span className="text-sm">{t('matchRemaining')}</span>
      </label>

      <Separator />

      {/* Category filters */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('filterCategory')}</p>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(({ value, label }) => (
            <label key={value} className={`flex items-center gap-1.5 cursor-pointer ${filterDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
              <input
                type="checkbox"
                checked={rule.filter.categories?.includes(value) ?? false}
                disabled={filterDisabled}
                onChange={(e) => toggleCategory(value, e.target.checked)}
                className="size-4 rounded"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Generation filters */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('filterGeneration')}</p>
        <div className="flex flex-wrap gap-3">
          {GENERATIONS.map((gen) => (
            <label key={gen} className={`flex items-center gap-1.5 cursor-pointer ${filterDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
              <input
                type="checkbox"
                checked={rule.filter.generations?.includes(gen) ?? false}
                disabled={filterDisabled}
                onChange={(e) => toggleGeneration(gen, e.target.checked)}
                className="size-4 rounded"
              />
              <span className="text-sm">Gen {gen}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type filters */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('filterType')}</p>
        <div className="flex flex-wrap gap-3">
          {TYPES.map((type) => (
            <label key={type} className={`flex items-center gap-1.5 cursor-pointer ${filterDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
              <input
                type="checkbox"
                checked={rule.filter.types?.includes(type) ?? false}
                disabled={filterDisabled}
                onChange={(e) => toggleType(type, e.target.checked)}
                className="size-4 rounded"
              />
              <span className="text-sm">{capitalize(type)}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Sort criteria */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium shrink-0">{t('sortBy')}</label>
        <Select
          value={rule.sort}
          onValueChange={(val) => onChange({ ...rule, sort: val as PresetRule['sort'] })}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTION_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {t(`sortOptions.${key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Box name template */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium shrink-0">{t('boxName')}</label>
        <Input
          value={rule.boxNameTemplate ?? ''}
          onChange={(e) => onChange({ ...rule, boxNameTemplate: e.target.value })}
          placeholder="e.g. Gen {gen} ({n}/{total})"
          className="flex-1"
        />
        <Tooltip>
          <TooltipTrigger
            render={
              <button type="button" className="text-muted-foreground hover:text-foreground" />
            }
          >
            <Info className="size-4" />
            <span className="sr-only">Template variables</span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">
            {t('templateHint')}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
