'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useSearchBar } from '@/contexts/SearchBarContext'
import { useKeyboardShortcut } from '@/contexts/KeyboardShortcutContext'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  placeholder?: string
}

export function SearchBar({ value, onChange, onFocus, placeholder = 'Search...' }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { inputRef: contextInputRef } = useSearchBar()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Local state for immediate display; context is updated after 150ms debounce
  const [localValue, setLocalValue] = useState(value)

  // Expose inputRef to context so KeyboardShortcutProvider can focus it
  useEffect(() => {
    contextInputRef.current = inputRef.current
    return () => {
      contextInputRef.current = null
    }
  })

  // Sync local value if context resets (e.g. close() clears query to '')
  useEffect(() => {
    if (value === '') setLocalValue('')
  }, [value])

  // Register Cmd/Ctrl+K and / to focus the search input
  useKeyboardShortcut('search-focus', (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus()
      }
    } else if (e.key === '/') {
      e.preventDefault()
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus()
      }
    }
  })

  // Register Escape to clear and blur search input when it's focused
  useKeyboardShortcut('search-escape', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && document.activeElement === inputRef.current) {
      onChange('')
      inputRef.current?.blur()
    }
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setLocalValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onChange(val), 150)
  }

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onFocus={onFocus}
        placeholder={placeholder}
        aria-label="Search"
        className="h-8 w-48 pl-8 pr-16 text-sm lg:w-64"
      />
      <kbd className="pointer-events-none absolute right-2 hidden select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground sm:flex">
        <span>⌘</span>K
      </kbd>
    </div>
  )
}
