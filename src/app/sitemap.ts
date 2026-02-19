import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/seo';
import { supabase, isSupabaseConfigured } from '@/api/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/ponuka`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/predaj-a-prenajom`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/chcem-predat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/chcem-prenajat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/preco-frisco`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
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
          url: `${SITE_URL}/nehnutelnost/${listing.slug || listing.id}`,
          lastModified: new Date(listing.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
      }
    } catch (error) {
      console.error('[sitemap] Error fetching listings:', error);
    }
  }

  return [...staticPages, ...listingPages];
}
