'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  placeholder?: string
}

export function SearchBar({ value, onChange, onFocus, placeholder = 'Search...' }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Local state for immediate display; context is updated after 150ms debounce
  const [localValue, setLocalValue] = useState(value)

  // Sync local value if context resets (e.g. close() clears query to '')
  useEffect(() => {
    if (value === '') setLocalValue('')
  }, [value])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        if (document.activeElement !== inputRef.current) {
          e.preventDefault()
          inputRef.current?.focus()
        }
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onChange('')
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onChange])

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
