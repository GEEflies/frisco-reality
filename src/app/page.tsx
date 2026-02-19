import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/HeroSection';

const MainListings = dynamic(() => import('@/components/MainListings').then(mod => mod.MainListings));
const AboutSection = dynamic(() => import('@/components/AboutSection').then(mod => mod.AboutSection));
const ProcessSection = dynamic(() => import('@/components/ProcessSection').then(mod => mod.ProcessSection));
const ContactSection = dynamic(() => import('@/components/ContactSection').then(mod => mod.ContactSection));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <HeroSection />
      <MainListings />
      <AboutSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
