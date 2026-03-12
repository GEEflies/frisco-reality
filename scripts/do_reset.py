"""Call the reset_all_for_reenhancement RPC to reset all images."""
import urllib.request, json, ssl

SUPABASE_URL = "https://fcvswlurtchqorgnwclw.supabase.co"
ANON_KEY = "***REDACTED_SUPABASE_ANON_KEY***"

ctx = ssl.create_default_context()

url = f"{SUPABASE_URL}/rest/v1/rpc/reset_all_for_reenhancement"
data = json.dumps({}).encode()
req = urllib.request.Request(url, data=data, method="POST", headers={
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
})

try:
    resp = urllib.request.urlopen(req, context=ctx)
    result = resp.read().decode()
    print(f"Reset result: {result} images")
except Exception as e:
    if hasattr(e, 'read'):
        print(f"Error: {e.read().decode()}")
    else:
        print(f"Error: {e}")
