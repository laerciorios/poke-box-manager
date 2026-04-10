'use client'

import { useMemo } from 'react'
import pokemonData from '@/data/pokemon.json'
import generationsData from '@/data/generations.json'
import { TOGGLE_FORM_TYPES } from '@/lib/variation-counts'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useBoxStore } from '@/stores/useBoxStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { VariationToggles } from '@/types/settings'

export interface GenerationStat {
  id: number
  name: string
  registered: number
  total: number
}

export interface TypeStat {
  type: string
  registered: number
  total: number
}

export type BoxState = 'complete' | 'partial' | 'empty'

export interface BoxHeatmapEntry {
  id: string
  name: string
  state: BoxState
}

export interface StatsData {
  overall: { registered: number; total: number; percentage: number }
  byGeneration: GenerationStat[]
  byType: TypeStat[]
  boxSummary: { complete: number; partial: number; empty: number }
  boxes: BoxHeatmapEntry[]
}

interface RawPokemon {
  id: number
  generation: number
  types: string[]
  forms: Array<{ id: string; formType: string; types: string[] }>
}

interface RawGeneration {
  id: number
  names: { en: string; 'pt-BR': string }
}

function buildEnabledFormTypes(variations: VariationToggles): Set<string> {
  const enabled = new Set<string>()
  for (const [key, formTypes] of Object.entries(TOGGLE_FORM_TYPES) as [
    keyof VariationToggles,
    string[],
  ][]) {
    if (variations[key]) {
      for (const ft of formTypes) enabled.add(ft)
    }
  }
  return enabled
}

function classifyBoxState(slots: (null | { registered: boolean })[]): BoxState {
  const occupied = slots.filter((s) => s !== null)
  if (occupied.length === 0) return 'empty'
  if (occupied.every((s) => s!.registered)) return 'complete'
  return 'partial'
}

export function useStatsData(): StatsData {
  const registered = usePokedexStore((s) => s.registered)
  const boxes = useBoxStore((s) => s.boxes)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const variations = useSettingsStore((s) => s.variations)
  const locale = useSettingsStore((s) => s.locale)

  return useMemo(() => {
    const registeredSet = new Set(registered)
    const enabledFormTypes = buildEnabledFormTypes(variations)
    const activeGenSet = new Set(activeGenerations)

    // Build generation name lookup
    const genNames = new Map<number, string>()
    for (const gen of generationsData as RawGeneration[]) {
      genNames.set(gen.id, gen.names[locale as 'en' | 'pt-BR'] ?? gen.names['en'])
    }

    // Per-generation accumulators
    const genMap = new Map<number, { total: number; registered: number }>()
    for (const genId of activeGenerations) {
      genMap.set(genId, { total: 0, registered: 0 })
    }

    // Per-type accumulators
    const typeMap = new Map<string, { total: number; registered: number }>()

    function addToType(type: string, isRegistered: boolean) {
      const t = typeMap.get(type) ?? { total: 0, registered: 0 }
      t.total++
      if (isRegistered) t.registered++
      typeMap.set(type, t)
    }

    function addToGen(genId: number, isRegistered: boolean) {
      const g = genMap.get(genId)
      if (!g) return
      g.total++
      if (isRegistered) g.registered++
    }

    let overallTotal = 0
    let overallRegistered = 0

    for (const mon of pokemonData as RawPokemon[]) {
      if (!activeGenSet.has(mon.generation)) continue

      // Base species
      const baseKey = String(mon.id)
      const baseRegistered = registeredSet.has(baseKey)
      overallTotal++
      if (baseRegistered) overallRegistered++
      addToGen(mon.generation, baseRegistered)
      for (const type of mon.types) addToType(type, baseRegistered)

      // Forms
      for (const form of mon.forms) {
        if (!enabledFormTypes.has(form.formType)) continue
        const formKey = `${mon.id}:${form.id}`
        const formRegistered = registeredSet.has(formKey)
        overallTotal++
        if (formRegistered) overallRegistered++
        addToGen(mon.generation, formRegistered)
        for (const type of form.types) addToType(type, formRegistered)
      }
    }

    const overall = {
      registered: overallRegistered,
      total: overallTotal,
      percentage:
        overallTotal > 0
          ? Math.round((overallRegistered / overallTotal) * 1000) / 10
          : 0,
    }

    const byGeneration: GenerationStat[] = activeGenerations
      .filter((id) => genMap.has(id))
      .map((id) => {
        const g = genMap.get(id)!
        return {
          id,
          name: genNames.get(id) ?? `Gen ${id}`,
          registered: g.registered,
          total: g.total,
        }
      })

    const byType: TypeStat[] = Array.from(typeMap.entries()).map(([type, t]) => ({
      type,
      registered: t.registered,
      total: t.total,
    }))

    // Box heatmap
    const boxEntries: BoxHeatmapEntry[] = boxes.map((box) => ({
      id: box.id,
      name: box.name,
      state: classifyBoxState(box.slots),
    }))

    const boxSummary = { complete: 0, partial: 0, empty: 0 }
    for (const entry of boxEntries) {
      boxSummary[entry.state]++
    }

    return { overall, byGeneration, byType, boxSummary, boxes: boxEntries }
  }, [registered, boxes, activeGenerations, variations, locale])
}
