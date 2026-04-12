import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { MissingPokemonScreen } from '@/components/missing/MissingPokemonScreen'

export default async function MissingPage() {
  const t = await getTranslations('Missing')

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">{t('pageTitle')}</h1>
        <p className="mt-1 text-muted-foreground">{t('pageSubtitle')}</p>
      </div>
      <Suspense fallback={null}>
        <MissingPokemonScreen />
      </Suspense>
    </div>
  )
}
