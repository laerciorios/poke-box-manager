'use client'

import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useAcquisitionStore } from '@/stores/useAcquisitionStore'
import { getPokemonById, getEvolutionChain } from '@/lib/pokemon-lookup'
import { getPokemonName } from '@/lib/pokemon-names'
import { getEvolutionMethodLabel, isTrivialStep } from '@/lib/evolution-method-label'
import { Button } from '@/components/ui/button'
import type { EvolutionStep } from '@/types/game'

interface AcquisitionChecklistProps {
  pokemonId: number
}

export function AcquisitionChecklist({ pokemonId }: AcquisitionChecklistProps) {
  const t = useTranslations('Acquisition')
  const locale = useSettingsStore((s) => s.locale)

  const pokemon = getPokemonById(pokemonId)
  const chainId = pokemon?.evolutionChainId
  const chain = chainId ? getEvolutionChain(chainId) : undefined

  const stepsForPokemon: Array<{ step: EvolutionStep; originalIndex: number }> = []
  if (chain) {
    chain.steps.forEach((step, idx) => {
      if (step.toId === pokemonId && !isTrivialStep(step.method)) {
        stepsForPokemon.push({ step, originalIndex: idx })
      }
    })
  }

  const checkedSteps = useAcquisitionStore((s) => s.checkedSteps[pokemonId]) ?? []
  const toggleStep = useAcquisitionStore((s) => s.toggleStep)
  const clearChecklist = useAcquisitionStore((s) => s.clearChecklist)

  if (stepsForPokemon.length === 0) return null

  const checkedCount = stepsForPokemon.filter(({ originalIndex }) =>
    checkedSteps.includes(originalIndex),
  ).length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t('howToObtain')}
        </p>
        {checkedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground"
            onClick={() => clearChecklist(pokemonId)}
          >
            {t('clear')}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {stepsForPokemon.map(({ step, originalIndex }) => {
          const checked = checkedSteps.includes(originalIndex)
          const fromPokemon = getPokemonById(step.fromId)
          const fromName = fromPokemon ? getPokemonName(fromPokemon, locale) : `#${step.fromId}`
          const label = getEvolutionMethodLabel(step.method, locale)

          return (
            <label
              key={originalIndex}
              className="flex items-start gap-2.5 rounded-md px-2 py-1.5 cursor-pointer hover:bg-muted transition-colors"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleStep(pokemonId, originalIndex)}
                className="mt-0.5 shrink-0 accent-primary"
              />
              <span className={`text-sm leading-snug ${checked ? 'line-through text-muted-foreground' : ''}`}>
                <span className="text-muted-foreground text-xs">{fromName} →</span>{' '}
                {label}
              </span>
            </label>
          )
        })}
      </div>

      {stepsForPokemon.length > 1 && (
        <p className="text-xs text-muted-foreground/60 px-2">
          {t('stepsCompleted', { done: checkedCount, total: stepsForPokemon.length })}
        </p>
      )}
    </div>
  )
}
