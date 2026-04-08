'use client'

import { useRouter } from 'next/navigation'
import { MoreHorizontal, Search, Settings, Layers } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const moreItems = [
  { href: '/missing', label: 'Missing', icon: Search },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/presets', label: 'Presets', icon: Layers },
]

export function MobileMoreMenu() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-col items-center gap-1 rounded-md px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
        <MoreHorizontal className="h-5 w-5" />
        More
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end">
        {moreItems.map((item) => (
          <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
