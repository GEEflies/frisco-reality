'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageProvider';
import { localePath } from '@/i18n/types';

type LocaleLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/**
 * A drop-in replacement for next/link that automatically prefixes
 * the current locale to the href. SK (default) uses bare paths,
 * en/de get a /{lang} prefix.
 */
export const LocaleLink = ({ href, ...props }: LocaleLinkProps) => {
  const { language } = useLanguage();
  return <Link href={localePath(href, language)} {...props} />;
};
