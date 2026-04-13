import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { PokedexPage } from '@/components/pokedex/PokedexPage'

export async function generateMetadata() {
  const t = await getTranslations('Pokedex')
  return {
    title: t('pageTitle'),
    description: t('pageSubtitle'),
  }
}

export default async function Page() {
  const t = await getTranslations('Pokedex')
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">{t('pageTitle')}</h1>
        <p className="mt-1 text-muted-foreground">{t('pageSubtitle')}</p>
      </div>
      <Suspense fallback={null}>
        <PokedexPage />
      </Suspense>
    </div>
  )
}
