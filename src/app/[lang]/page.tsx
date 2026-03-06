import { notFound } from 'next/navigation';
import Home from '@/app/page';
import { isLanguageCode } from '@/i18n/types';

export function generateStaticParams() {
  return [{ lang: 'sk' }, { lang: 'en' }, { lang: 'de' }];
}

export default async function LanguageHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLanguageCode(lang)) {
    notFound();
  }

  return <Home />;
}