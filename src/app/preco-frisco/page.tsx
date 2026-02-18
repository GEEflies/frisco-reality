import SluzbyContent from '@/components/SluzbyContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Služby | Frisco Reality',
  description: 'Naše služby v oblasti predaja a prenájmu nehnuteľností na Slovensku.',
};

export default function SluzbyPage() {
  return <SluzbyContent />;
}
