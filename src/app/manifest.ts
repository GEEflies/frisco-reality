import type { MetadataRoute } from 'next';
import { buildManifest } from '@/config/manifest';

// Slovak manifest (static). EN/DE: app/[lang]/manifest.webmanifest/route.ts.
export default function manifest(): MetadataRoute.Manifest {
  return buildManifest('sk');
}
