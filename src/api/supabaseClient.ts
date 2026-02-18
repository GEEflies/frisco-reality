/**
 * Supabase Client Configuration
 * Provides database and storage access
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create the Supabase client or a mock if credentials are missing (for build time)
export const supabase = isSupabaseConfigured && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => ({ data: [], error: null }),
            insert: () => ({ data: [], error: null }),
            update: () => ({ data: [], error: null }),
            delete: () => ({ data: [], error: null }),
            upload: () => ({ data: [], error: null }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
            eq: () => ({ data: [], error: null, select: () => ({ data: [], error: null }) }),
            order: () => ({ data: [], error: null }),
        }),
        storage: {
            from: () => ({
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
                upload: () => ({ data: null, error: null }),
            })
        }
    } as any;

// Storage bucket names
export const STORAGE_BUCKETS = {
    ENHANCED_IMAGES: 'enhanced-images',
    ORIGINAL_IMAGES: 'original-images',
} as const;

// Get public URL for a storage file
export const getStorageUrl = (bucket: string, path: string): string => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
};
