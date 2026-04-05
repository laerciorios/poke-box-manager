import type { GameEntry } from '../../types/game'
import { extractNames } from './names'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function normalizeGame(versionData: any): GameEntry {
  const versionGroupUrl: string = versionData.version_group?.url ?? ''
  const versionGroupId = extractId(versionGroupUrl)
  const generationUrl: string = versionData.version_group?.url ?? ''

  return {
    id: versionData.name,
    name: versionData.name,
    names: extractNames(versionData.names ?? [], versionData.name),
    generation: 0, // Will be enriched from version-group data
    versionGroupId,
  }
}

export function enrichGameWithGeneration(
  game: GameEntry,
  versionGroupData: any,
): GameEntry {
  const generationUrl: string = versionGroupData.generation?.url ?? ''
  const generation = extractGenerationNumber(generationUrl)
  return { ...game, generation }
}

function extractId(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? parseInt(match[1], 10) : 0
}

function extractGenerationNumber(url: string): number {
  const match = url.match(/\/generation\/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}
