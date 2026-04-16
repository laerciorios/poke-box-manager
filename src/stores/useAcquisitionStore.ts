import { createPersistedStore } from '@/lib/store'

interface AcquisitionState {
  /** pokemonId → array of checked step indices */
  checkedSteps: Record<number, number[]>
  toggleStep: (pokemonId: number, stepIndex: number) => void
  clearChecklist: (pokemonId: number) => void
  isStepChecked: (pokemonId: number, stepIndex: number) => boolean
}

export const useAcquisitionStore = createPersistedStore<AcquisitionState>(
  'acquisition',
  (set, get) => ({
    checkedSteps: {},

    toggleStep: (pokemonId, stepIndex) => {
      const current = get().checkedSteps[pokemonId] ?? []
      const next = current.includes(stepIndex)
        ? current.filter((i) => i !== stepIndex)
        : [...current, stepIndex]
      set({ checkedSteps: { ...get().checkedSteps, [pokemonId]: next } })
    },

    clearChecklist: (pokemonId) => {
      const { [pokemonId]: _, ...rest } = get().checkedSteps
      set({ checkedSteps: rest })
    },

    isStepChecked: (pokemonId, stepIndex) => {
      return (get().checkedSteps[pokemonId] ?? []).includes(stepIndex)
    },
  }),
  { version: 1 },
)
