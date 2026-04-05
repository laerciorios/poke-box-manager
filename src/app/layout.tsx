import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/layout/Providers'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn('h-full antialiased font-sans', inter.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <Sidebar />
          <div className="lg:pl-56">
            <Header />
            <main className="p-4 pb-20 lg:p-6 lg:pb-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
