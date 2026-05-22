'use client'

import * as React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { BackupReminderBanner } from './BackupReminderBanner'
import { HistoryProvider } from '@/components/history/HistoryController'
import { ServiceWorkerProvider } from '@/components/layout/ServiceWorkerProvider'
import { ToastProvider } from '@/components/ui/toast'
import { GlobalShortcuts } from '@/components/layout/GlobalShortcuts'
import { AxeDevRunner } from '@/components/layout/AxeDevRunner'

/**
 * App chrome (sidebar + header + mobile nav + global providers).
 *
 * Page transitions live in `app/[locale]/template.tsx`, not here. Wrapping
 * `children` in `AnimatePresence mode="wait"` with `key={pathname}` raced
 * the Next App Router's `children` swap and could leave the page blank on
 * the second navigation. The template.tsx pattern is the App-Router-native
 * way to do enter animations.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ServiceWorkerProvider>
      <ToastProvider>
        <HistoryProvider>
          <div className="flex h-svh">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <BackupReminderBanner />
              <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
            </div>
            <MobileNav />
          </div>
          <GlobalShortcuts />
          <AxeDevRunner />
        </HistoryProvider>
      </ToastProvider>
    </ServiceWorkerProvider>
  )
}
