'use client'

import { useMemo } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import {
  TOGGLE_FORM_TYPES,
  VARIATION_COUNTS,
  BASE_POKEMON_COUNT,
  computeTotal,
} from '@/lib/variation-counts'
import { VariationToggleItem } from './VariationToggleItem'
import type { VariationToggles } from '@/types/settings'
import formsData from '@/data/forms.json'

const FORM_TYPE_BY_ID: Record<string, string> = Object.fromEntries(
  Object.entries(formsData as Record<string, { formType: string }>).map(
    ([id, form]) => [id, form.formType],
  ),
)

const TOGGLE_ORDER: (keyof VariationToggles)[] = [
  'regionalForms',
  'genderForms',
  'unownLetters',
  'vivillonPatterns',
  'alcremieVariations',
  'colorVariations',
  'sizeVariations',
  'megaEvolutions',
  'gmaxForms',
  'battleForms',
  'originForms',
  'costumedPokemon',
]

const TOGGLE_LABELS: Record<keyof VariationToggles, { label: string; subtitle: string }> = {
  regionalForms: {
    label: 'Regional Forms',
    subtitle: 'Alolan, Galarian, Hisuian, and Paldean variants',
  },
  genderForms: {
    label: 'Gender Differences',
    subtitle: 'Pokémon with visually distinct male/female sprites',
  },
  unownLetters: {
    label: 'Unown Letters',
    subtitle: 'All 28 Unown letter and symbol forms',
  },
  vivillonPatterns: {
    label: 'Vivillon Patterns',
    subtitle: 'All 20 regional wing pattern variations',
  },
  alcremieVariations: {
    label: 'Alcremie Variations',
    subtitle: 'All sweet and cream flavor combinations',
  },
  colorVariations: {
    label: 'Color Variations',
    subtitle: 'Pokémon with alternate color forms (e.g. Flabébé)',
  },
  sizeVariations: {
    label: 'Size Variations',
    subtitle: 'Pokémon with distinct size forms (e.g. Pumpkaboo)',
  },
  megaEvolutions: {
    label: 'Mega Evolutions',
    subtitle: 'Mega and Primal forms',
  },
  gmaxForms: {
    label: 'Gigantamax Forms',
    subtitle: 'Gigantamax variants from Sword & Shield',
  },
  battleForms: {
    label: 'Battle Forms',
    subtitle: 'Forms that change during battle (e.g. Aegislash)',
  },
  originForms: {
    label: 'Origin Forms',
    subtitle: 'Origin Formes and special alternate forms',
  },
  costumedPokemon: {
    label: 'Costumed Pokémon',
    subtitle: 'Event-exclusive costume variants (e.g. Pikachu costumes)',
  },
}

export function VariationTogglesPanel() {
  const variations = useSettingsStore((s) => s.variations)
  const setVariation = useSettingsStore((s) => s.setVariation)
  const registered = usePokedexStore((s) => s.registered)

  const hasWarningByKey = useMemo(() => {
    const result = {} as Record<keyof VariationToggles, boolean>
    for (const key of TOGGLE_ORDER) {
      const types = new Set(TOGGLE_FORM_TYPES[key])
      result[key] = registered.some((entry) => {
        const colonIdx = entry.indexOf(':')
        if (colonIdx === -1) return false
        const formId = entry.slice(colonIdx + 1)
        const formType = FORM_TYPE_BY_ID[formId]
        return formType !== undefined && types.has(formType)
      })
    }
    return result
  }, [registered])

  const total = computeTotal(variations)

  return (
    <div className="space-y-1">
      <div className="divide-y">
        {TOGGLE_ORDER.map((key) => (
          <VariationToggleItem
            key={key}
            checked={variations[key]}
            label={TOGGLE_LABELS[key].label}
            subtitle={TOGGLE_LABELS[key].subtitle}
            additionalCount={VARIATION_COUNTS[key]}
            hasWarning={hasWarningByKey[key]}
            onToggle={(value) => setVariation(key, value)}
          />
        ))}
      </div>
      <div className="pt-4 space-y-1 border-t">
        <p className="text-sm text-muted-foreground">
          Total with selected variations: <span className="font-medium text-foreground">{total}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Base total (no variations): <span className="font-medium text-foreground">{BASE_POKEMON_COUNT}</span>
        </p>
      </div>
    </div>
  )
}
