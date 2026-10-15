import type { Metadata } from 'next';
import PrivacyContent from '@/components/PrivacyContent';
import { SITE_URL } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Ochrana osobných údajov',
  description: 'Zásady spracúvania osobných údajov spoločnosti FRISCO, s.r.o. v súlade s GDPR a zákonom č. 18/2018 Z. z. Informácie o vašich právach, príjemcoch údajov a technológiách webovej stránky.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/ochrana-osobnych-udajov` },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
