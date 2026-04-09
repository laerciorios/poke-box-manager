import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import { cn } from '@/lib/utils'
import { DEFAULT_LOCALE } from '@/types/locale'
import type { Locale } from '@/types/locale'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pokemon Box Manager',
  description: 'Manage your Pokemon Home boxes and track Pokedex completion',
}

// Root layout owns <html> and <body> — required by Next.js App Router to avoid
// nested HTML elements that break React hydration (see design.md §1).
//
// The locale is read from the "x-next-intl-locale" header that src/proxy.ts
// injects on every request, so we get the correct lang attribute without
// duplicating locale logic in this layout.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const locale = (headersList.get('x-next-intl-locale') ?? DEFAULT_LOCALE) as Locale

  return (
    <html
      lang={locale}
      className={cn('h-full antialiased font-sans', inter.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
