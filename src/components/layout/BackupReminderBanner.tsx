'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { buildExportPayload, downloadJson } from '@/lib/export/export'

const PENDING_THRESHOLD = 20
const BACKUP_STALE_DAYS = 7

function isBackupStale(lastBackup?: string): boolean {
  if (!lastBackup) return true
  const last = new Date(lastBackup).getTime()
  const now = Date.now()
  return now - last > BACKUP_STALE_DAYS * 24 * 60 * 60 * 1000
}

export function BackupReminderBanner() {
  const t = useTranslations('Settings')
  const [dismissed, setDismissed] = useState(false)

  const pendingChanges = useSettingsStore((s) => s.pendingChanges)
  const lastBackup = useSettingsStore((s) => s.lastBackup)

  const shouldShow =
    !dismissed &&
    pendingChanges >= PENDING_THRESHOLD &&
    isBackupStale(lastBackup)

  if (!shouldShow) return null

  function handleExport() {
    downloadJson(buildExportPayload())
    setDismissed(true)
  }

  return (
    <div className="flex items-center gap-3 border-b bg-amber-500/10 px-4 py-2 text-sm text-amber-700 dark:text-amber-400">
      <span className="flex-1">
        <span className="font-semibold">{t('backupReminderTitle')}</span>{' '}
        {t('backupReminderDescription', { count: pendingChanges })}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0 border-amber-500/50 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400"
        onClick={handleExport}
      >
        {t('backupReminderExportNow')}
      </Button>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-amber-700/60 hover:text-amber-700 dark:text-amber-400/60 dark:hover:text-amber-400"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
