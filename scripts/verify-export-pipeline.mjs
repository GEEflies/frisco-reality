#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const delimiterIndex = line.indexOf('=');
    if (delimiterIndex <= 0) continue;
    const key = line.slice(0, delimiterIndex).trim();
    const value = line.slice(delimiterIndex + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const cwd = process.cwd();
loadEnvFile(path.join(cwd, '.env.local'));
loadEnvFile(path.join(cwd, '.env'));

const DEFAULT_SITE_URL = process.env.SITE_URL || 'https://frisco.sk';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const UC_WEBHOOK_USER = process.env.UC_WEBHOOK_USER;
const UC_WEBHOOK_PASS = process.env.UC_WEBHOOK_PASS;
const VERIFY_INTERNAL = process.env.VERIFY_INTERNAL === 'true';
const DEFAULT_IMPORT_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/import-listings` : '';
const WEBHOOK_URL = VERIFY_INTERNAL
  ? (process.env.UC_INTERNAL_IMPORT_URL || DEFAULT_IMPORT_URL)
  : (process.env.UC_WEBHOOK_URL || `${DEFAULT_SITE_URL}/api/uc-import`);
const TEST_COUNT = Number(process.env.VERIFY_LISTING_COUNT || 12);
const POLL_INTERVAL_MS = Number(process.env.VERIFY_POLL_INTERVAL_MS || 5000);
const MAX_WAIT_MS = Number(process.env.VERIFY_MAX_WAIT_MS || 180000);
const CLEANUP = process.env.VERIFY_CLEANUP !== 'false';

const REQUIRED_ENV = [
  ['NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL', SUPABASE_URL],
  ['NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY', SUPABASE_ANON_KEY],
  ['UC_WEBHOOK_USER', UC_WEBHOOK_USER],
  ['UC_WEBHOOK_PASS', UC_WEBHOOK_PASS],
];

const missing = REQUIRED_ENV.filter(([, value]) => !value).map(([key]) => key);
if (missing.length > 0) {
  console.error('Missing required environment variables:');
  for (const key of missing) console.error(`- ${key}`);
  process.exit(1);
}

function logStep(message) {
  console.log(`\n[verify] ${message}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} from ${url} -> ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  }
  return body;
}

function buildRestUrl(table, query = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function supabaseSelect(table, query) {
  return fetchJson(buildRestUrl(table, query), {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
}

async function invokeUcImport(dataObj) {
  return fetchJson(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: UC_WEBHOOK_USER,
      pass: UC_WEBHOOK_PASS,
      action: 1,
      data: JSON.stringify(dataObj),
    }),
  });
}

