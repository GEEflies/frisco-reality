#!/usr/bin/env node

/**
 * One-time migration: Copy enhanced images from Supabase Storage → Cloudflare R2
 *
 * This script:
 * 1. Lists all files in the Supabase `enhanced-images` bucket
 * 2. Downloads each file
 * 3. Uploads to Cloudflare R2 with the same path
 * 4. Updates `enhanced_url` in the database to point to R2
 *
 * No re-enhancement needed — images are already processed.
 *
 * Prerequisites:
 *   - Set these env vars in .env.local (or export them):
 *     NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *     R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *     R2_BUCKET_NAME, R2_PUBLIC_URL
 *
 * Usage:
 *   node scripts/migrate-to-r2.mjs
 *   node scripts/migrate-to-r2.mjs --dry-run    # Preview without uploading
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createHmac, createHash } from 'crypto';

// ---- Load .env.local ----
function loadEnv() {
    try {
        const envPath = resolve(process.cwd(), '.env.local');
        const content = readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx === -1) continue;
            const key = trimmed.slice(0, eqIdx).trim();
            const value = trimmed.slice(eqIdx + 1).trim();
            if (!process.env[key]) process.env[key] = value;
        }
    } catch {
        // .env.local not found — rely on exported env vars
    }
}
loadEnv();

// ---- Config ----
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'frisco-images';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const DRY_RUN = process.argv.includes('--dry-run');

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
    console.error('Missing R2 credentials. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- AWS Signature V4 for R2 ----
function hmacSha256(key, message) {
    return createHmac('sha256', key).update(message).digest();
}

function sha256Hex(data) {
    return createHash('sha256').update(data).digest('hex');
}

async function uploadToR2(path, body, contentType) {
    const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const region = 'auto';
    const service = 's3';
    const method = 'PUT';
    const now = new Date();
    const dateStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dateOnly = dateStamp.slice(0, 8);
    const scope = `${dateOnly}/${region}/${service}/aws4_request`;

    const bodyBuffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
    const payloadHash = sha256Hex(bodyBuffer);

    const headers = {
        'Host': `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        'Content-Type': contentType,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': dateStamp,
        'Cache-Control': 'public, max-age=31536000, immutable',
    };

    const signedHeaderKeys = Object.keys(headers).sort().map(k => k.toLowerCase());
    const signedHeaders = signedHeaderKeys.join(';');
    const canonicalHeaders = signedHeaderKeys.map(k =>
        `${k}:${headers[Object.keys(headers).find(h => h.toLowerCase() === k)]}`
    ).join('\n') + '\n';
    const canonicalUri = `/${R2_BUCKET_NAME}/${path}`;
    const canonicalRequest = [method, canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');

    const canonicalRequestHash = sha256Hex(canonicalRequest);
    const stringToSign = ['AWS4-HMAC-SHA256', dateStamp, scope, canonicalRequestHash].join('\n');

    let signingKey = Buffer.from(`AWS4${R2_SECRET_ACCESS_KEY}`);
    for (const part of [dateOnly, region, service, 'aws4_request']) {
        signingKey = hmacSha256(signingKey, part);
    }

    const signature = hmacSha256(signingKey, stringToSign).toString('hex');
    const authorization = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY_ID}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const response = await fetch(`${endpoint}/${R2_BUCKET_NAME}/${path}`, {
        method,
        headers: { ...headers, 'Authorization': authorization },
        body: bodyBuffer,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`R2 upload failed (${response.status}): ${errorText}`);
    }

    return `${R2_PUBLIC_URL}/${path}`;
}

// ---- Main migration ----
async function main() {
    console.log(`\n🔄 Migrating enhanced images from Supabase Storage → Cloudflare R2`);
    console.log(`   Supabase: ${SUPABASE_URL}`);
    console.log(`   R2 Public: ${R2_PUBLIC_URL}`);
    console.log(`   Bucket: ${R2_BUCKET_NAME}`);
    if (DRY_RUN) console.log(`   ⚠️  DRY RUN — no uploads or DB changes\n`);

    // 1. List all files in the enhanced-images bucket
    console.log('\n📂 Listing files in Supabase enhanced-images bucket...');
    const { data: files, error: listError } = await supabase.storage
        .from('enhanced-images')
        .list('enhanced', { limit: 10000, sortBy: { column: 'name', order: 'asc' } });

    if (listError) {
        console.error('Failed to list files:', listError.message);
        process.exit(1);
    }

    if (!files || files.length === 0) {
        console.log('No files found in enhanced-images bucket. Nothing to migrate.');
        return;
    }

    console.log(`Found ${files.length} files to migrate.\n`);

    // 2. Get all listing_images with Supabase enhanced_url for batch DB update
    const { data: dbImages, error: dbError } = await supabase
        .from('listing_images')
        .select('id, enhanced_url')
        .like('enhanced_url', '%/storage/v1/object/public/enhanced-images/%');

    if (dbError) {
        console.error('Failed to query listing_images:', dbError.message);
        process.exit(1);
    }

    console.log(`Found ${dbImages?.length || 0} database records with Supabase URLs to update.\n`);

    // Build a map of Supabase path → image IDs for quick lookup
    const pathToDbIds = new Map();
    for (const img of dbImages || []) {
        // Extract path from Supabase URL: ...enhanced-images/enhanced/uuid.jpeg → enhanced/uuid.jpeg
        const match = img.enhanced_url?.match(/enhanced-images\/(.+)$/);
        if (match) {
            pathToDbIds.set(match[1], img.id);
        }
    }

    // 3. Migrate each file
    let migrated = 0;
    let failed = 0;
    let dbUpdated = 0;

    for (const file of files) {
        const supabasePath = `enhanced/${file.name}`;
        const r2Path = supabasePath;

        try {
            // Download from Supabase
            const { data: fileData, error: dlError } = await supabase.storage
                .from('enhanced-images')
                .download(supabasePath);

            if (dlError || !fileData) {
                throw new Error(`Download failed: ${dlError?.message || 'no data'}`);
            }

            const buffer = Buffer.from(await fileData.arrayBuffer());
            const contentType = file.metadata?.mimetype || 'image/jpeg';

            if (DRY_RUN) {
                console.log(`  [DRY] Would upload ${supabasePath} (${(buffer.length / 1024).toFixed(0)} KB)`);
            } else {
                // Upload to R2
                const r2Url = await uploadToR2(r2Path, buffer, contentType);
                console.log(`  ✅ ${supabasePath} → ${r2Url} (${(buffer.length / 1024).toFixed(0)} KB)`);

                // Update database if this path has a matching record
                const dbId = pathToDbIds.get(supabasePath);
                if (dbId) {
                    const { error: updateError } = await supabase
                        .from('listing_images')
                        .update({ enhanced_url: r2Url })
                        .eq('id', dbId);

                    if (updateError) {
                        console.warn(`  ⚠️  DB update failed for ${dbId}: ${updateError.message}`);
                    } else {
                        dbUpdated++;
                    }
                }
            }

            migrated++;
        } catch (err) {
            console.error(`  ❌ Failed: ${supabasePath} — ${err.message}`);
            failed++;
        }
    }

    // Summary
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Migration complete!`);
    console.log(`  Files migrated: ${migrated}`);
    console.log(`  Files failed:   ${failed}`);
    console.log(`  DB rows updated: ${dbUpdated}`);
    if (DRY_RUN) console.log(`\n  ⚠️  DRY RUN — no actual changes were made`);
    console.log();
}

main().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
