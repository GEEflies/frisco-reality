#!/usr/bin/env python3
"""Test multiple Gemini models for the assessment step."""
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
img_b64 = base64.b64encode(img_data).decode()
print(f"Image size: {len(img_data)} bytes\n")

models = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-3.1-flash-lite-preview",
    "gemini-3-pro-preview",
    "gemini-3.1-pro-preview",
]

for model in models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [
            {"text": "In one sentence, describe what this image shows."},
            {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}},
        ]}],
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    t0 = time.time()
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        result = json.loads(resp.read())
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        elapsed = time.time() - t0
        print(f"OK  {model:40s} ({elapsed:5.1f}s): {text[:80]}")
    except Exception as e:
        elapsed = time.time() - t0
        msg = str(e)
        try:
            msg = e.read().decode()[:200]
        except:
            pass
        print(f"FAIL {model:40s} ({elapsed:5.1f}s): {msg}")
