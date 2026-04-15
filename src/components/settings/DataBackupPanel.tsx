'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ImportConfirmDialog } from './ImportConfirmDialog'
import { buildExportPayload, downloadJson, exportMissingText, downloadText } from '@/lib/export/export'
import { parseImportFile, applyImportReplace, applyImportMerge, ImportValidationError } from '@/lib/import/import'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { ExportEnvelope } from '@/lib/export/types'

export function DataBackupPanel() {
  const t = useTranslations('Settings')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [pendingEnvelope, setPendingEnvelope] = useState<ExportEnvelope | null>(null)
  const [copied, setCopied] = useState(false)

  const registered = usePokedexStore((s) => s.registered)
  const locale = useSettingsStore((s) => s.locale)

  function handleExportJson() {
    downloadJson(buildExportPayload())
  }

  function handleDownloadMissingTxt() {
    const content = exportMissingText(registered, locale)
    const date = new Date().toISOString().slice(0, 10)
    downloadText(content, `missing-pokemon-${date}.txt`)
  }

  async function handleCopyMissing() {
    const content = exportMissingText(registered, locale)
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImportError(null)
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so same file can be re-selected after an error
    e.target.value = ''
    try {
      const envelope = await parseImportFile(file)
      setPendingEnvelope(envelope)
    } catch (err) {
      if (err instanceof ImportValidationError) {
        setImportError(err.message)
      } else {
        setImportError(t('importErrorGeneric'))
      }
    }
  }

  function handleReplace() {
    if (!pendingEnvelope) return
    applyImportReplace(pendingEnvelope)
    setPendingEnvelope(null)
  }

  function handleMerge() {
    if (!pendingEnvelope) return
    applyImportMerge(pendingEnvelope)
    setPendingEnvelope(null)
  }

  return (
    <div className="space-y-6">
      {/* Export JSON */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{t('exportJson')}</p>
          <p className="text-sm text-muted-foreground">
            Boxes, registrations, settings &amp; presets
          </p>
        </div>
        <Button variant="outline" onClick={handleExportJson}>
          {t('exportJson')}
        </Button>
      </div>

      {/* Export missing list */}
      <div className="space-y-2">
        <p className="font-medium">{t('exportMissingList')}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadMissingTxt}>
            {t('downloadAsTxt')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyMissing}>
            {copied ? t('copied') : t('copyToClipboard')}
          </Button>
        </div>
      </div>

      {/* Import */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-medium">{t('importData')}</p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            {t('importData')}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
        {importError && (
          <p className="text-sm text-destructive">{importError}</p>
        )}
      </div>

      {pendingEnvelope && (
        <ImportConfirmDialog
          envelope={pendingEnvelope}
          onReplace={handleReplace}
          onMerge={handleMerge}
          onClose={() => setPendingEnvelope(null)}
        />
      )}
    </div>
  )
}
