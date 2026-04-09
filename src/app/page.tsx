// This file exists to satisfy Turbopack's requirement that every layout.tsx
// has a corresponding page.tsx. In practice, the proxy (src/proxy.ts) always
// redirects the root path "/" to "/{defaultLocale}" before this page renders.
import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/types/locale'

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`)
}
