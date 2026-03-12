#!/usr/bin/env python3
"""Test Gemini image generation models with the listing image."""
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

prompt = (
    "Enhance this real estate photo. Improve lighting and exposure for a balanced, "
    "well-lit result. Correct white balance for natural colors. Reduce noise. "
    "Sharpen details slightly. Do NOT add, remove, or move any objects. "
    "Do NOT add any new text or watermarks. Keep it photorealistic. "
    "Return ONLY the enhanced image."
)

models = [
    "gemini-3.1-flash-image-preview",
    "gemini-3-pro-image-preview",
    "gemini-2.5-flash-image",
]

for model in models:
    print(f"\n--- Testing {model} ---")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    # Try with responseModalities: IMAGE,TEXT
    payload = {
        "contents": [{"parts": [
            {"text": prompt},
            {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}},
        ]}],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"],
        },
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    t0 = time.time()
    try:
        resp = urllib.request.urlopen(req, timeout=120)
        result = json.loads(resp.read())
        candidates = result.get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            has_image = any("inlineData" in p for p in parts)
            has_text = any("text" in p for p in parts)
            if has_image:
                img_part = next(p for p in parts if "inlineData" in p)
                print(f"  OK ({time.time()-t0:.1f}s): Got image ({img_part['inlineData']['mimeType']}, {len(img_part['inlineData']['data'])} chars b64)")
            elif has_text:
                text = next(p["text"] for p in parts if "text" in p)
                print(f"  TEXT ONLY ({time.time()-t0:.1f}s): {text[:200]}")
            else:
                print(f"  EMPTY ({time.time()-t0:.1f}s): parts={json.dumps(parts)[:200]}")
        else:
            # Check for prompt feedback / blocks
            feedback = result.get("promptFeedback", {})
            print(f"  NO CANDIDATES ({time.time()-t0:.1f}s): feedback={json.dumps(feedback)[:300]}")
    except Exception as e:
        elapsed = time.time() - t0
        msg = str(e)
        try:
            msg = e.read().decode()[:300]
        except:
            pass
        print(f"  FAIL ({elapsed:.1f}s): {msg}")
