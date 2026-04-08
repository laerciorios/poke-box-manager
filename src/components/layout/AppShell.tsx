'use client'

import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="lg:pl-56">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 pb-20 md:pb-4 lg:p-6 lg:pb-6">{children}</main>
      </div>
    </>
  )
}
