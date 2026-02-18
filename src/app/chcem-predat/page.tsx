import ChcemPredatContent from '@/components/ChcemPredatContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chcem predať | Frisco Reality',
  description: 'Chcete predať nehnuteľnosť? Postaráme sa o všetko za vás.',
};

export default function ChcemPredatPage() {
  return <ChcemPredatContent />;
}
