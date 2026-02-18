import { Suspense } from 'react';
import { Footer } from '@/components/Footer';
import { PropertiesSection } from '@/components/PropertiesSection';
import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ponuka nehnuteľností | Frisco Reality',
  description: 'Prezrite si našu aktuálnu ponuku nehnuteľností na predaj a prenájom na Slovensku.',
};

export default function Ponuka() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="animate-in fade-in duration-500">
        <div className="pt-20">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-navy/20" />
            </div>
          }>
            <PropertiesSection />
          </Suspense>
        </div>
        <Footer />
      </div>
    </main>
  );
}
