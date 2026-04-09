'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import {
  Home,
  Grid3X3,
  BookOpen,
  BarChart3,
  Search,
  Settings,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { MobileMoreMenu } from './MobileMoreMenu'

type NavKey = 'home' | 'boxes' | 'pokedex' | 'stats' | 'missing' | 'settings' | 'presets'

const navItems: { href: string; key: NavKey; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: '/', key: 'home', icon: Home },
  { href: '/boxes', key: 'boxes', icon: Grid3X3 },
  { href: '/pokedex', key: 'pokedex', icon: BookOpen },
  { href: '/stats', key: 'stats', icon: BarChart3 },
  { href: '/missing', key: 'missing', icon: Search },
  { href: '/settings', key: 'settings', icon: Settings },
  { href: '/presets', key: 'presets', icon: Layers },
]

const primaryNavItems = navItems.slice(0, 4)

interface SidebarNavProps {
  onNavigate?: () => void
}

function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const t = useTranslations('Layout.nav')
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <item.icon className="h-4 w-4" />
            {t(item.key)}
          </Link>
        )
      })}
    </nav>
  )
}

interface SidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sidebar({ open = false, onOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const tNav = useTranslations('Layout.nav')

  return (
    <>
      {/* Desktop sidebar — fixed, visible at lg+ */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-56 lg:flex-col">
        <div className="flex grow flex-col gap-y-4 overflow-y-auto border-r border-border bg-surface px-4 py-6">
          <div className="flex items-center gap-2 px-2">
            <Grid3X3 className="h-6 w-6 text-accent" />
            <span className="text-lg font-semibold">PokeBox</span>
          </div>
          <SidebarNav />
        </div>
      </aside>

      {/* Tablet Sheet sidebar — visible at md to lg via hamburger */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-56 p-0">
          <div className="flex grow flex-col gap-y-4 overflow-y-auto px-4 py-6">
            <div className="flex items-center gap-2 px-2">
              <Grid3X3 className="h-6 w-6 text-accent" />
              <span className="text-lg font-semibold">PokeBox</span>
            </div>
            <SidebarNav onNavigate={() => onOpenChange?.(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile bottom nav — hidden at md+ (tablet uses Sheet, desktop uses fixed sidebar) */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border bg-surface py-2 md:hidden">
        {primaryNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md px-3 py-1 text-xs transition-colors',
                isActive ? 'text-accent' : 'text-muted-foreground',
              )}
            >
              <item.icon className="h-5 w-5" />
              {tNav(item.key)}
            </Link>
          )
        })}
        <MobileMoreMenu />
      </nav>
    </>
  )
}
