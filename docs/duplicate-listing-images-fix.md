# Duplicate listing images — root cause & fix (2026-07-24)

## Symptom

The listing [predame-2-izbovy-bezbarierovy-byt-v-seredi-meander-3469003414](https://www.frisco.sk/nehnutelnost/predame-2-izbovy-bezbarierovy-byt-v-seredi-meander-3469003414)
showed **22 photos instead of 12**. Each photo appeared twice — once as a proper
full-size image and once as a broken low-quality thumbnail (6–10 KB). A second
listing, `4013066567` ("Predáme záhradu s chatkou v Seredi"), was affected the
same way (32 rows for 16 photos).

## Root cause

UC's Export API returns a **fresh, opaque image URL on every scrape**. Both the
path token (e.g. `tySSa0rb8_fss` → `GgGMlnE0H_fss`) and the `st=`/`ts=` signature
rotate each time, so the same photo never has a stable URL across imports.

The `import-listings` edge function deduped incoming images by `original_url`
(`existingByUrl.get(img.url)`). Because that URL is never stable, the lookup never
matched on a re-import, so **every re-import re-inserted the entire photo set** as
"new" rows. There was also **no database constraint** to catch it.

Listing `3469003414` was pushed by UC ~4 times in one day, stacking the duplicates.
The earliest scrape happened to capture broken thumbnail-sized originals for photos
1–9, which is why the duplicates looked like "low-quality" copies.

## The fix (three layers)

### 1. Data cleanup (one-time)

`scripts/dedupe_listing_images.py` (local, gitignored) removes duplicate rows,
keeping the best row per `(listing_id, sort_order)`:

1. Prefer a completed **enhanced** row (never delete Gemini-credit work).
2. Otherwise keep the **largest original** file (drops broken thumbnails).
3. Deterministic tiebreak: earliest `created_at`.

Dry-run by default; `--apply` to execute. Run again anytime duplicates reappear:

```bash
cd slovak-luxury-living-next/scripts
python3 dedupe_listing_images.py            # preview plan for all listings
python3 dedupe_listing_images.py --apply    # execute
python3 dedupe_listing_images.py 3469003414 # scope to one uc_object_id
```

Result on 2026-07-24: `3469003414` 22 → 12 photos, `4013066567` 32 → 16 photos.

### 2. Import function — dedupe by position, not URL

`supabase/functions/import-listings/index.ts` (`handleImages`) now matches existing
images by **position (`sort_order`)** instead of the unstable `original_url`:

- Position already in DB **and enhanced** → left untouched (keeps enhanced version).
- Position already in DB but **not yet enhanced** → refresh `original_url` to the
  newest signed URL, so the enhancement cron fetches a valid (often higher-quality)
  source. This **self-heals** broken/low-res originals from an earlier scrape.
- New position (listing gained a photo) → insert as `pending`.
- Images UC stops sending are intentionally **not** deleted (preserves enhanced work).

### 3. Database backstop — unique index

Migration `supabase/migrations/20260724130000_unique_listing_image_position.sql`
(also in `supabase/schema.sql`):

```sql
CREATE UNIQUE INDEX idx_listing_images_listing_position
    ON listing_images (listing_id, sort_order);
```

A listing can now hold **at most one row per photo position**. Even if the
application logic ever regresses, the database physically rejects the duplicate.
(Existing duplicates must be cleaned first, or the index creation fails — which is
also a useful invariant check.)

## Deployment (done 2026-07-24)

```bash
supabase link --project-ref fcvswlurtchqorgnwclw
supabase functions deploy import-listings   # ships layer 2
supabase db push                            # ships layer 3
```

## Known residual edge case

Position-based dedup assumes UC keeps photos in a **stable order** between scrapes
(the same assumption the sort logic already relied on). If UC ever reorders a
listing's photos, an already-enhanced image could map to a different photo. The
failure direction is safe: because of the unique index, a bad import can at most
**skip** a photo — it can never **duplicate** one. No duplicates or low-quality
copies can recur.
