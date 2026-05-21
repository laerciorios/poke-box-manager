'use client'

import { Home, Grid3x3, BookOpen, BarChart3, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', labelKey: 'home', icon: Home },
  { href: '/boxes', labelKey: 'boxes', icon: Grid3x3 },
  { href: '/pokedex', labelKey: 'pokedex', icon: BookOpen },
  { href: '/stats', labelKey: 'stats', icon: BarChart3 },
  { href: '/settings', labelKey: 'settings', icon: Settings },
] as const

export function MobileNav() {
  const t = useTranslations('Layout.nav')
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md"
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium',
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--muted-foreground)]',
                )}
              >
                <Icon className="size-5" />
                <span>{t(item.labelKey)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
