'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Cloud, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { buildExportPayload, downloadJson } from '@/lib/export/export'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
const DISMISSED_KEY = 'pbm:backup-banner-dismissed'

export function BackupReminderBanner() {
  const t = useTranslations('BackupBanner')
  const pendingChanges = useSettingsStore((s) => s.pendingChanges)
  const lastBackup = useSettingsStore((s) => s.lastBackup)
  const reduce = useReducedMotion()
  const [dismissedAt, setDismissedAt] = React.useState<number | null>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const raw = window.localStorage.getItem(DISMISSED_KEY)
    if (raw) {
      const n = Number(raw)
      if (!Number.isNaN(n)) setDismissedAt(n)
    }
  }, [])

  React.useEffect(() => {
    const compute = () => {
      if (pendingChanges <= 5) return setVisible(false)
      const now = Date.now()
      if (lastBackup && now - new Date(lastBackup).getTime() < SEVEN_DAYS_MS) return setVisible(false)
      if (dismissedAt && now - dismissedAt < SEVEN_DAYS_MS) return setVisible(false)
      setVisible(true)
    }
    compute()
    const id = window.setInterval(compute, 60_000)
    return () => window.clearInterval(id)
  }, [pendingChanges, lastBackup, dismissedAt])

  const dismiss = () => {
    const now = Date.now()
    window.localStorage.setItem(DISMISSED_KEY, String(now))
    setDismissedAt(now)
  }

  const handleBackup = () => {
    downloadJson(buildExportPayload())
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="border-b border-[var(--border)] bg-[color-mix(in_oklch,var(--warning)_10%,var(--background))]"
        >
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <Cloud className="size-4 mt-0.5 text-[var(--warning)] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{t('title', { count: pendingChanges })}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{t('subtitle')}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="accent" onClick={handleBackup}>
                {t('backupNow')}
              </Button>
              <Button size="sm" variant="ghost" onClick={dismiss} aria-label={t('later')}>
                <X className="size-3.5" />
                <span className="hidden sm:inline">{t('later')}</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
