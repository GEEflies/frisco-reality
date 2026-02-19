import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/seo';
import { supabase, isSupabaseConfigured } from '@/api/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

const buildAlternates = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withLanguagePrefix = (language: 'sk' | 'en' | 'de') => {
    if (normalized === '/') return `${SITE_URL}/${language}`;
    return `${SITE_URL}/${language}${normalized}`;
  };

  return {
    languages: {
      sk: withLanguagePrefix('sk'),
      en: withLanguagePrefix('en'),
      de: withLanguagePrefix('de'),
    },
  };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/sk`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: buildAlternates('/'),
    },
    {
      url: `${SITE_URL}/sk/ponuka`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: buildAlternates('/ponuka'),
    },
    {
      url: `${SITE_URL}/sk/predaj-a-prenajom`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: buildAlternates('/predaj-a-prenajom'),
    },
    {
      url: `${SITE_URL}/sk/chcem-predat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: buildAlternates('/chcem-predat'),
    },
    {
      url: `${SITE_URL}/sk/chcem-prenajat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: buildAlternates('/chcem-prenajat'),
    },
    {
      url: `${SITE_URL}/sk/preco-frisco`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: buildAlternates('/preco-frisco'),
    },
    {
      url: `${SITE_URL}/sk/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: buildAlternates('/kontakt'),
    },
  ];

  // Dynamic listing pages from Supabase
  let listingPages: MetadataRoute.Sitemap = [];

  if (isSupabaseConfigured) {
    try {
      const { data: listings, error } = await supabase
        .from('listings')
        .select('id, slug, updated_at')
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      if (!error && listings) {
        listingPages = listings.map((listing: { id: string; slug: string | null; updated_at: string }) => ({
          url: `${SITE_URL}/sk/nehnutelnost/${listing.slug || listing.id}`,
          lastModified: new Date(listing.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
          alternates: buildAlternates(`/nehnutelnost/${listing.slug || listing.id}`),
        }));
      }
    } catch (error) {
      console.error('[sitemap] Error fetching listings:', error);
    }
  }

  return [...staticPages, ...listingPages];
}
