'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BoxGrid } from '@/components/boxes/BoxGrid'
import { BoxNavigation } from '@/components/boxes/BoxNavigation'
import { BoxOverview } from '@/components/boxes/BoxOverview'
import { AutoFillButton } from '@/components/boxes/AutoFillButton'
import { useBoxStore } from '@/stores/useBoxStore'
import { useRegistrationMode } from '@/hooks/useRegistrationMode'
import pokemonData from '@/data/pokemon.json'
import formsData from '@/data/forms.json'
import type { PokemonEntry, PokemonForm } from '@/types/pokemon'

const pokemonById = new Map(
  (pokemonData as unknown as PokemonEntry[]).map((p) => [p.id, p]),
)
const formsById = formsData as unknown as Record<string, PokemonForm>

function getPokemonName(slot: { pokemonId: number; formId?: string }): string | undefined {
  if (slot.formId) return formsById[slot.formId]?.name
  return pokemonById.get(slot.pokemonId)?.name
}

function getSpriteUrl(slot: { pokemonId: number; formId?: string }): string | undefined {
  if (slot.formId) return formsById[slot.formId]?.sprite
  return pokemonById.get(slot.pokemonId)?.sprite
}

export default function BoxesPage() {
  const boxes = useBoxStore((s) => s.boxes)
  const createBox = useBoxStore((s) => s.createBox)
  const [activeBoxIndex, setActiveBoxIndex] = useState(0)
  const registration = useRegistrationMode()

  const safeIndex = Math.min(activeBoxIndex, Math.max(0, boxes.length - 1))
  const activeBox = boxes[safeIndex] ?? null

  function handlePrevious() {
    setActiveBoxIndex((i) => Math.max(0, i - 1))
  }

  function handleNext() {
    setActiveBoxIndex((i) => Math.min(boxes.length - 1, i + 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Boxes</h1>
        <div className="flex items-center gap-2">
          <AutoFillButton />
          <Button
            size="sm"
            variant="outline"
            onClick={() => createBox(`Box ${boxes.length + 1}`)}
          >
            <Plus className="size-3.5" />
            New Box
          </Button>
        </div>
      </div>

      {boxes.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="mb-4 text-muted-foreground">
            No boxes yet. Create your first box or use Auto-fill to get started.
          </p>
          <Button onClick={() => createBox('Box 1')}>Create first box</Button>
        </div>
      ) : (
        <>
          <BoxOverview
            boxes={boxes}
            activeBoxIndex={safeIndex}
            onSelectBox={setActiveBoxIndex}
          />

          {activeBox && (
            <div className="space-y-4">
              <BoxNavigation
                boxName={activeBox.name}
                currentIndex={safeIndex}
                totalBoxes={boxes.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
              <BoxGrid
                box={activeBox}
                registrationMode={{
                  isActive: registration.isActive,
                  selectedKeys: registration.selectedKeys,
                  onToggle: registration.toggleMode,
                  handleSlotClick: registration.handleSlotClick,
                  markSelected: registration.markSelected,
                }}
                getPokemonName={getPokemonName}
                getSpriteUrl={getSpriteUrl}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
