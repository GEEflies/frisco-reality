import KontaktContent from '@/components/KontaktContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt | Frisco Reality',
  description: 'Kontaktujte nás pre viac informácií o nehnuteľnostiach. Sme tu pre vás.',
};

export default function KontaktPage() {
  return <KontaktContent />;
}
