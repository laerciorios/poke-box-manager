'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PokedexSearchProps {
  value: string
  onChange: (value: string) => void
}

export function PokedexSearch({ value, onChange }: PokedexSearchProps) {
  const t = useTranslations('Pokedex')
  const [local, setLocal] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync external value changes (e.g. cleared from outside)
  useEffect(() => {
    setLocal(value)
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setLocal(next)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onChange(next)
    }, 100)
  }

  function handleClear() {
    setLocal('')
    onChange('')
  }

  return (
    <div className="relative flex items-center">
      <input
        type="search"
        value={local}
        onChange={handleChange}
        placeholder={t('searchPlaceholder')}
        className="h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      {local && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 text-muted-foreground hover:text-foreground"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
