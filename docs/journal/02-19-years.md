# 02 — "18 rokov" → "19 rokov" across the site (2026-11-10)

**Asked:** "change to 19 years on all of the website then lets push" (screenshot of /preco-frisco hero "18 rokov").

**Changed:** every years-in-business mention, SK/EN/DE (15 strings):
- `src/components/FamilyBusinessSection.tsx`: hero headline years (Preco Frisco)
- `src/components/KontaktContent.tsx`: Mr. Križo bio on /kontakt
- `src/i18n/copy.ts`: page subtitles (2 pages × 3 langs), "Odborná expertíza" card text and the `18+` → `19+` stat

**Verified:** grep for 18 rokov/years/Jahre(n)/`'18+'` in `src` and `public` returns nothing; `tsc --noEmit` clean. Production deploys from main via Vercel.

**Open:** the number is hardcoded. Next year it needs the same edit again (or compute it from a founding year).
