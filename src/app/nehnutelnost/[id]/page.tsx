import PropertyDetailContent from '@/components/PropertyDetailContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detail nehnuteľnosti | Frisco Reality',
  description: 'Podrobné informácie o nehnuteľnosti.',
};

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  return <PropertyDetailContent id={id} />;
}
