import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/types/locale'

// Root path: next-intl middleware should redirect, but if it doesn't,
// fall back to the default locale.
export default function RootRedirect() {
  redirect(`/${DEFAULT_LOCALE}`)
}
