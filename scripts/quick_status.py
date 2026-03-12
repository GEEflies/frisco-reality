"""Quick status check."""
import urllib.request, json, ssl

SUPABASE_URL = "https://fcvswlurtchqorgnwclw.supabase.co"
ANON_KEY = "***REDACTED_SUPABASE_ANON_KEY***"

ctx = ssl.create_default_context()

url = f"{SUPABASE_URL}/rest/v1/listing_images?select=id,enhancement_status,has_baked_logo&order=created_at.asc"
req = urllib.request.Request(url, headers={
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}"
})
images = json.loads(urllib.request.urlopen(req, context=ctx).read().decode())

by_status = {}
for img in images:
    s = img["enhancement_status"]
    by_status[s] = by_status.get(s, 0) + 1

baked = sum(1 for i in images if i.get("has_baked_logo") is True)
clean = sum(1 for i in images if i.get("has_baked_logo") is False)
null_logo = sum(1 for i in images if i.get("has_baked_logo") is None)

print(f"Total: {len(images)}")
for s, c in sorted(by_status.items()):
    print(f"  {s}: {c}")
print(f"Logo: baked={baked}, clean={clean}, null={null_logo}")
