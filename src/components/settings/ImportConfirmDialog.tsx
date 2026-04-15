'use client'

import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { ExportEnvelope } from '@/lib/export/types'

interface ImportConfirmDialogProps {
  envelope: ExportEnvelope
  onReplace: () => void
  onMerge: () => void
  onClose: () => void
}

export function ImportConfirmDialog({
  envelope,
  onReplace,
  onMerge,
  onClose,
}: ImportConfirmDialogProps) {
  const t = useTranslations('Settings')

  const exportedDate = new Date(envelope.exportedAt).toLocaleString()
  const boxCount = envelope.data.boxes.length
  const registeredCount = envelope.data.registered.length
  const presetCount = envelope.data.presets.length

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('importConfirmTitle')}</DialogTitle>
          <DialogDescription>{t('importConfirmDescription')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-1 rounded-md border p-3 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{t('importMetaExportedAt')}:</span>{' '}
            {exportedDate}
          </p>
          <p className="text-muted-foreground">
            {t('importMetaBoxes', { count: boxCount })}
          </p>
          <p className="text-muted-foreground">
            {t('importMetaRegistered', { count: registeredCount })}
          </p>
          <p className="text-muted-foreground">
            {t('importMetaPresets', { count: presetCount })}
          </p>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose}>
            {t('importCancel')}
          </Button>
          <Button variant="outline" onClick={onMerge}>
            {t('importMerge')}
          </Button>
          <Button variant="destructive" onClick={onReplace}>
            {t('importReplace')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
