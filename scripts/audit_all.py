#!/usr/bin/env python3
"""Audit all listings and images in the database."""
import urllib.request, json

ANON_KEY = "***REDACTED_SUPABASE_ANON_KEY***"
BASE = "https://fcvswlurtchqorgnwclw.supabase.co/rest/v1"

def api_get(path):
    req = urllib.request.Request(f"{BASE}/{path}", headers={
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {ANON_KEY}",
    })
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())

# Get all listings
listings = api_get("listings?select=id,title,uc_object_id&order=created_at")
print(f"=== LISTINGS ({len(listings)}) ===")
for l in listings:
    print(f"  {l['id'][:8]}... | UC={l.get('uc_object_id','?')} | {(l.get('title') or 'No title')[:50]}")

# Get all images grouped by status
images = api_get("listing_images?select=id,listing_id,sort_order,enhancement_status,has_baked_logo,retry_count&order=listing_id,sort_order")
print(f"\n=== IMAGES ({len(images)}) ===")

# Group by listing
by_listing = {}
for img in images:
    lid = img["listing_id"]
    if lid not in by_listing:
        by_listing[lid] = []
    by_listing[lid].append(img)

for lid, imgs in by_listing.items():
    listing_title = next((l.get("title", "?") for l in listings if l["id"] == lid), "?")
    total = len(imgs)
    completed = sum(1 for i in imgs if i["enhancement_status"] == "completed")
    pending = sum(1 for i in imgs if i["enhancement_status"] == "pending")
    failed = sum(1 for i in imgs if i["enhancement_status"] == "failed")
    processing = sum(1 for i in imgs if i["enhancement_status"] == "processing")
    logo_true = sum(1 for i in imgs if i.get("has_baked_logo") is True)
    logo_false = sum(1 for i in imgs if i.get("has_baked_logo") is False)
    logo_null = sum(1 for i in imgs if i.get("has_baked_logo") is None)
    print(f"\n  Listing: {lid[:8]}... | {(listing_title or '?')[:40]}")
    print(f"    Images: {total} | completed={completed} pending={pending} failed={failed} processing={processing}")
    print(f"    Logo:   baked={logo_true} clean={logo_false} unknown={logo_null}")

# Summary
print(f"\n=== SUMMARY ===")
total = len(images)
completed = sum(1 for i in images if i["enhancement_status"] == "completed")
pending = sum(1 for i in images if i["enhancement_status"] == "pending")
failed = sum(1 for i in images if i["enhancement_status"] == "failed")
print(f"Total images: {total}")
print(f"Completed: {completed} | Pending: {pending} | Failed: {failed}")
print(f"Logo baked: {sum(1 for i in images if i.get('has_baked_logo') is True)}")
print(f"Logo clean: {sum(1 for i in images if i.get('has_baked_logo') is False)}")
print(f"Logo unknown: {sum(1 for i in images if i.get('has_baked_logo') is None)}")
