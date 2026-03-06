This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## UC Export Pipeline Verification

Use this one-command verification to test import + Gemini image enhancement end-to-end with 12 test listings:

```bash
npm run verify:export-pipeline
```

The script automatically loads `.env.local` and `.env` from the project root.

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
UC_WEBHOOK_USER=<webhook-user>
UC_WEBHOOK_PASS=<webhook-pass>
```

Optional variables:

```bash
SITE_URL=https://frisco.sk
UC_WEBHOOK_URL=https://frisco.sk/api/uc-import
VERIFY_LISTING_COUNT=12
VERIFY_MAX_WAIT_MS=180000
VERIFY_POLL_INTERVAL_MS=5000
VERIFY_CLEANUP=true
```

What it verifies:

- UC webhook accepts and imports all test listings.
- `listings` rows are visible and usable by homepage/offer filters (`status=1`, `is_deleted=false`, valid action).
- `listing_images` are created and processed by `process-images`.
- Gemini enhancement finishes with no failed images and produces enhanced/upscaled image URLs.
- Test data is cleaned up automatically (unless `VERIFY_CLEANUP=false`).

Internal pre-integration testing (before Unit Classifieds is connected):

```bash
VERIFY_INTERNAL=true npm run verify:export-pipeline
```

This mode calls Supabase `import-listings` directly and validates your internal import/enhancement pipeline only. It does **not** prove that listings are already visible on the external classified portal.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
