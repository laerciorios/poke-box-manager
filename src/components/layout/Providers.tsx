'use client'

import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SearchProvider } from '@/contexts/SearchContext'
import { KeyboardShortcutProvider, useKeyboardShortcut } from '@/contexts/KeyboardShortcutContext'
import { ModalStackProvider, useModalStack } from '@/contexts/ModalStackContext'
import { SearchBarProvider } from '@/contexts/SearchBarContext'
import { AnnouncerProvider } from '@/contexts/AnnouncerContext'

// Registers Escape → close top modal (lower priority than search-escape in SearchBar)
function EscapeModalShortcut() {
  const { closeTop } = useModalStack()
  useKeyboardShortcut('escape-modal', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeTop()
    }
  })
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <KeyboardShortcutProvider>
          <ModalStackProvider>
            <EscapeModalShortcut />
            <AnnouncerProvider>
              <SearchBarProvider>
                <SearchProvider>{children}</SearchProvider>
              </SearchBarProvider>
            </AnnouncerProvider>
          </ModalStackProvider>
        </KeyboardShortcutProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
