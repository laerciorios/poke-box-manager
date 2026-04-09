'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { applyPreset } from '@/lib/box-engine/organizer'
import type { OrganizationPreset, PresetRule } from '@/types/preset'
import type { Box } from '@/types/box'
import { BOX_SIZE } from '@/types/box'

// Static imports — parsed once at module load
import pokemonData from '@/data/pokemon.json'
import evolutionChainsData from '@/data/evolution-chains.json'

const allPokemon = pokemonData as import('@/types/pokemon').PokemonEntry[]
const evolutionChains = evolutionChainsData as Record<number, number[]>

interface PresetPreviewProps {
  rules: PresetRule[]
  name: string
}

export function PresetPreview({ rules, name }: PresetPreviewProps) {
  const [boxes, setBoxes] = useState<Box[] | null>(null)

  if (rules.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Add at least one rule to see a preview.
      </div>
    )
  }

  function handlePreview() {
    const preset: OrganizationPreset = {
      id: '__preview__',
      name,
      names: { en: name, 'pt-BR': name },
      description: '',
      descriptions: { en: '', 'pt-BR': '' },
      isBuiltIn: false,
      rules: rules.map((r, i) => ({ ...r, order: i + 1 })),
    }
    const result = applyPreset(preset, allPokemon, evolutionChains)
    setBoxes(result)
  }

  const totalBoxes = boxes?.length ?? 0
  const totalPokemon = boxes?.reduce(
    (sum, box) => sum + box.slots.filter(Boolean).length,
    0,
  ) ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={handlePreview}>
          Preview
        </Button>
        {boxes && (
          <span className="text-sm text-muted-foreground">
            {totalBoxes} box{totalBoxes !== 1 ? 'es' : ''} · {totalPokemon} Pokémon
          </span>
        )}
      </div>

      {boxes && boxes.length > 0 && (
        <div className="max-h-64 overflow-y-auto rounded-lg border p-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {boxes.map((box, idx) => {
              const filled = box.slots.filter(Boolean).length
              return (
                <div
                  key={idx}
                  className="rounded-md border bg-muted/30 p-2 text-xs"
                >
                  <p className="truncate font-medium">{box.name}</p>
                  <p className="text-muted-foreground">
                    {filled}/{BOX_SIZE}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
