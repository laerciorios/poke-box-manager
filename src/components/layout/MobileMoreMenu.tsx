'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { MoreHorizontal, Search, Settings, Layers } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type NavKey = 'missing' | 'settings' | 'presets'

const moreItems: { href: string; key: NavKey; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: '/missing', key: 'missing', icon: Search },
  { href: '/settings', key: 'settings', icon: Settings },
  { href: '/presets', key: 'presets', icon: Layers },
]

export function MobileMoreMenu() {
  const router = useRouter()
  const t = useTranslations('Layout.nav')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-col items-center gap-1 rounded-md px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
        <MoreHorizontal className="h-5 w-5" />
        {t('more')}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end">
        {moreItems.map((item) => (
          <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
            <item.icon className="h-4 w-4" />
            {t(item.key)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
