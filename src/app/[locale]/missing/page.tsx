import { getTranslations } from 'next-intl/server'

export default async function MissingPage() {
  const t = await getTranslations('Missing')
  return (
    <div>
      <h1 className="text-2xl font-bold">{t('pageTitle')}</h1>
      <p className="mt-2 text-muted-foreground">{t('pageSubtitle')}</p>
    </div>
  )
}
