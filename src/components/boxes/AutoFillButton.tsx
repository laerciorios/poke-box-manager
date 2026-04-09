'use client'

import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePresetsStore } from '@/stores/usePresetsStore'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { BUILTIN_PRESETS } from '@/lib/presets/builtin-presets'
import { applyPreset } from '@/lib/preset-engine'
import pokemonData from '@/data/pokemon.json'
import formsData from '@/data/forms.json'
import type { PokemonEntry, PokemonForm } from '@/types/pokemon'

const allPokemon = pokemonData as unknown as PokemonEntry[]
const allForms = formsData as unknown as Record<string, PokemonForm>

export function AutoFillButton() {
  const userPresets = usePresetsStore((s) => s.presets)
  const boxes = useBoxStore((s) => s.boxes)
  const setBoxes = useBoxStore((s) => s.setBoxes)
  const registered = usePokedexStore((s) => s.registered)
  const variations = useSettingsStore((s) => s.variations)

  const allPresets = [...BUILTIN_PRESETS, ...userPresets]

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    allPresets[0]?.id ?? null,
  )
  const [confirmOpen, setConfirmOpen] = useState(false)

  const hasExistingData = boxes.some((box) => box.slots.some((slot) => slot !== null))

  function handleAutoFill() {
    if (hasExistingData) {
      setConfirmOpen(true)
    } else {
      runAutoFill()
    }
  }

  // Task 6.3: read stores, call applyPreset, commit via setBoxes
  function runAutoFill() {
    const preset = allPresets.find((p) => p.id === selectedPresetId)
    if (!preset) return
    const registeredKeys = new Set(registered)
    const result = applyPreset(preset, allPokemon, allForms, variations, registeredKeys)
    setBoxes(result)
    setConfirmOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Select preset" />
        </SelectTrigger>
        <SelectContent>
          {BUILTIN_PRESETS.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
          {userPresets.length > 0 && (
            <>
              <SelectSeparator />
              {userPresets.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>

      <Button size="sm" onClick={handleAutoFill} disabled={!selectedPresetId}>
        <Wand2 className="size-3.5" />
        Auto-fill
      </Button>

      {/* Task 6.2: confirmation dialog when boxes already contain data */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Replace existing boxes?</DialogTitle>
            <DialogDescription>
              Auto-fill will replace your current box layout with the selected preset. Your
              registration data will be preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={runAutoFill}>
              Replace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
