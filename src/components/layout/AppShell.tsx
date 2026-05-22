'use client'

import * as React from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'motion/react'
import { usePathname } from '@/i18n/navigation'
import { useNavDirection } from '@/hooks/useNavDirection'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { BackupReminderBanner } from './BackupReminderBanner'
import { HistoryProvider } from '@/components/history/HistoryController'
import { ServiceWorkerProvider } from '@/components/layout/ServiceWorkerProvider'
import { ToastProvider } from '@/components/ui/toast'
import { GlobalShortcuts } from '@/components/layout/GlobalShortcuts'
import { AxeDevRunner } from '@/components/layout/AxeDevRunner'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const direction = useNavDirection()

  // Forward (link click / push) slides up gently; back drops down. On the very
  // first render we stay still so we don't animate the initial page.
  // prefers-reduced-motion collapses everything to a tiny opacity fade.
  const enterY = reduce ? 0 : direction === 'back' ? -8 : direction === 'forward' ? 8 : 0
  const exitY = reduce ? 0 : direction === 'back' ? 8 : -8

  return (
    <ServiceWorkerProvider>
    <ToastProvider>
    <HistoryProvider>
      <div className="flex h-svh">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <BackupReminderBanner />
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: enterY }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, y: exitY }}
                transition={reduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="min-h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
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
