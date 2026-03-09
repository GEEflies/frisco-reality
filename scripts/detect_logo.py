#!/usr/bin/env python3
"""
FRISCO Logo Detector — Batch & Automation Script

Scans listing images for the red FRISCO watermark baked in by UC Export API.
Updates the `has_baked_logo` column in Supabase so the frontend can decide
whether to show the CSS overlay.

Detection algorithm:
  1. Crop the bottom-right 30% width × 35% height of the image
  2. Convert to HSV colour space
  3. Count pixels matching the FRISCO-red hue (H ≈ 0–15° or 345–360°,
     S > 40%, V > 30%)  — the logo is a vivid red with dark outline
  4. If the red-pixel density in that region exceeds a threshold → logo present

Usage:
  # Batch-process all images:
  python scripts/detect_logo.py

  # Process a single image by ID:
  python scripts/detect_logo.py --image-id <uuid>

  # Dry run (print results, don't update DB):
  python scripts/detect_logo.py --dry-run

  # Verbose mode (show red-pixel counts):
  python scripts/detect_logo.py --verbose
"""

import argparse
import io
import json
import sys
import urllib.request
from collections import Counter

import numpy as np
from PIL import Image

# ──────────────────────────────────────────────────────────────
# CONFIGURATION
# ──────────────────────────────────────────────────────────────
SUPABASE_URL = "https://fcvswlurtchqorgnwclw.supabase.co"
SUPABASE_ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdnN3bHVydGNocW9yZ253Y2x3"
    "Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMzAwNjAsImV4cCI6MjA4NTkw"
    "***REDACTED***"
)

# Crop region: bottom-right corner where the FRISCO logo sits
CROP_WIDTH_RATIO = 0.32   # rightmost 32% of width
CROP_HEIGHT_RATIO = 0.30  # bottom 30% of height

# HSV thresholds for FRISCO-red detection
# Red wraps around 0°/360° in HSV, so we check two ranges:
#   Range A:  H ∈ [0, 15]   (reds, red-orange)
#   Range B:  H ∈ [345, 360] (magenta-reds)
# S ≥ 40% (0-255 scale → 102)  —  must be saturated, not grey/pink
# V ≥ 30% (0-255 scale → 77)   —  must not be too dark
HUE_RANGE_A = (0, 15)
HUE_RANGE_B = (345, 360)
SAT_MIN = 102      # 40% of 255
VAL_MIN = 77       # 30% of 255

# If red pixels make up ≥ this fraction of the crop region → logo detected
RED_DENSITY_THRESHOLD = 0.003   # 0.3% — the logo is small but distinct

# Minimum absolute red pixel count (catch very small images)
RED_PIXEL_MIN = 50


# ──────────────────────────────────────────────────────────────
# SUPABASE HELPERS
# ──────────────────────────────────────────────────────────────
def supabase_get(path: str) -> list:
    """GET from Supabase REST API."""
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    })
    resp = urllib.request.urlopen(req, timeout=30)
    return json.loads(resp.read())


