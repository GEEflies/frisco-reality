'use client';

import { Shield, Users, Award } from 'lucide-react';
import { ManifestoSection } from './ManifestoSection';
import { useLanguage } from '@/i18n/LanguageProvider';
import { ABOUT_COPY } from '@/i18n/copy';

export const AboutSection = () => {
  const { language } = useLanguage();
  const copy = ABOUT_COPY[language];
  const features = [
    {
      ...copy.features[0],
      icon: Shield,
      color: 'bg-navy/5'
    },
    {
      ...copy.features[1],
      icon: Users,
      color: 'bg-accent-red/5'
    },
    {
      ...copy.features[2],
      icon: Award,
      color: 'bg-navy/5'
    }
  ];

  return (
    <ManifestoSection
      id="o-nas"
      label={copy.label}
      title={
        <>
          {copy.titleLine1} <br />
          <span className="text-accent-red italic font-light">{copy.titleAccent}</span>
        </>
      }
      description={copy.description}
      features={features}
      cta={{
        href: "/kontakt",
        text: copy.cta
      }}
    />
  );
};
