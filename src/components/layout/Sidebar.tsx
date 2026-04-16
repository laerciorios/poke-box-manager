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
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { MobileMoreMenu } from './MobileMoreMenu'

type NavKey = 'home' | 'boxes' | 'pokedex' | 'stats' | 'missing' | 'settings' | 'presets'

const navItems: { href: string; key: NavKey; icon: React.ComponentType<{ className?: string }> }[] =
  [
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
  collapsed?: boolean
  onNavigate?: () => void
}

function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const t = useTranslations('Layout.nav')
  const tA11y = useTranslations('accessibility')

  return (
    <nav className="flex flex-1 flex-col gap-1" aria-label={tA11y('nav')}>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const label = t(item.key)
        const linkClassName = cn(
          'flex items-center rounded-md py-2 text-sm font-medium transition-colors',
          collapsed ? 'justify-center px-2' : 'gap-3 px-3',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )

        if (collapsed) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={linkClassName}
                    aria-label={label}
                  />
                }
              >
                <item.icon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={linkClassName}
            aria-label={label}
          >
            <item.icon className="h-4 w-4" />
            {label}
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
  const tLayout = useTranslations('Layout')
  const tSidebar = useTranslations('Layout.sidebar')
  const tA11y = useTranslations('accessibility')
  const appName = tLayout('appName')
  const sidebarCollapsed = useSettingsStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useSettingsStore((s) => s.toggleSidebar)
  const isCollapsed = sidebarCollapsed
  const toggleLabel = isCollapsed ? tSidebar('expand') : tSidebar('collapse')

  return (
    <>
      {/* Desktop sidebar — fixed, visible at lg+ */}
      <aside
        className={cn(
          'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col lg:transition-[width] lg:duration-[var(--transition-normal)] lg:ease-in-out lg:motion-reduce:transition-none',
          isCollapsed ? 'lg:w-16' : 'lg:w-56',
        )}
      >
        <div
          className={cn(
            'flex grow flex-col gap-y-4 overflow-y-auto border-r border-border bg-surface py-6 transition-[padding] duration-[var(--transition-normal)] ease-in-out motion-reduce:transition-none',
            isCollapsed ? 'px-2' : 'px-4',
          )}
        >
          <div className={cn('flex px-2', isCollapsed ? 'justify-center' : 'items-center gap-2')}>
            <Grid3X3 className="h-6 w-6 text-accent" />
            {!isCollapsed && <span className="text-lg font-semibold">{appName}</span>}
          </div>
          <SidebarNav collapsed={isCollapsed} />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  onClick={toggleSidebar}
                  aria-label={toggleLabel}
                  className={cn(
                    'mt-auto',
                    isCollapsed ? 'justify-center px-0' : 'justify-start gap-2 px-3',
                  )}
                />
              }
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
              {!isCollapsed && <span>{toggleLabel}</span>}
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">{toggleLabel}</TooltipContent>}
          </Tooltip>
        </div>
      </aside>

      {/* Tablet Sheet sidebar — visible at md to lg via hamburger */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-56 p-0">
          <SheetTitle className="sr-only">{tA11y('nav')}</SheetTitle>
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
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border bg-surface py-2 md:hidden" aria-label={tA11y('mobileNav')}>
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
