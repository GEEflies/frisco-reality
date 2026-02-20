import type { Metadata } from 'next';
import PrivacyContent from '@/components/PrivacyContent';

export const metadata: Metadata = {
  title: 'Ochrana osobných údajov | Frisco Reality',
  description: 'Informácie o spracúvaní osobných údajov spoločnosťou Frisco s.r.o. v súlade s GDPR a zákonom č. 18/2018 Z. z.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
