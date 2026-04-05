import type { TypeEntry } from '../../types/game'
import { extractNames } from './names'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function normalizeType(typeData: any): TypeEntry {
  return {
    id: typeData.id,
    name: typeData.name,
    names: extractNames(typeData.names ?? [], typeData.name),
  }
}
