#!/usr/bin/env python3
"""Quick test: can the Gemini API assess one of this listing's images?"""
import urllib.request
import json
import base64
import time

img_url = (
    "https://img.unitedclassifieds.sk/foto/"
    "ZmlsdGVyczp3YXRlcm1hcmsocHVzLzYxd1NFT1o2al9mc3MsLTUsLTUsMCwzMCwzMCkvanVs/"
    "UqX7DTKz1_fss?st=kSRT0rWECHRUqU5XgRUP7eKlhMQchrqDlrKsPQ78t34&ts=1773236392&e=0"
)

api_key = "AIzaSyCB_oauy2LpHwTCgFY280rYJW3IBexu1AA"

print("Downloading image...")
resp = urllib.request.urlopen(img_url, timeout=15)
img_data = resp.read()
print(f"Image size: {len(img_data)} bytes")
img_b64 = base64.b64encode(img_data).decode()

# Test 1: Assessment model
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={api_key}"
payload = {
    "contents": [{"parts": [
        {"text": "In one sentence, describe what this image shows."},
        {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}},
    ]}],
}
print("\n--- Test 1: gemini-3-flash-preview (assessment model) ---")
req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode(),
    method="POST",
    headers={"Content-Type": "application/json"},
)
t0 = time.time()
try:
    resp = urllib.request.urlopen(req, timeout=60)
    result = json.loads(resp.read())
    text = result["candidates"][0]["content"]["parts"][0]["text"]
    print(f"OK ({time.time() - t0:.1f}s): {text}")
except Exception as e:
    print(f"FAIL ({time.time() - t0:.1f}s): {e}")
    try:
        print(e.read().decode()[:500])
    except:
        pass

# Test 2: Image generation model
url2 = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={api_key}"
payload2 = {
    "contents": [{"parts": [
        {"text": "Describe this image in one sentence."},
        {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}},
    ]}],
    "generationConfig": {
        "responseModalities": ["TEXT"],
    },
}
print("\n--- Test 2: gemini-3.1-flash-image-preview (image model) ---")
req2 = urllib.request.Request(
    url2,
    data=json.dumps(payload2).encode(),
    method="POST",
    headers={"Content-Type": "application/json"},
)
t0 = time.time()
try:
    resp2 = urllib.request.urlopen(req2, timeout=60)
    result2 = json.loads(resp2.read())
    text2 = result2["candidates"][0]["content"]["parts"][0]["text"]
    print(f"OK ({time.time() - t0:.1f}s): {text2}")
except Exception as e:
    print(f"FAIL ({time.time() - t0:.1f}s): {e}")
    try:
        print(e.read().decode()[:500])
    except:
        pass
