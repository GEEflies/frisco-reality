import PredajAPrenajomContent from '@/components/PredajAPrenajomContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Predaj a Prenájom | Frisco Reality',
  description: 'Informácie o predaji a prenájme nehnuteľností s Frisco Reality.',
};

export default function PredajAPrenajomPage() {
  return <PredajAPrenajomContent />;
}
