'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  Home,
  Grid3x3,
  BookOpen,
  BarChart3,
  Layers,
  Search,
  Settings,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  labelKey: keyof Messages
  icon: React.ComponentType<{ className?: string }>
}

type Messages = {
  home: string
  boxes: string
  pokedex: string
  stats: string
  presets: string
  missing: string
  settings: string
}

const items: NavItem[] = [
  { href: '/', labelKey: 'home', icon: Home },
  { href: '/boxes', labelKey: 'boxes', icon: Grid3x3 },
  { href: '/pokedex', labelKey: 'pokedex', icon: BookOpen },
  { href: '/stats', labelKey: 'stats', icon: BarChart3 },
  { href: '/presets', labelKey: 'presets', icon: Layers },
  { href: '/missing', labelKey: 'missing', icon: Search },
  { href: '/settings', labelKey: 'settings', icon: Settings },
]

export function Sidebar() {
  const t = useTranslations('Layout.nav')
  const tApp = useTranslations('Layout')
  const pathname = usePathname()
  const reduce = useReducedMotion()

  const activeIndex = items.findIndex((i) => {
    if (i.href === '/') return pathname === '/' || pathname === ''
    return pathname.startsWith(i.href)
  })

  return (
    <aside
      className="hidden md:flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[var(--border)]">
        <div className="grid grid-cols-2 gap-0.5 size-7">
          <span className="rounded-[3px] bg-[var(--accent)]" />
          <span className="rounded-[3px] bg-[var(--shiny)]" />
          <span className="rounded-[3px] bg-[var(--registered)]" />
          <span className="rounded-[3px] bg-[var(--muted-foreground)]" />
        </div>
        <span className="font-display text-base font-semibold tracking-tight">
          {tApp('appName')}
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 relative">
        {items.map((item, idx) => {
          const Icon = item.icon
          const isActive = idx === activeIndex
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-md px-3 h-9 text-sm font-medium',
                'transition-colors duration-150 ease-out',
                isActive
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-md bg-[var(--accent-soft)]"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 380, damping: 30 }
                  }
                  aria-hidden
                />
              )}
              <Icon className="size-4 shrink-0 relative z-10" />
              <span className="relative z-10">{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)]">
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)] mb-1">
            {tApp('localFirst')}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] leading-snug">
            {tApp('localFirstHint')}
          </p>
        </div>
      </div>
    </aside>
  )
}
