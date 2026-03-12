"""Monitor re-enhancement progress. Run periodically to check status."""
import urllib.request, json, ssl
from datetime import datetime

SUPABASE_URL = "https://fcvswlurtchqorgnwclw.supabase.co"
ANON_KEY = "***REDACTED_SUPABASE_ANON_KEY***"

ctx = ssl.create_default_context()

images = json.loads(urllib.request.urlopen(
    urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/listing_images?select=id,enhancement_status,has_baked_logo,retry_count&order=created_at.asc",
        headers={"apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}"}
    ), context=ctx
).read().decode())

total = len(images)
by_status = {}
for img in images:
    s = img["enhancement_status"]
    by_status[s] = by_status.get(s, 0) + 1

baked = sum(1 for i in images if i.get("has_baked_logo") is True)
clean = sum(1 for i in images if i.get("has_baked_logo") is False)
null_logo = sum(1 for i in images if i.get("has_baked_logo") is None)

completed = by_status.get("completed", 0)
pending = by_status.get("pending", 0)
processing = by_status.get("processing", 0)
failed = by_status.get("failed", 0)

pct = (completed / total * 100) if total > 0 else 0

print(f"=== Re-enhancement Progress ({datetime.now().strftime('%H:%M:%S')}) ===")
print(f"Total:      {total}")
print(f"Completed:  {completed} ({pct:.0f}%)")
print(f"Pending:    {pending}")
print(f"Processing: {processing}")
print(f"Failed:     {failed}")
print()
print(f"Logo detection:")
print(f"  baked=true:  {baked}")
print(f"  baked=false: {clean}")
print(f"  not scanned: {null_logo}")

if pending > 0:
    print(f"\nEstimated remaining: ~{pending} min ({pending/60:.1f} hours)")

perm_failed = sum(1 for i in images if i["enhancement_status"] == "failed" and i.get("retry_count", 0) >= 3)
if perm_failed:
    print(f"\n⚠️  {perm_failed} permanently failed (retry_count >= 3)")
