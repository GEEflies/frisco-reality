"""
Batch re-enhancement: Reset ALL listing images to 'pending' so the cron
picks them up and re-enhances with the new "Erase ALL text" prompt.

This is safe because:
- enhanced_url is kept until overwritten by a new enhancement
- The site still shows the old enhanced image while re-processing
- The cron processes 1 image/minute (BATCH_SIZE=1)
- ~227 images ≈ ~4 hours to complete
"""
import urllib.request, json, ssl

SUPABASE_URL = "https://fcvswlurtchqorgnwclw.supabase.co"
ANON_KEY = "***REDACTED_SUPABASE_ANON_KEY***"

ctx = ssl.create_default_context()

def api(method, path, body=None, params=None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    if params:
        url += "?" + "&".join(f"{k}={v}" for k, v in params.items())
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal" if method == "PATCH" else "return=representation",
    })
    resp = urllib.request.urlopen(req, context=ctx)
    if method == "PATCH":
        return None
    return json.loads(resp.read().decode())

# 1. Count all images
images = api("GET", "listing_images", params={
    "select": "id,enhancement_status,has_baked_logo",
    "order": "created_at.asc",
})

total = len(images)
baked = sum(1 for i in images if i.get("has_baked_logo") is True)
clean = sum(1 for i in images if i.get("has_baked_logo") is False)
null_logo = sum(1 for i in images if i.get("has_baked_logo") is None)
pending = sum(1 for i in images if i["enhancement_status"] == "pending")
processing = sum(1 for i in images if i["enhancement_status"] == "processing")

print(f"Total images: {total}")
print(f"  has_baked_logo=true:  {baked}")
print(f"  has_baked_logo=false: {clean}")
print(f"  has_baked_logo=null:  {null_logo}")
print(f"  Already pending:      {pending}")
print(f"  Currently processing: {processing}")
print()

# 2. Reset all completed images to pending for re-enhancement
# Keep enhanced_url so the site still works during re-processing
completed_ids = [i["id"] for i in images if i["enhancement_status"] == "completed"]

if not completed_ids:
    print("No completed images to re-enhance!")
    exit(0)

print(f"Resetting {len(completed_ids)} completed images to 'pending'...")
print("(enhanced_url kept — site still shows old images during re-processing)")
print()

# Batch reset in chunks of 50 (URL length limit)
CHUNK = 50
for i in range(0, len(completed_ids), CHUNK):
    chunk = completed_ids[i:i+CHUNK]
    id_filter = ",".join(chunk)
    url = f"{SUPABASE_URL}/rest/v1/listing_images?id=in.({id_filter})"
    data = json.dumps({
        "enhancement_status": "pending",
        "has_baked_logo": None,
        "retry_count": 0,
    }).encode()
    req = urllib.request.Request(url, data=data, method="PATCH", headers={
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    })
    urllib.request.urlopen(req, context=ctx)
    print(f"  Reset batch {i//CHUNK + 1}: {len(chunk)} images")

print()
print(f"Done! {len(completed_ids)} images reset to 'pending'.")
print(f"The cron (1/min) will re-enhance them automatically.")
print(f"Estimated time: ~{len(completed_ids)} minutes ({len(completed_ids)/60:.1f} hours)")
print()
print("Monitor progress with: python3 scripts/monitor_progress.py")
