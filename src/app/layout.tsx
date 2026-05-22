import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
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

const display = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PokéBox · Planeje suas boxes do Pokémon Home',
  description:
    'Companion offline-first para colecionadores. Organize boxes 6×5, registre Pokémon, e acompanhe sua Pokédex sem sair do navegador.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'PokéBox',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const locale = (headersList.get('x-next-intl-locale') ?? DEFAULT_LOCALE) as Locale

  return (
    <html
      lang={locale}
      data-theme="dark"
      className={cn(
        'h-full antialiased',
        inter.variable,
        display.variable,
        jetbrainsMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  )
}
