import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { MainListings } from '@/components/MainListings';
import { AboutSection } from '@/components/AboutSection';
import { ProcessSection } from '@/components/ProcessSection';
import { FamilyBusinessSection } from '@/components/FamilyBusinessSection';
import { ContactSection } from '@/components/ContactSection';

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <div className="animate-in fade-in duration-700">
        <HeroSection />
        <MainListings />
        <AboutSection />

        <ProcessSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
