'use client'

import * as React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { PresetRule, SortCriteria } from '@/types/preset'
import type { PokemonCategory } from '@/types/pokemon'
import { ALL_TYPES, ALL_CATEGORIES } from '@/lib/pokedex-filters'
import { TypeChip } from '@/components/pokemon/TypeChip'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  rule: PresetRule
  index: number
  onChange: (next: PresetRule) => void
  onDelete: () => void
  generations: number[]
}

const SORT_OPTIONS: SortCriteria[] = [
  'dex-number',
  'name',
  'type-primary',
  'generation',
  'evolution-chain',
  'regional-dex',
]

export function PresetRuleEditor({ rule, index, onChange, onDelete, generations }: Props) {
  const t = useTranslations('Presets.editor.rule')
  const tSort = useTranslations('Presets.editor.sort')
  const tCommon = useTranslations('Common')

  const sortable = useSortable({ id: `rule:${index}` })
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = sortable

  const filter = rule.filter

  const toggleGen = (g: number) => {
    const set = new Set(filter.generations ?? [])
    if (set.has(g)) set.delete(g)
    else set.add(g)
    onChange({
      ...rule,
      filter: { ...filter, generations: set.size > 0 ? Array.from(set).sort((a, b) => a - b) : undefined },
    })
  }

  const toggleType = (type: string) => {
    const set = new Set(filter.types ?? [])
    if (set.has(type)) set.delete(type)
    else set.add(type)
    onChange({
      ...rule,
      filter: { ...filter, types: set.size > 0 ? Array.from(set) : undefined },
    })
  }

  const toggleCategory = (cat: PokemonCategory) => {
    const set = new Set(filter.categories ?? [])
    if (set.has(cat)) set.delete(cat)
    else set.add(cat)
    onChange({
      ...rule,
      filter: { ...filter, categories: set.size > 0 ? Array.from(set) : undefined },
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className={cn(
        'rounded-(--radius-md) border border-[var(--border)] bg-[var(--surface)] overflow-hidden',
        isDragging && 'shadow-[var(--shadow-pop)]',
      )}
    >
      <header className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--surface-2)]/40">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={t('drag')}
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)]">
          {t('label', { n: index + 1 })}
        </span>
        <div className="flex-1" />
        <Button
          size="icon"
          variant="ghost"
          onClick={onDelete}
          aria-label={tCommon('delete')}
          className="text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </header>

      <div className="px-3 py-3 space-y-3">
        <Section label={t('generations')}>
          <div className="flex flex-wrap gap-1.5">
            {generations.map((g) => {
              const active = (filter.generations ?? []).includes(g)
              return (
                <Button
                  key={g}
                  size="sm"
                  variant={active ? 'accent' : 'outline'}
                  onClick={() => toggleGen(g)}
                >
                  Gen {g}
                </Button>
              )
            })}
          </div>
        </Section>

        <Section label={t('types')}>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TYPES.map((type) => {
              const active = (filter.types ?? []).includes(type)
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
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
        </Section>

        <Section label={t('categories')}>
          <div className="flex flex-wrap gap-1.5">
            {ALL_CATEGORIES.map((cat) => {
              const active = (filter.categories ?? []).includes(cat)
              return (
                <Button
                  key={cat}
                  size="sm"
                  variant={active ? 'accent' : 'outline'}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </Button>
              )
            })}
          </div>
        </Section>

        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
          <Section label={t('sort')}>
            <select
              value={rule.sort}
              onChange={(e) => onChange({ ...rule, sort: e.target.value as SortCriteria })}
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {tSort(opt)}
                </option>
              ))}
            </select>
          </Section>

          <Section label={t('nameTemplate')} hint={t('nameTemplateHint')}>
            <Input
              value={rule.boxNameTemplate ?? ''}
              onChange={(e) =>
                onChange({
                  ...rule,
                  boxNameTemplate: e.target.value.trim() === '' ? undefined : e.target.value,
                })
              }
              placeholder={t('nameTemplatePlaceholder')}
            />
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)] mb-1.5">
        {label}
      </p>
      {children}
      {hint && (
        <p className="text-[10px] text-[var(--muted-foreground)] mt-1 font-mono">
          {hint}
        </p>
      )}
    </div>
  )
}
