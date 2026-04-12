'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { LanguageSwitch } from './LanguageSwitch'
import { SearchResults } from '@/components/search/SearchResults'
import { useSearch } from '@/contexts/SearchContext'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { query, setQuery, open } = useSearch()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
      <div className="relative flex items-center gap-3">
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
        <SearchBar
          value={query}
          onChange={setQuery}
          onFocus={() => { if (query) open() }}
        />
        <SearchResults />
      </div>
      <div className="flex items-center gap-1">
        <LanguageSwitch />
        <ThemeToggle />
      </div>
    </header>
  )
}
