import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Providers } from '@/components/layout/Providers'
import { AppShell } from '@/components/layout/AppShell'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// This layout provides i18n context and the app shell (sidebar, header).
// <html> and <body> live in the root layout (app/layout.tsx) to avoid
// nested HTML elements that break React hydration.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <AppShell>{children}</AppShell>
      </Providers>
    </NextIntlClientProvider>
  )
}
