/**
 * External Image Loader — uses images.weserv.nl (free, open-source CDN)
 *
 * WHY: Vercel Hobby plan has tight Image Optimization limits (300K cache reads/year).
 * Using next/image with the DEFAULT loader would burn through those limits fast
 * with ~12 listings × ~20 photos each × page views.
 *
 * This loader routes all listing image optimization through weserv.nl instead:
 * - Automatic WebP conversion (60-80% smaller than JPEG/PNG)
 * - Responsive resizing (browser downloads only the size it needs)
 * - CDN caching (fast globally after first request)
 * - Zero Vercel Image Optimization cost
 *
 * weserv.nl has been free & reliable since 2012, used by millions of sites.
 * If it ever goes down, images just won't load optimized — not a hard dependency.
 *
 * Usage: <Image loader={listingImageLoader} src={url} ... />
 */

interface ImageLoaderParams {
    src: string;
    width: number;
    quality?: number;
}

export default function listingImageLoader({ src, width, quality }: ImageLoaderParams): string {
    // Don't proxy local/relative URLs (e.g. /frisco-logo-hq.png) — those go through Vercel normally
    if (src.startsWith('/') || src.startsWith('data:')) {
        return src;
    }

    const q = quality || 75;

    // weserv.nl params:
    // w     = target width (height auto-calculated to preserve aspect ratio)
    // q     = quality (1-100)
    // output = format conversion (webp)
    // we    = without enlargement (don't upscale small images beyond original size)
    // il    = interlace/progressive (renders blurry preview first, then sharpens)
    return `https://images.weserv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${q}&output=webp&we&il`;
}

/**
 * Build the weserv.nl URL for a given source, width, and quality.
 * Useful for preloading images at the exact same URL that next/image will request.
 */
export function buildWeservUrl(src: string, width: number, quality = 75): string {
    if (src.startsWith('/') || src.startsWith('data:')) return src;
    return `https://images.weserv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${quality}&output=webp&we&il`;
}

/**
 * Generate a tiny blur placeholder URL for skeleton/shimmer loading.
 * Returns a 20px-wide, heavily compressed WebP — typically < 1KB.
 */
export function blurUrl(src: string): string {
    if (src.startsWith('/') || src.startsWith('data:')) return src;
    return `https://images.weserv.nl/?url=${encodeURIComponent(src)}&w=20&q=20&output=webp&blur=5`;
}
