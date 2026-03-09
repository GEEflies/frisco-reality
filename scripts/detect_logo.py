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
import time
import shutil
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


def supabase_rpc(fn_name: str, params: dict) -> bool:
    """Call a Supabase RPC function. Returns True on success."""
    url = f"{SUPABASE_URL}/rest/v1/rpc/{fn_name}"
    body = json.dumps(params).encode()
    req = urllib.request.Request(url, data=body, method="POST", headers={
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
    })
    try:
        urllib.request.urlopen(req, timeout=15)
        return True
    except Exception as e:
        print(f"    ⚠ RPC failed for {fn_name}: {e}", file=sys.stderr)
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

    total = len(images)
    print(f"Found {total} images to scan\n")
    if not images:
        print("Nothing to do.")
        return

    results = {"logo": 0, "clean": 0, "error": 0}
    start_time = time.time()
    term_width = shutil.get_terminal_size((80, 24)).columns

    def fmt_time(seconds: float) -> str:
        """Format seconds as Xm Ys or Xs."""
        if seconds < 0:
            return "---"
        m, s = divmod(int(seconds), 60)
        if m > 0:
            return f"{m}m {s:02d}s"
        return f"{s}s"

    def draw_progress(idx: int, status: str, last_result: str = ""):
        """Draw a single-line progress bar with stats."""
        done = idx + 1
        pct = done / total * 100
        elapsed = time.time() - start_time
        avg_per_img = elapsed / done if done > 0 else 0
        remaining = avg_per_img * (total - done)
        speed = done / elapsed if elapsed > 0 else 0

        # Build the bar itself
        bar_max = min(30, term_width - 60)
        filled = int(bar_max * done / total)
        bar = "█" * filled + "░" * (bar_max - filled)

        # Colour the percentage green
        if pct == 100:
            pct_str = f"\033[92m{pct:5.1f}%\033[0m"
        else:
            pct_str = f"\033[96m{pct:5.1f}%\033[0m"

        line = (
            f"\r  {bar} {pct_str}  "
            f"{done}/{total}  "
            f"\033[33m⏱ {fmt_time(elapsed)}\033[0m  "
            f"ETA \033[35m{fmt_time(remaining)}\033[0m  "
            f"({speed:.1f} img/s)  "
            f"\033[90m{status}\033[0m"
        )
        # Pad to terminal width to clear previous line
        sys.stdout.write(line.ljust(term_width + 30))  # extra for ANSI codes
        sys.stdout.flush()

    def log_line(msg: str):
        """Print a log line above the progress bar (clears current line first)."""
        sys.stdout.write("\r" + " " * (term_width) + "\r")
        print(msg)

    print(f"  \033[1m{'─' * 56}\033[0m")
    print(f"  \033[1mFRISCO Logo Detection\033[0m  │  {total} images  │  "
          f"{'DRY RUN' if args.dry_run else 'LIVE (updating DB)'}")
    print(f"  \033[1m{'─' * 56}\033[0m\n")

    for i, img_row in enumerate(images):
        img_id = img_row["id"]
        url = img_row.get("enhanced_url") or img_row["original_url"]
        short_id = img_id[:8]

        # Show downloading status
        draw_progress(i, f"⬇ downloading {short_id}...")

        pil_img = download_image(url)
        if pil_img is None and url != img_row["original_url"]:
            draw_progress(i, f"⬇ fallback {short_id}...")
            pil_img = download_image(img_row["original_url"])

        if pil_img is None:
            results["error"] += 1
            log_line(f"  \033[91m✗\033[0m  {short_id}  SKIP (download failed)")
            continue

        # Show scanning status
        draw_progress(i, f"🔍 scanning {short_id}...")

        has_logo, density, red_count = detect_frisco_logo(pil_img, verbose=False)

        if has_logo:
            results["logo"] += 1
            result_txt = f"  \033[91m🔴\033[0m {short_id}  LOGO  ({red_count} red px, {density:.3%})"
        else:
            results["clean"] += 1
            result_txt = f"  \033[92m✅\033[0m {short_id}  clean ({red_count} red px, {density:.3%})"

        if args.verbose:
            log_line(result_txt)

        # Update DB via RPC (bypasses RLS)
        if not args.dry_run:
            draw_progress(i, f"💾 updating DB {short_id}...")
            supabase_rpc("set_has_baked_logo", {
                "image_id": img_id,
                "logo_value": has_logo,
            })

        draw_progress(i, f"✓ {short_id} done")

    # Final progress at 100%
    elapsed_total = time.time() - start_time
    sys.stdout.write("\r" + " " * (term_width) + "\r")
    bar_max = min(30, term_width - 60)
    bar_full = "█" * bar_max
    print(f"  {bar_full} \033[92m100.0%\033[0m  {total}/{total}  "
          f"\033[33m⏱ {fmt_time(elapsed_total)}\033[0m  \033[92mDONE\033[0m")

    # Summary
    print(f"\n  \033[1m{'─' * 56}\033[0m")
    print(f"  \033[1mResults\033[0m")
    print(f"  \033[1m{'─' * 56}\033[0m")
    print(f"   🔴  With logo:  \033[91m{results['logo']}\033[0m")
    print(f"   ✅  Clean:      \033[92m{results['clean']}\033[0m")
    if results["error"] > 0:
        print(f"   ⚠   Errors:     \033[93m{results['error']}\033[0m")
    print(f"   📊  Total:      {sum(results.values())}/{total}")
    print(f"   ⏱   Time:       {fmt_time(elapsed_total)} ({elapsed_total:.1f}s)")
    if elapsed_total > 0:
        print(f"   🚀  Speed:      {total / elapsed_total:.2f} images/sec")
    print(f"  \033[1m{'─' * 56}\033[0m")

    if args.dry_run:
        print(f"\n  \033[93m⚠ DRY RUN — no database changes were made\033[0m")


if __name__ == "__main__":
    main()