function statusCounts(rows) {
  const counts = {};
  for (const row of rows) {
    const key = row.enhancement_status || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

async function main() {
  const runId = `verify-${Math.floor(Date.now() / 1000)}`;
  const baseObjectId = Math.floor(Date.now() / 1000);
  const objectIds = Array.from({ length: TEST_COUNT }, (_, index) => baseObjectId + index);
  const createdObjectIds = [];

  logStep(`Starting export pipeline verification (${TEST_COUNT} listings)`);
  logStep(`Mode: ${VERIFY_INTERNAL ? 'internal (direct Supabase function)' : 'public webhook (site API route)'}`);
  logStep(`Webhook URL: ${WEBHOOK_URL}`);

  try {
    logStep('Creating test listings through UC export webhook');

    for (let index = 0; index < objectIds.length; index++) {
      const objectId = objectIds[index];
      const payload = {
        object_id: objectId,
        id: `${runId}-${index + 1}`,
        deleted: 0,
        state_id: 1,
        county_id: 1,
        district_id: 1,
        region_id: 1,
        street_id: 1,
        street: `Verification Street ${index + 1}`,
        street_number: `${index + 1}`,
        action: index % 2 === 0 ? 1 : 3,
        category: 4,
        agent_id: 'verify-agent',
        title: `VERIFY Listing ${index + 1}`,
        description: `Verification listing ${index + 1} for Gemini enhancement pipeline`,
        status: 1,
        price: 100000 + index * 1000,
        price_unit: 1,
        price_currency: 1,
        images: [
          { url: `https://picsum.photos/seed/${runId}-${index + 1}-a/1280/853.jpg`, changed: true },
          { url: `https://picsum.photos/seed/${runId}-${index + 1}-b/1280/853.jpg`, changed: true },
        ],
      };

      const response = await invokeUcImport(payload);
      if (![1, 2].includes(response?.code)) {
        throw new Error(`Import failed for object_id=${objectId}: ${JSON.stringify(response)}`);
      }
      createdObjectIds.push(objectId);
      process.stdout.write(`.`);
    }

    process.stdout.write('\n');
    logStep(`Imported ${createdObjectIds.length} test listings`);

    logStep('Verifying listings were written to database');
    const listingRows = await supabaseSelect('listings', {
      select: 'id,uc_object_id,slug,status,is_deleted,action',
      uc_object_id: `in.(${createdObjectIds.join(',')})`,
      order: 'uc_object_id.asc',
    });

    if (listingRows.length !== createdObjectIds.length) {
      throw new Error(`Expected ${createdObjectIds.length} listings, found ${listingRows.length}`);
    }

    const invalidListings = listingRows.filter((row) => row.status !== 1 || row.is_deleted || !row.slug || ![1, 3].includes(row.action));
    if (invalidListings.length > 0) {
      throw new Error(`Listings failed homepage/filter readiness checks: ${JSON.stringify(invalidListings)}`);
    }

    const listingIds = listingRows.map((row) => row.id);

    logStep('Waiting for Gemini enhancement pipeline to finish');
    const deadline = Date.now() + MAX_WAIT_MS;
    let imageRows = [];

    while (Date.now() < deadline) {
      const trigger = await fetchJson(`${SUPABASE_URL}/functions/v1/process-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      imageRows = await supabaseSelect('listing_images', {
        select: 'id,listing_id,enhancement_status,enhanced_url,upscaled_url,original_url',
        listing_id: `in.(${listingIds.join(',')})`,
      });

      if (imageRows.length === 0) {
        await sleep(POLL_INTERVAL_MS);
        continue;
      }

      const counts = statusCounts(imageRows);
      const pending = counts.pending || 0;
      const processing = counts.processing || 0;
      const completed = counts.completed || 0;
      const failed = counts.failed || 0;

      console.log(`[verify] status: ${JSON.stringify(counts)}; worker: ${JSON.stringify(trigger)}`);

      if (pending === 0 && processing === 0) {
        if (failed > 0) {
          throw new Error(`Enhancement finished with failures (${failed}/${imageRows.length})`);
        }
        if (completed !== imageRows.length) {
          throw new Error(`Expected all images completed, got completed=${completed}, total=${imageRows.length}`);
        }
        break;
      }

      await sleep(POLL_INTERVAL_MS);
    }

    if (imageRows.length === 0) {
      throw new Error('No listing_images rows created for imported listings');
    }

    const notEnhanced = imageRows.filter((row) => !row.enhanced_url && !row.upscaled_url);
    if (notEnhanced.length > 0) {
      throw new Error(`Some images have no enhanced/upscaled URL after processing: ${notEnhanced.length}`);
    }

    const detailReadyByListing = new Map();
    for (const row of imageRows) {
      const hasEnhanced = Boolean(row.upscaled_url || row.enhanced_url || row.original_url);
      detailReadyByListing.set(row.listing_id, (detailReadyByListing.get(row.listing_id) || 0) || hasEnhanced);
    }

    const missingDetailImages = listingIds.filter((id) => !detailReadyByListing.get(id));
    if (missingDetailImages.length > 0) {
      throw new Error(`Detail page image readiness failed for listing IDs: ${missingDetailImages.join(', ')}`);
    }

    logStep('PASS: export import + Gemini enhancement + listing/readiness checks are all green');
  } finally {
    if (CLEANUP && createdObjectIds.length > 0) {
      logStep(`Cleaning up ${createdObjectIds.length} verification listings`);
      for (const objectId of createdObjectIds) {
        try {
          await invokeUcImport({ object_id: objectId, deleted: 1 });
        } catch (error) {
          console.warn(`[verify] cleanup warning for object_id=${objectId}: ${error.message}`);
        }
      }
    }
  }
}

main().catch((error) => {
  console.error(`\n[verify] FAIL: ${error.message}`);
  process.exit(1);
});
