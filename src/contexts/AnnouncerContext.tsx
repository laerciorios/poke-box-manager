'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

interface AnnouncerContextValue {
  announce: (message: string) => void
}

const AnnouncerContext = createContext<AnnouncerContextValue | null>(null)

export function AnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear then set so the same message announced twice is re-read by screen readers
  const announce = useCallback((msg: string) => {
    setMessage('')
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setMessage(msg), 50)
  }, [])

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      {/* Single polite live region — one per page prevents competing announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
    </AnnouncerContext.Provider>
  )
}

export function useAnnounce() {
  const ctx = useContext(AnnouncerContext)
  if (!ctx) throw new Error('useAnnounce must be used within AnnouncerProvider')
  return ctx.announce
}