def supabase_patch(table: str, row_id: str, data: dict) -> bool:
    """PATCH a row in Supabase REST API. Returns True on success."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?id=eq.{row_id}"
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, method="PATCH", headers={
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    })
    try:
        urllib.request.urlopen(req, timeout=15)
        return True
    except Exception as e:
        print(f"    ⚠ PATCH failed for {row_id[:8]}: {e}", file=sys.stderr)
        return False


# ──────────────────────────────────────────────────────────────
# IMAGE DOWNLOAD
# ──────────────────────────────────────────────────────────────
def download_image(url: str) -> Image.Image | None:
    """Download an image from URL and return a PIL Image."""
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "FriscoLogoDetector/1.0",
        })
        resp = urllib.request.urlopen(req, timeout=30)
        data = resp.read()
        return Image.open(io.BytesIO(data)).convert("RGB")
    except Exception as e:
        print(f"    ⚠ Download failed: {e}", file=sys.stderr)
        return None


# ──────────────────────────────────────────────────────────────
# LOGO DETECTION
# ──────────────────────────────────────────────────────────────
def detect_frisco_logo(img: Image.Image, verbose: bool = False) -> tuple[bool, float, int]:
    """
    Detect the red FRISCO watermark in the bottom-right corner.

    Returns:
        (has_logo: bool, density: float, red_pixel_count: int)
    """
    w, h = img.size

    # Crop bottom-right region
    left = int(w * (1 - CROP_WIDTH_RATIO))
    top = int(h * (1 - CROP_HEIGHT_RATIO))
    crop = img.crop((left, top, w, h))

    # Convert to HSV via numpy
    hsv = np.array(crop.convert("HSV"))
    hue = hsv[:, :, 0]         # 0-255 (Pillow maps 0-360° → 0-255)
    sat = hsv[:, :, 1]         # 0-255
    val = hsv[:, :, 2]         # 0-255

    # Pillow HSV: Hue is 0-255 (0=0°, 255=360°)
    # Convert our degree thresholds to 0-255 scale
    hue_a_lo = int(HUE_RANGE_A[0] / 360 * 255)
    hue_a_hi = int(HUE_RANGE_A[1] / 360 * 255)
    hue_b_lo = int(HUE_RANGE_B[0] / 360 * 255)
    hue_b_hi = int(HUE_RANGE_B[1] / 360 * 255)

    # Build red mask
    in_range_a = (hue >= hue_a_lo) & (hue <= hue_a_hi)
    in_range_b = (hue >= hue_b_lo) & (hue <= hue_b_hi)
    saturated = sat >= SAT_MIN
    bright = val >= VAL_MIN

    red_mask = (in_range_a | in_range_b) & saturated & bright
    red_count = int(np.sum(red_mask))
    total_pixels = crop.size[0] * crop.size[1]
    density = red_count / total_pixels if total_pixels > 0 else 0

    has_logo = density >= RED_DENSITY_THRESHOLD and red_count >= RED_PIXEL_MIN

    if verbose:
        print(f"    Crop: {crop.size[0]}×{crop.size[1]} ({total_pixels} px)")
        print(f"    Red pixels: {red_count} ({density:.4%})")
        print(f"    Threshold: {RED_DENSITY_THRESHOLD:.4%} / min {RED_PIXEL_MIN}")
        print(f"    → {'LOGO DETECTED' if has_logo else 'no logo'}")

    return has_logo, density, red_count


# ──────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Detect FRISCO logo in listing images")
    parser.add_argument("--image-id", help="Process a single image by UUID")
    parser.add_argument("--dry-run", action="store_true", help="Print results without updating DB")
    parser.add_argument("--verbose", "-v", action="store_true", help="Show detection details")
    parser.add_argument("--force", action="store_true", help="Re-scan even if already scanned")
    args = parser.parse_args()

    # Fetch images from Supabase
    if args.image_id:
        images = supabase_get(
            f"listing_images?select=id,original_url,enhanced_url,has_baked_logo"
            f"&id=eq.{args.image_id}"
        )
    elif args.force:
        images = supabase_get(
            "listing_images?select=id,original_url,enhanced_url,has_baked_logo"
            "&order=created_at"
        )
    else:
        # Only scan images that haven't been scanned yet
        images = supabase_get(
            "listing_images?select=id,original_url,enhanced_url,has_baked_logo"
            "&has_baked_logo=is.null&order=created_at"
        )

    print(f"Found {len(images)} images to scan\n")
    if not images:
        print("Nothing to do.")
        return

    results = {"logo": 0, "clean": 0, "error": 0}

    for i, img_row in enumerate(images):
        img_id = img_row["id"]
        # Use the best available URL for analysis
        url = img_row.get("enhanced_url") or img_row["original_url"]
        short_id = img_id[:8]

        print(f"[{i + 1}/{len(images)}] {short_id}...", end=" ")

        pil_img = download_image(url)
        if pil_img is None:
            # Try original URL as fallback
            if url != img_row["original_url"]:
                pil_img = download_image(img_row["original_url"])

        if pil_img is None:
            print("SKIP (download failed)")
            results["error"] += 1
            continue

        has_logo, density, red_count = detect_frisco_logo(pil_img, verbose=args.verbose)

        if has_logo:
            print(f"🔴 LOGO ({red_count} red px, {density:.3%})")
            results["logo"] += 1
        else:
            print(f"✅ clean ({red_count} red px, {density:.3%})")
            results["clean"] += 1

        # Update DB
        if not args.dry_run:
            supabase_patch("listing_images", img_id, {"has_baked_logo": has_logo})

    print(f"\n{'=' * 50}")
    print(f"Results: {results['logo']} with logo, {results['clean']} clean, {results['error']} errors")
    print(f"Total processed: {sum(results.values())}/{len(images)}")

    if args.dry_run:
        print("\n⚠ DRY RUN — no database changes were made")


if __name__ == "__main__":
    main()
