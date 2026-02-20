import type { Metadata } from 'next';
import CookiesContent from '@/components/CookiesContent';

export const metadata: Metadata = {
  title: 'Cookies | Frisco Reality',
  description: 'Informácie o používaní súborov cookies na webovej stránke Frisco Reality.',
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return <CookiesContent />;
}
