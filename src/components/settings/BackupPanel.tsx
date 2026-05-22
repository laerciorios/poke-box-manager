'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Download, Upload, FileJson, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { buildExportPayload, downloadJson } from '@/lib/export/export'
import { parseImportFile, applyImportReplace, applyImportMerge, ImportValidationError } from '@/lib/import/import'
import type { ExportEnvelope } from '@/lib/export/types'
import { useToast } from '@/components/ui/toast'

export function BackupPanel() {
  const t = useTranslations('Settings.backup')
  const tCommon = useTranslations('Common')
  const tToast = useTranslations('Toasts')
  const { push } = useToast()
  const lastBackup = useSettingsStore((s) => s.lastBackup)

  const [importing, setImporting] = React.useState(false)
  const [parsed, setParsed] = React.useState<ExportEnvelope | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const handleExport = () => {
    downloadJson(buildExportPayload())
    push({ title: tToast('backupDownloaded'), variant: 'success' })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const envelope = await parseImportFile(file)
      setParsed(envelope)
      setError(null)
    } catch (err) {
      const message = err instanceof ImportValidationError ? err.message : 'Unexpected error'
      setError(t('invalidFile', { error: message }))
      setParsed(null)
    }
  }

  const formatDate = (iso?: string) => {
    if (!iso) return null
    try {
      return new Date(iso).toLocaleString()
    } catch {
      return iso
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--muted-foreground)]">
        {lastBackup ? t('lastBackup', { date: formatDate(lastBackup) ?? '—' }) : t('neverBackup')}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleExport}>
          <Download className="size-4" />
          {t('export')}
        </Button>
        <Button variant="outline" onClick={() => setImporting(true)}>
          <Upload className="size-4" />
          {t('import')}
        </Button>
      </div>

      <Dialog
        open={importing}
        onClose={() => {
          setImporting(false)
          setParsed(null)
          setError(null)
        }}
        title={t('import')}
        description={t('importDescription')}
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setImporting(false)
                setParsed(null)
                setError(null)
              }}
            >
              {tCommon('cancel')}
            </Button>
            {parsed && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    applyImportMerge(parsed)
                    setImporting(false)
                    setParsed(null)
                    push({ title: tToast('importMerged'), variant: 'success' })
                  }}
                >
                  {t('merge')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm(t('replaceConfirm'))) {
                      applyImportReplace(parsed)
                      setImporting(false)
                      setParsed(null)
                      push({ title: tToast('importReplaced'), variant: 'success' })
                    }
                  }}
                >
                  {t('replace')}
                </Button>
              </>
            )}
          </>
        }
      >
        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />
          {!parsed ? (
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <FileJson className="size-4" />
              {t('selectFile')}
            </Button>
          ) : (
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)]/30 p-3 space-y-1.5 text-sm">
              <SummaryRow label={t('summaryBoxes')} value={parsed.data.boxes.length} />
              <SummaryRow label={t('summaryRegistered')} value={parsed.data.registered.length} />
              <SummaryRow label={t('summaryPresets')} value={parsed.data.presets.length} />
              <p className="text-xs text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)] mt-2">
                {t('exportedAt', { date: formatDate(parsed.exportedAt) ?? '—' })}
              </p>
            </div>
          )}
          {error && (
            <div className="rounded-md border border-[var(--destructive)]/40 bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)] p-3 text-xs text-[var(--destructive)] flex items-start gap-2">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  )
}
