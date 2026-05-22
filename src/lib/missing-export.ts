import type { MissingEntry } from '@/lib/missing-pokemon'

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function isoToday(): string {
  return new Date().toISOString().slice(0, 10)
}

export function exportMissingJson(entries: MissingEntry[]) {
  const payload = {
    exportedAt: new Date().toISOString(),
    count: entries.length,
    entries,
  }
  download(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    `pokebox-missing-${isoToday()}.json`,
  )
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportMissingCsv(entries: MissingEntry[]) {
  const header = ['id', 'formKey', 'name', 'types', 'generation', 'category']
  const lines = [header.join(',')]
  for (const entry of entries) {
    lines.push(
      [
        String(entry.id),
        entry.formKey,
        csvEscape(entry.name),
        csvEscape(entry.types.join('|')),
        String(entry.generation),
        entry.category,
      ].join(','),
    )
  }
  // BOM so Excel reads UTF-8 correctly.
  download(
    new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }),
    `pokebox-missing-${isoToday()}.csv`,
  )
}
