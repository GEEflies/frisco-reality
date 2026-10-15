import type { Metadata } from 'next';
import PrivacyContent from '@/components/PrivacyContent';
import { buildLanguageAlternates, resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';

const COPY: Record<LanguageCode, { title: string; description: string }> = {
  sk: {
    title: 'Ochrana osobných údajov',
    description: 'Zásady spracúvania osobných údajov spoločnosti FRISCO, s.r.o. v súlade s GDPR a zákonom č. 18/2018 Z. z. Informácie o vašich právach, príjemcoch údajov a technológiách webovej stránky.',
  },
  en: {
    title: 'Privacy policy',
    description: 'How FRISCO, s.r.o. processes personal data under the GDPR: your rights, data recipients, retention periods and the technologies this website uses.',
  },
  de: {
    title: 'Datenschutzerklärung',
    description: 'Wie die FRISCO, s.r.o. personenbezogene Daten gemäß DSGVO verarbeitet: Ihre Rechte, Empfänger, Speicherfristen und die auf dieser Website eingesetzten Technologien.',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveServerLanguage();
  const copy = COPY[language];

  return {
    title: copy.title,
    description: copy.description,
    robots: { index: true, follow: true },
    alternates: buildLanguageAlternates('/ochrana-osobnych-udajov', language),
  };
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
