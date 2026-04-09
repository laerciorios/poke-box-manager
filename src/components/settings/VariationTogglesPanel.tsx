'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
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

export function VariationTogglesPanel() {
  const tVariations = useTranslations('VariationToggles')
  const tSettings = useTranslations('Settings')
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
            label={tVariations(`${key}.label`)}
            subtitle={tVariations(`${key}.subtitle`)}
            additionalCount={VARIATION_COUNTS[key]}
            hasWarning={hasWarningByKey[key]}
            onToggle={(value) => setVariation(key, value)}
          />
        ))}
      </div>
      <div className="pt-4 space-y-1 border-t">
        <p className="text-sm text-muted-foreground">
          {tSettings.rich('totalWithVariations', {
            total,
            strong: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
          })}
        </p>
        <p className="text-sm text-muted-foreground">
          {tSettings.rich('baseTotal', {
            base: BASE_POKEMON_COUNT,
            strong: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
          })}
        </p>
      </div>
    </div>
  )
}
