'use client'

import { useTranslations } from 'next-intl'
import { Grid3X3, Search, BarChart3, Settings } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'

const ACTIONS = [
  { key: 'goToBoxes', icon: Grid3X3, href: '/boxes' },
  { key: 'goToMissing', icon: Search, href: '/missing' },
  { key: 'goToStats', icon: BarChart3, href: '/stats' },
  { key: 'goToSettings', icon: Settings, href: '/settings' },
] as const

export function QuickActions() {
  const t = useTranslations('Home')
  const router = useRouter()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map(({ key, icon: Icon, href }) => (
        <button
          key={key}
          onClick={() => router.push(href)}
          className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 hover:bg-muted transition-colors focus:outline-none focus:bg-muted"
        >
          <Icon className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm font-medium">{t(key)}</span>
        </button>
      ))}
    </div>
  )
}
