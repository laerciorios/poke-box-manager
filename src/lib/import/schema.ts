import type { ExportEnvelope } from '@/lib/export/types'

export class ImportValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ImportValidationError'
  }
}

export function validateExportSchema(parsed: unknown): ExportEnvelope {
  if (typeof parsed !== 'object' || parsed === null) {
    throw new ImportValidationError('File is not a valid JSON object.')
  }

  const obj = parsed as Record<string, unknown>

  if (obj.app !== 'poke-box-manager') {
    throw new ImportValidationError(
      'This file was not exported from Poke Box Manager.',
    )
  }

  if (typeof obj.version !== 'number') {
    throw new ImportValidationError('Missing or invalid "version" field.')
  }

  if (typeof obj.exportedAt !== 'string') {
    throw new ImportValidationError('Missing or invalid "exportedAt" field.')
  }

  if (typeof obj.data !== 'object' || obj.data === null) {
    throw new ImportValidationError('Missing "data" section.')
  }

  const data = obj.data as Record<string, unknown>

  if (!Array.isArray(data.boxes)) {
    throw new ImportValidationError('"data.boxes" must be an array.')
  }

  if (!Array.isArray(data.registered)) {
    throw new ImportValidationError('"data.registered" must be an array.')
  }

  if (!Array.isArray(data.presets)) {
    throw new ImportValidationError('"data.presets" must be an array.')
  }

  if (typeof data.settings !== 'object' || data.settings === null) {
    throw new ImportValidationError('"data.settings" must be an object.')
  }

  // Spot-check first box
  if (data.boxes.length > 0) {
    const firstBox = data.boxes[0] as Record<string, unknown>
    if (typeof firstBox.id !== 'string') {
      throw new ImportValidationError('First box is missing a string "id" field.')
    }
    if (!Array.isArray(firstBox.slots) || firstBox.slots.length !== 30) {
      throw new ImportValidationError('First box must have a "slots" array of length 30.')
    }
  }

  return parsed as ExportEnvelope
}
