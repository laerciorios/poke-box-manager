import type { VariationToggles } from '@/types/settings'
import { TOGGLE_FORM_TYPES } from '@/lib/variation-counts'

// Reverse map: FormType string → keyof VariationToggles
export const FORM_TYPE_TO_TOGGLE_KEY = new Map<string, keyof VariationToggles>()
for (const [key, types] of Object.entries(TOGGLE_FORM_TYPES) as [
  keyof VariationToggles,
  string[],
][]) {
  for (const type of types) {
    FORM_TYPE_TO_TOGGLE_KEY.set(type, key)
  }
}
