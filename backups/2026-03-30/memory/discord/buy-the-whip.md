# buy-the-whip - Channel Memory

## Project Overview
Buy The Whip — Real-time luxury car price intelligence for the UAE market.
Tracks listing price reductions across Dubai, Abu Dhabi, Sharjah, RAK.
Target user: High-net-worth buyers, expats, car investors. AED 300K–5M+ spend.
Live: https://buy-the-whip.vercel.app | GitHub: https://github.com/jwebdesignservice/buy-the-whip
Local: C:\Users\Jack\Desktop\AI Website\htdocs\Websites\Buy-The-Whip

## Current Status (2026-03-12)
- **LIVE with real data** — 236 real luxury car listings in Supabase
- Latest commit: `8eb21e1`
- Both scraper pipelines fully built and deployed

## Scraper Architecture (Dual Pipeline)

### Discovery (powerbox) — Weekly, Sunday 21:00 UTC
- Actor: `powerbox~dubizzle-motors-used-cars-listing-scraper`
- Input key: `searchUrl` (verified — NOT startUrls or url)
- 28 URLs: Dubai (9 brands) + Abu Dhabi (9) + Sharjah (6) + RAK (4)
- maxItems: 1000 per URL
- Output fields: listingId, title ("Ferrari - 296 GTB - Other"), price ("2,699,000"), year, kms ("13,200 km"), location ("Al Quoz, Dubai"), url, imageUrl (single string)
- Route: `/api/scrape`

### Monitor (ecomscrape) — Nightly, 22:00 UTC start + 00:00 UTC collect
- Actor: `ecomscrape~dubizzle-product-details-scraper` — $20/month rental required
- Input key: `urls` (plain string array)
- Output fields: listing_id, absolute_url, price.raw ("1079990.00"), photos[], location.name, details.primary/secondary arrays by slug, categories[]
- Routes: `/api/scrape/monitor/start` + `/api/scrape/monitor/collect`
- Requires `scrape_runs` table in Supabase (migration 004 already run)

## Verified Real Output (2026-03-12)
- ecomscrape: Ferrari 296 GTB confirmed — price.raw="1079990.00", absolute_url, listing_id=16762551, 20 photos, details arrays
- powerbox: Ferrari 812 Superfast confirmed — title="Ferrari - 812 Superfast - Other", price="2,699,000", kms="13,200 km", imageUrl (single string)
- Normalizer updated to handle both formats

## Seed Data (2026-03-12)
Ran `node scripts/seed.mjs` — seeded real data directly to Supabase:
- Ferrari Dubai: 50 inserted
- Lamborghini Dubai: FAILED (Apify glitch — retry needed)
- Rolls-Royce Dubai: 50 inserted
- Bentley Dubai: 40 inserted (12 skipped — below 150k AED or non-luxury)
- Porsche Dubai: 46 inserted
- McLaren Dubai: 50 inserted
- **Total: 236 listings in Supabase**

## DB Migrations Run
- 001_initial.sql ✓
- 002_alerts_email_unique.sql ✓
- 003_alert_subscriptions_updated_at.sql ✓
- 004_scrape_runs.sql ✓ (scrape_runs table for async Apify monitor tracking)

## Vercel Crons (vercel.json)
- `/api/scrape` — `0 21 * * 0` (discovery, weekly Sunday)
- `/api/scrape/monitor/start` — `0 22 * * *` (monitor start, nightly)
- `/api/scrape/monitor/collect` — `0 0 * * *` (monitor collect, nightly 2h later)

## Supabase
- URL: https://hlrgnzpuamsmdmhcjpzb.supabase.co
- Tables: listings, price_history, alert_subscriptions, scrape_runs

## Key Files
- `scraper/sources/dubizzle.ts` — powerbox discovery (28 URLs, searchUrl input)
- `scraper/sources/ecomscrape.ts` — ecomscrape monitor (urls[] input)
- `scraper/processor/normalize.ts` — handles both powerbox + ecomscrape formats
- `scraper/processor/detect-drops.ts` — upsert + price drop detection
- `app/api/scrape/route.ts` — discovery endpoint
- `app/api/scrape/monitor/start/route.ts` — async monitor start
- `app/api/scrape/monitor/collect/route.ts` — async monitor collect
- `scripts/seed.mjs` — one-time local seed script (reads .env.local)

## Open Items
- [ ] Retry Lamborghini seed (50 listings missing)
- [ ] Rent ecomscrape actor ($20/month) to activate nightly price monitoring
- [ ] Weekly email digest (Resend + alert_subscriptions) — ~2h build
- [ ] Supabase .env.local now populated locally (do NOT commit)

## Design System
- No emojis in UI. No countdown timers. No gamification.
- Dark luxury: void=#0a0a0b, carbon=#111113, gold=#c9a84c, ivory=#f5f0e8
- Fonts: Playfair Display / Inter / JetBrains Mono
- 95% width layout, gap-[7px] grid, DropCard has own bg-carbon

## Infrastructure
- Auto-sync cron: every 3h (OpenClaw cron ID: 1b503af9-7f3a-4e1b-8d9a-30e696829758)
- CRON_SECRET: zvXc27ToRqbDnSWYuJlBCKidgtV8ep6k
- Vercel project: jack-wilsons-projects-79c1513c/buy-the-whip

---
_Last updated: 2026-03-12_
