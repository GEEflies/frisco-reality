'use client';

import { Shield, Users, Award } from 'lucide-react';
import { ManifestoSection } from './ManifestoSection';

const features = [
  {
    id: '01',
    icon: Shield,
    title: 'Transparentnosť',
    description: 'Žiadne skryté poplatky, žiadne nepríjemné prekvapenia. Vždy viete, čo sa deje a aké sú ďalšie kroky. Otvorená komunikácia je pre nás samozrejmosťou.',
    stat: '100 %',
    statLabel: 'transparentnosť',
    color: 'bg-navy/5'
  },
  {
    id: '02',
    icon: Users,
    title: 'Osobný prístup',
    description: 'Každý klient má svojho realitného agenta, ktorý pozná jeho situáciu aj priority. Nie ste číslo v databáze, ale náš partner.',
    stat: 'Individuálny',
    statLabel: 'prístup ku každému klientovi',
    color: 'bg-accent-red/5'
  },
  {
    id: '03',
    icon: Award,
    title: 'Odborná expertíza',
    description: '18 rokov skúseností na lokálnom trhu nám umožňujú správne nastaviť cenu, vyjednávať podmienky a chrániť vaše záujmy.',
    stat: '18+',
    statLabel: 'rokov na trhu',
    color: 'bg-navy/5'
  }
];

export const AboutSection = () => {
  return (
    <ManifestoSection
      id="o-nas"
      label="Prečo Frisco? / Manifesto"
      title={
        <>
          My sme <br />
          <span className="text-accent-red italic font-light">FRISCO.</span>
        </>
      }
      description="Sme rodinná firma a za každým obchodom vidíme človeka, nie províziu."
      features={features}
      cta={{
        href: "/kontakt",
        text: "Zavolajte nám"
      }}
    />
  );
};
