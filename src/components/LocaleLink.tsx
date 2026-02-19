'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageProvider';

type LocaleLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/**
 * A drop-in replacement for next/link that automatically prefixes
 * the current locale to the href. Use for all internal links.
 */
export const LocaleLink = ({ href, ...props }: LocaleLinkProps) => {
  const { language } = useLanguage();
  const localizedHref = href === '/' ? `/${language}` : `/${language}${href}`;
  return <Link href={localizedHref} {...props} />;
};
