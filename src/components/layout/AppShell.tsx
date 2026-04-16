'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useKeyboardShortcut } from '@/contexts/KeyboardShortcutContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BackupReminderBanner } from './BackupReminderBanner'
import { ShortcutHelpOverlay } from './ShortcutHelpOverlay'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const sidebarCollapsed = useSettingsStore((s) => s.sidebarCollapsed)

  useKeyboardShortcut('help-overlay', (e: KeyboardEvent) => {
    if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      setHelpOpen((prev) => !prev)
    }
  })

  return (
    <>
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div
        className={cn(
          'lg:transition-[padding-left] lg:duration-[var(--transition-normal)] lg:ease-in-out lg:motion-reduce:transition-none',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56',
        )}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <BackupReminderBanner />
        <main className="p-4 pb-20 md:pb-4 lg:p-6 lg:pb-6">{children}</main>
      </div>
      <ShortcutHelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}
