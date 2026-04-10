'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarCollapsed = useSettingsStore((s) => s.sidebarCollapsed)

  return (
    <>
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div
        className={cn(
          'lg:transition-[padding-left] lg:duration-[var(--transition-normal)] lg:ease-in-out',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56',
        )}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 pb-20 md:pb-4 lg:p-6 lg:pb-6">{children}</main>
      </div>
    </>
  )
}
