'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { LanguageSwitch } from './LanguageSwitch'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [search, setSearch] = useState('')

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger: tablet only (md to lg) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="hidden md:flex lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <SearchBar value={search} onChange={setSearch} />
      </div>
      <div className="flex items-center gap-1">
        <LanguageSwitch />
        <ThemeToggle />
      </div>
    </header>
  )
}
