'use client'

import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SHORTCUT_REGISTRY } from '@/lib/shortcuts'

interface ShortcutHelpOverlayProps {
  open: boolean
  onClose: () => void
}

export function ShortcutHelpOverlay({ open, onClose }: ShortcutHelpOverlayProps) {
  const t = useTranslations('ui')

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('shortcuts.title')}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 py-2">
          {SHORTCUT_REGISTRY.map(({ keyLabel, descriptionKey }) => (
            <div key={descriptionKey} className="contents">
              <kbd className="flex items-center justify-center rounded border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {keyLabel}
              </kbd>
              <span className="flex items-center text-sm">{t(descriptionKey as Parameters<typeof t>[0])}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
