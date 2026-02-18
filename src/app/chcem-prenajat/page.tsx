import ChcemPrenajatContent from '@/components/ChcemPrenajatContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chcem prenajať | Frisco Reality',
  description: 'Chcete prenajať nehnuteľnosť? Pomôžeme vám nájsť ideálneho nájomcu.',
};

export default function ChcemPrenajatPage() {
  return <ChcemPrenajatContent />;
}
