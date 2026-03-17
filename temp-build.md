# Buy The Whip — Full Build Specification

## Project Overview

A real-time luxury car price intelligence platform for the UAE market. Tracks listing price reductions across Dubai and Abu Dhabi, surfaces significant drops as actionable intelligence, and presents data as a premium financial product.

**Target user:** High-net-worth buyers, expats relocating, car investors, flippers. People with AED 300K–5M+ to spend who want to move fast when the right car drops.

**Positioning:** Market intelligence, not a bargain site. The aesthetic and tone reflect the cars being tracked — never discount-hunter energy.

---

## Non-Negotiables (Read Before Building Anything)

- No emojis anywhere in the UI, ever
- No countdown timers, flashing alerts, gamification, or crypto-adjacent language
- The word "panic" never appears in UI copy — use "price drop", "market intelligence", "reduction"
- Mobile-first on every component
- Dark luxury aesthetic throughout: deep charcoal/near-black backgrounds, champagne/gold accents, white text hierarchy
- Data is presented clean — like a private wealth dashboard, not a deals aggregator
- All scraping: public data only, rate-limited, no login bypass, UAE data protection compliant

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR for SEO, fast, industry standard |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Database | Supabase (PostgreSQL) | Real-time subscriptions, easy setup |
| Scraping | Apify | Managed, handles JS rendering, existing Dubizzle actor |
| Scraper scheduler | Vercel Cron or Railway cron job | Daily runs |
| Hosting (frontend) | Vercel | Zero config, instant deploys |
| Hosting (scraper API) | Railway | Node.js service for Apify orchestration |
| Auth (premium tier) | Supabase Auth | Built-in, integrates with DB |
| Email | Resend | Developer-friendly, clean API |
| Fonts | Playfair Display (headings) + Inter (body/data) | Luxury editorial feel |

---

## Project Structure

```
buy-the-whip/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage / hero
│   ├── drops/
│   │   └── page.tsx              # Live drops feed
│   ├── car/
│   │   └── [id]/page.tsx         # Car detail + price history
│   ├── market/
│   │   └── page.tsx              # Market stats / brand index
│   ├── alerts/
│   │   └── page.tsx              # Alert sign-up / premium
│   ├── api/
│   │   ├── scrape/route.ts       # Trigger scrape run (called by cron)
│   │   ├── listings/route.ts     # Listings feed endpoint
│   │   └── webhooks/
│   │       └── apify/route.ts    # Apify webhook receiver
│   └── layout.tsx                # Root layout (fonts, nav, footer)
├── components/
│   ├── ui/                       # Shared primitives (Button, Badge, Card)
│   ├── drops/
│   │   ├── DropsGrid.tsx         # Main feed grid
│   │   ├── DropCard.tsx          # Individual car card
│   │   └── DropsFilter.tsx       # Brand/emirate/price filters
│   ├── car/
│   │   ├── PriceHistoryChart.tsx # Line chart (gold on dark)
│   │   └── ListingDetail.tsx     # Full car detail view
│   ├── market/
│   │   ├── BrandLeaderboard.tsx  # Brand depreciation ranking
│   │   └── MarketStats.tsx       # Summary numbers
│   └── layout/
│       ├── Nav.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── types.ts              # Generated types
│   ├── apify/
│   │   └── client.ts             # Apify API wrapper
│   ├── scoring/
│   │   └── dropScore.ts          # Deal Radar score algorithm
│   └── utils.ts
├── scraper/                      # Standalone Railway service
│   ├── index.ts                  # Entry point / scheduler
│   ├── sources/
│   │   ├── dubizzle.ts           # Dubizzle scraper via Apify
│   │   ├── dubicars.ts           # DubiCars scraper
│   │   └── yallamotor.ts         # YallaMotor scraper
│   ├── processor/
│   │   ├── normalize.ts          # Normalize listing shape across sources
│   │   ├── detect-drops.ts       # Drop detection logic
│   │   └── score.ts              # Drop Score calculation
│   └── db/
│       └── upsert.ts             # Write to Supabase
├── supabase/
│   └── migrations/
│       └── 001_initial.sql       # Full schema
└── .env.local                    # Environment variables (never commit)
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Apify
APIFY_API_TOKEN=

# Resend (email alerts)
RESEND_API_KEY=

# Cron security
CRON_SECRET=

# App
NEXT_PUBLIC_APP_URL=https://buythewhip.com
```

---

## Database Schema

Run this in Supabase SQL editor to set up the full schema.

```sql
-- Brands reference table
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'ultra' -- 'ultra' | 'super' | 'luxury'
);

INSERT INTO brands (name, slug, tier) VALUES
  ('Ferrari', 'ferrari', 'ultra'),
  ('Lamborghini', 'lamborghini', 'ultra'),
  ('Bugatti', 'bugatti', 'ultra'),
  ('Rolls-Royce', 'rolls-royce', 'ultra'),
  ('Bentley', 'bentley', 'ultra'),
  ('McLaren', 'mclaren', 'ultra'),
  ('Aston Martin', 'aston-martin', 'super'),
  ('Porsche', 'porsche', 'super'),
  ('Mercedes-Maybach', 'mercedes-maybach', 'super'),
  ('Maserati', 'maserati', 'luxury'),
  ('Lexus LC', 'lexus', 'luxury');

-- Core listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL,               -- ID from source platform
  source TEXT NOT NULL,                    -- 'dubizzle' | 'dubicars' | 'yallamotor'
  url TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  mileage INTEGER,                         -- km
  color TEXT,
  body_type TEXT,
  engine_type TEXT,                        -- 'Gasoline' | 'BEV' | 'PHEV' | 'HEV'
  transmission TEXT,
  specs TEXT,                              -- free-text specs field
  location TEXT,                           -- emirate
  seller_type TEXT,                        -- 'private' | 'dealer'
  image_urls TEXT[],
  current_price INTEGER NOT NULL,          -- AED
  original_price INTEGER NOT NULL,         -- first seen price
  drop_count INTEGER NOT NULL DEFAULT 0,  -- how many times reduced
  drop_score NUMERIC(3,1),                 -- Deal Radar 0.0–10.0
  days_listed INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(external_id, source)
);

-- Price history — every recorded price for every listing
CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alert subscriptions
CREATE TABLE alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free',       -- 'free' | 'premium'
  brands TEXT[],                           -- null = all brands
  max_price INTEGER,
  min_drop_percent INTEGER DEFAULT 10,
  location TEXT,                           -- null = all emirates
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_listings_brand ON listings(brand);
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_current_price ON listings(current_price);
CREATE INDEX idx_listings_drop_score ON listings(drop_score DESC);
CREATE INDEX idx_listings_is_active ON listings(is_active);
CREATE INDEX idx_listings_drop_count ON listings(drop_count DESC);
CREATE INDEX idx_price_history_listing_id ON price_history(listing_id);
CREATE INDEX idx_price_history_recorded_at ON price_history(recorded_at);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read on listings and price history
CREATE POLICY "listings_public_read" ON listings FOR SELECT USING (true);
CREATE POLICY "price_history_public_read" ON price_history FOR SELECT USING (true);

-- Service role can write everything (used by scraper)
CREATE POLICY "listings_service_write" ON listings
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "price_history_service_write" ON price_history
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "alert_subs_insert" ON alert_subscriptions
  FOR INSERT WITH CHECK (true);
```

---

## Scraper Service

### Overview

The scraper runs daily (2am UAE time), pulls luxury listings from Dubizzle via Apify, normalizes the data, detects price drops, recalculates Drop Scores, and upserts to Supabase.

### Apify Setup

1. Create account at apify.com
2. Get API token from Settings > Integrations
3. Use the actor `ecomscrape/dubizzle-product-details-scraper` for Dubizzle
4. For additional sources, use `apify/web-scraper` with custom page functions

### scraper/sources/dubizzle.ts

```typescript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

const LUXURY_BRANDS = [
  'Ferrari', 'Lamborghini', 'Rolls-Royce', 'Bentley',
  'McLaren', 'Bugatti', 'Aston Martin', 'Porsche',
  'Mercedes-Maybach', 'Maserati'
];

const DUBIZZLE_LUXURY_URLS = LUXURY_BRANDS.flatMap(brand => [
  `https://dubai.dubizzle.com/motors/used-cars/${brand.toLowerCase().replace(' ', '-')}/`,
  `https://abudhabi.dubizzle.com/motors/used-cars/${brand.toLowerCase().replace(' ', '-')}/`
]);

export async function scrapeDubizzle() {
  const run = await client.actor('ecomscrape/dubizzle-product-details-scraper').call({
    startUrls: DUBIZZLE_LUXURY_URLS.map(url => ({ url })),
    maxItems: 2000,
    minPrice: 150000, // AED
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items;
}
```

### scraper/processor/normalize.ts

```typescript
export interface NormalizedListing {
  external_id: string;
  source: string;
  url: string;
  brand: string;
  model: string;
  year: number | null;
  mileage: number | null;
  color: string | null;
  body_type: string | null;
  engine_type: string | null;
  transmission: string | null;
  location: string | null;
  seller_type: string | null;
  image_urls: string[];
  price: number;
  specs: string | null;
}

export function normalizeDubizzle(raw: any): NormalizedListing | null {
  // Skip if price missing or below threshold
  if (!raw.price || raw.price < 150000) return null;

  return {
    external_id: raw.id || raw.listingId,
    source: 'dubizzle',
    url: raw.url,
    brand: raw.make || raw.brand,
    model: raw.model,
    year: raw.year ? parseInt(raw.year) : null,
    mileage: raw.mileage ? parseInt(raw.mileage) : null,
    color: raw.color || null,
    body_type: raw.bodyType || null,
    engine_type: raw.engineType || null,
    transmission: raw.transmission || null,
    location: extractEmirate(raw.location || raw.city || ''),
    seller_type: raw.sellerType === 'dealer' ? 'dealer' : 'private',
    image_urls: Array.isArray(raw.images) ? raw.images : [],
    price: parseInt(raw.price),
    specs: raw.specs || raw.description || null,
  };
}

function extractEmirate(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes('dubai')) return 'Dubai';
  if (lower.includes('abu dhabi')) return 'Abu Dhabi';
  if (lower.includes('sharjah')) return 'Sharjah';
  if (lower.includes('ajman')) return 'Ajman';
  if (lower.includes('ras al khaimah') || lower.includes('rak')) return 'Ras Al Khaimah';
  return raw;
}
```

### scraper/processor/detect-drops.ts

```typescript
import { supabaseAdmin } from '../db/client';
import type { NormalizedListing } from './normalize';

export async function detectAndUpsert(listing: NormalizedListing) {
  const { data: existing } = await supabaseAdmin
    .from('listings')
    .select('id, current_price, original_price, drop_count, first_seen_at')
    .eq('external_id', listing.external_id)
    .eq('source', listing.source)
    .single();

  if (!existing) {
    // New listing — insert and record initial price
    const { data: newListing } = await supabaseAdmin
      .from('listings')
      .insert({
        ...listing,
        current_price: listing.price,
        original_price: listing.price,
        drop_count: 0,
        days_listed: 0,
      })
      .select()
      .single();

    if (newListing) {
      await supabaseAdmin.from('price_history').insert({
        listing_id: newListing.id,
        price: listing.price,
      });
    }
    return;
  }

  // Existing listing — check for price drop
  const priceDropped = listing.price < existing.current_price;
  const daysListed = Math.floor(
    (Date.now() - new Date(existing.first_seen_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const updates: Record<string, any> = {
    current_price: listing.price,
    image_urls: listing.image_urls,
    last_updated_at: new Date().toISOString(),
    days_listed: daysListed,
  };

  if (priceDropped) {
    updates.drop_count = existing.drop_count + 1;
    // Recalculate drop score
    updates.drop_score = calculateDropScore({
      currentPrice: listing.price,
      originalPrice: existing.original_price,
      dropCount: updates.drop_count,
      daysListed,
      mileage: listing.mileage,
      location: listing.location,
    });
  }

  await supabaseAdmin
    .from('listings')
    .update(updates)
    .eq('id', existing.id);

  if (priceDropped) {
    await supabaseAdmin.from('price_history').insert({
      listing_id: existing.id,
      price: listing.price,
    });
  }
}
```

### scraper/scoring/dropScore.ts

```typescript
interface ScoreInput {
  currentPrice: number;
  originalPrice: number;
  dropCount: number;
  daysListed: number;
  mileage: number | null;
  location: string | null;
}

export function calculateDropScore(input: ScoreInput): number {
  let score = 0;

  // Drop percentage (0–4 points)
  const dropPercent = ((input.originalPrice - input.currentPrice) / input.originalPrice) * 100;
  if (dropPercent >= 20) score += 4;
  else if (dropPercent >= 15) score += 3;
  else if (dropPercent >= 10) score += 2.5;
  else if (dropPercent >= 5) score += 1.5;
  else score += 0.5;

  // Number of reductions (0–2 points)
  if (input.dropCount >= 4) score += 2;
  else if (input.dropCount >= 3) score += 1.5;
  else if (input.dropCount >= 2) score += 1;
  else score += 0.5;

  // Days on market vs brand average (0–2 points)
  // Assume 45 days is the average for luxury UAE listings
  if (input.daysListed >= 90) score += 2;
  else if (input.daysListed >= 60) score += 1.5;
  else if (input.daysListed >= 30) score += 1;
  else score += 0.3;

  // Mileage bonus — lower mileage + big drop = better deal (0–1 point)
  if (input.mileage !== null) {
    if (input.mileage < 20000) score += 1;
    else if (input.mileage < 50000) score += 0.5;
  }

  // Location — Dubai port proximity bonus (0–1 point)
  if (input.location === 'Dubai') score += 0.5;

  return Math.min(parseFloat(score.toFixed(1)), 10);
}
```

---

## API Routes

### app/api/scrape/route.ts (Cron endpoint)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { scrapeDubizzle } from '@/scraper/sources/dubizzle';
import { normalizeDubizzle } from '@/scraper/processor/normalize';
import { detectAndUpsert } from '@/scraper/processor/detect-drops';

export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawItems = await scrapeDubizzle();
    const normalized = rawItems
      .map(normalizeDubizzle)
      .filter(Boolean);

    let processed = 0;
    for (const listing of normalized) {
      await detectAndUpsert(listing!);
      processed++;
    }

    return NextResponse.json({ ok: true, processed });
  } catch (err) {
    console.error('Scrape failed:', err);
    return NextResponse.json({ error: 'Scrape failed' }, { status: 500 });
  }
}
```

### app/api/listings/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get('brand');
  const location = searchParams.get('location');
  const minDrop = parseInt(searchParams.get('minDrop') || '5');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '99999999');
  const sort = searchParams.get('sort') || 'score'; // 'score' | 'drop_pct' | 'recent'
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 24;

  const supabase = createServerClient();

  let query = supabase
    .from('listings')
    .select('*')
    .eq('is_active', true)
    .gt('drop_count', 0)
    .lte('current_price', maxPrice);

  if (brand) query = query.eq('brand', brand);
  if (location) query = query.eq('location', location);

  // Filter by minimum drop percentage
  query = query.filter(
    'current_price',
    'lte',
    `original_price * ${1 - minDrop / 100}`
  );

  if (sort === 'score') query = query.order('drop_score', { ascending: false });
  else if (sort === 'drop_pct') query = query.order('drop_count', { ascending: false });
  else query = query.order('last_updated_at', { ascending: false });

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ listings: data });
}
```

---

## Frontend — Key Components

### Design Tokens (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core palette
        void: '#0a0a0b',       // deepest background
        carbon: '#111113',     // card backgrounds
        graphite: '#1a1a1d',   // elevated surfaces
        steel: '#2a2a2e',      // borders, dividers
        // Accent
        gold: '#c9a84c',       // primary accent
        'gold-light': '#e4c97a',
        'gold-muted': '#8a6f2e',
        // Text
        ivory: '#f5f0e8',      // primary text
        silver: '#9d9d9f',     // secondary text
        ash: '#5a5a5c',        // tertiary / disabled
        // Status
        drop: '#e05252',       // price drop indicators
        'drop-muted': '#6b2828',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
```

### components/drops/DropCard.tsx

```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/supabase/types';

function formatAED(amount: number) {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(amount);
}

function dropPercent(current: number, original: number) {
  return Math.round(((original - current) / original) * 100);
}

export function DropCard({ listing }: { listing: Listing }) {
  const pct = dropPercent(listing.current_price, listing.original_price);
  const saving = listing.original_price - listing.current_price;

  return (
    <Link href={`/car/${listing.id}`} className="group block">
      <div className="bg-carbon border border-steel hover:border-gold-muted transition-colors duration-300 overflow-hidden">
        
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-graphite">
          {listing.image_urls?.[0] ? (
            <Image
              src={listing.image_urls[0]}
              alt={`${listing.brand} ${listing.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-ash font-body text-sm tracking-widest uppercase">
                No Image
              </span>
            </div>
          )}

          {/* Drop badge */}
          <div className="absolute top-3 left-3 bg-drop px-2 py-1">
            <span className="font-body text-xs font-semibold text-ivory tracking-wider">
              -{pct}%
            </span>
          </div>

          {/* Drop count badge */}
          {listing.drop_count >= 2 && (
            <div className="absolute top-3 right-3 bg-void/80 border border-steel px-2 py-1">
              <span className="font-body text-xs text-silver tracking-wider">
                {listing.drop_count}x reduced
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-body text-xs text-gold tracking-[0.15em] uppercase mb-1">
                {listing.brand}
              </p>
              <h3 className="font-display text-ivory text-lg leading-tight">
                {listing.model}
              </h3>
            </div>
            {listing.drop_score && (
              <div className="text-right shrink-0">
                <p className="font-body text-xs text-silver tracking-wider mb-0.5">Score</p>
                <p className="font-mono text-gold text-lg font-medium">
                  {listing.drop_score.toFixed(1)}
                </p>
              </div>
            )}
          </div>

          {/* Meta row */}
          <div className="flex gap-3 mt-2 mb-4">
            {listing.year && (
              <span className="font-body text-xs text-silver">{listing.year}</span>
            )}
            {listing.mileage && (
              <span className="font-body text-xs text-silver">
                {listing.mileage.toLocaleString()} km
              </span>
            )}
            {listing.location && (
              <span className="font-body text-xs text-silver">{listing.location}</span>
            )}
          </div>

          {/* Price */}
          <div className="border-t border-steel pt-3 flex items-end justify-between">
            <div>
              <p className="font-body text-xs text-ash line-through mb-0.5">
                {formatAED(listing.original_price)}
              </p>
              <p className="font-display text-ivory text-xl">
                {formatAED(listing.current_price)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-body text-xs text-ash mb-0.5">Saving</p>
              <p className="font-body text-drop text-sm font-medium">
                {formatAED(saving)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### app/page.tsx (Homepage)

```tsx
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';

async function getHeroStats() {
  const supabase = createServerClient();

  const { count: activeDrops } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .gt('drop_count', 0);

  const { data: todayDrops } = await supabase
    .from('price_history')
    .select('price, listing_id')
    .gte('recorded_at', new Date(Date.now() - 86400000).toISOString());

  // Calculate total AED dropped today
  // (simplified — production version should use a DB function)
  const totalDropped = 0; // implement via Supabase RPC

  return { activeDrops: activeDrops || 0, totalDropped };
}

export default async function HomePage() {
  const { activeDrops } = await getHeroStats();

  return (
    <main className="min-h-screen bg-void">
      
      {/* Hero */}
      <section className="relative h-screen flex items-end pb-24 px-6 lg:px-16">
        {/* Background image — replace src with a high-quality car editorial photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-6">
            Dubai · Abu Dhabi · UAE
          </p>
          <h1 className="font-display text-ivory text-5xl lg:text-7xl leading-[1.05] mb-6">
            The UAE's luxury car<br />market, priced to move.
          </h1>
          <p className="font-body text-silver text-lg mb-10 max-w-xl leading-relaxed">
            Real-time price intelligence on the most significant drops
            across Dubai and Abu Dhabi's luxury car market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              href="/drops"
              className="inline-block bg-gold hover:bg-gold-light text-void font-body text-sm font-semibold tracking-[0.15em] uppercase px-8 py-4 transition-colors duration-200"
            >
              View Live Drops
            </Link>
            <div className="flex items-center gap-6 py-4">
              <div>
                <p className="font-mono text-ivory text-2xl">{activeDrops}</p>
                <p className="font-body text-ash text-xs tracking-wider uppercase mt-0.5">
                  Active Drops
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands bar */}
      <section className="border-t border-b border-steel py-6 px-6 lg:px-16 overflow-x-auto">
        <div className="flex gap-8 whitespace-nowrap">
          {['Ferrari', 'Lamborghini', 'Rolls-Royce', 'Bentley', 'McLaren', 'Porsche', 'Aston Martin', 'Mercedes-Maybach'].map(brand => (
            <Link
              key={brand}
              href={`/drops?brand=${brand}`}
              className="font-body text-silver hover:text-gold text-sm tracking-[0.1em] uppercase transition-colors duration-200"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
```

### app/drops/page.tsx (Live Drops Feed)

```tsx
import { createServerClient } from '@/lib/supabase/server';
import { DropCard } from '@/components/drops/DropCard';
import { DropsFilter } from '@/components/drops/DropsFilter';

export const revalidate = 3600; // Revalidate every hour

async function getDrops(searchParams: Record<string, string>) {
  const supabase = createServerClient();

  let query = supabase
    .from('listings')
    .select('*')
    .eq('is_active', true)
    .gt('drop_count', 0)
    .order('drop_score', { ascending: false })
    .limit(48);

  if (searchParams.brand) query = query.eq('brand', searchParams.brand);
  if (searchParams.location) query = query.eq('location', searchParams.location);
  if (searchParams.maxPrice) query = query.lte('current_price', parseInt(searchParams.maxPrice));

  const { data } = await query;
  return data || [];
}

export default async function DropsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const listings = await getDrops(searchParams);

  return (
    <main className="min-h-screen bg-void pt-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-steel">
          <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Live Intelligence
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display text-ivory text-4xl lg:text-5xl">
              Price Drops
            </h1>
            <p className="font-body text-silver text-sm">
              {listings.length} active reductions
            </p>
          </div>
        </div>

        {/* Filters */}
        <DropsFilter />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-steel mt-8">
          {listings.map(listing => (
            <div key={listing.id} className="bg-void">
              <DropCard listing={listing} />
            </div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="py-32 text-center">
            <p className="font-body text-silver">No drops found for the selected filters.</p>
          </div>
        )}

      </div>
    </main>
  );
}
```

### app/car/[id]/page.tsx (Car Detail)

```tsx
import { createServerClient } from '@/lib/supabase/server';
import { PriceHistoryChart } from '@/components/car/PriceHistoryChart';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!listing) notFound();

  const { data: priceHistory } = await supabase
    .from('price_history')
    .select('price, recorded_at')
    .eq('listing_id', params.id)
    .order('recorded_at', { ascending: true });

  const dropPct = Math.round(
    ((listing.original_price - listing.current_price) / listing.original_price) * 100
  );

  return (
    <main className="min-h-screen bg-void pt-24 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 font-body text-xs text-ash tracking-wider uppercase">
          <Link href="/drops" className="hover:text-silver transition-colors">Drops</Link>
          <span>/</span>
          <span>{listing.brand}</span>
          <span>/</span>
          <span className="text-silver">{listing.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Images */}
          <div>
            {listing.image_urls?.[0] && (
              <div className="relative aspect-[4/3] bg-graphite overflow-hidden mb-3">
                <Image
                  src={listing.image_urls[0]}
                  alt={`${listing.brand} ${listing.model}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {listing.image_urls?.length > 1 && (
              <div className="grid grid-cols-4 gap-1.5">
                {listing.image_urls.slice(1, 5).map((url: string, i: number) => (
                  <div key={i} className="relative aspect-square bg-graphite overflow-hidden">
                    <Image src={url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div>
            <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-2">
              {listing.brand}
            </p>
            <h1 className="font-display text-ivory text-4xl mb-1">{listing.model}</h1>
            {listing.year && (
              <p className="font-body text-silver text-lg mb-8">{listing.year}</p>
            )}

            {/* Price block */}
            <div className="border border-steel p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-body text-ash text-sm line-through mb-1">
                    AED {listing.original_price.toLocaleString()}
                  </p>
                  <p className="font-display text-ivory text-4xl">
                    AED {listing.current_price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-drop px-3 py-1.5 mb-2">
                    <span className="font-body text-ivory text-sm font-semibold">-{dropPct}%</span>
                  </div>
                  {listing.drop_score && (
                    <div>
                      <p className="font-body text-ash text-xs tracking-wider">Score</p>
                      <p className="font-mono text-gold text-xl">{listing.drop_score.toFixed(1)}</p>
                    </div>
                  )}
                </div>
              </div>
              <p className="font-body text-silver text-sm">
                AED {(listing.original_price - listing.current_price).toLocaleString()} below asking
                {listing.drop_count > 1 && ` · reduced ${listing.drop_count} times`}
              </p>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: 'Mileage', value: listing.mileage ? `${listing.mileage.toLocaleString()} km` : null },
                { label: 'Location', value: listing.location },
                { label: 'Transmission', value: listing.transmission },
                { label: 'Engine', value: listing.engine_type },
                { label: 'Colour', value: listing.color },
                { label: 'Days Listed', value: listing.days_listed ? `${listing.days_listed} days` : null },
              ].filter(s => s.value).map(spec => (
                <div key={spec.label} className="border border-steel p-3">
                  <p className="font-body text-ash text-xs tracking-wider uppercase mb-1">{spec.label}</p>
                  <p className="font-body text-ivory text-sm">{spec.value}</p>
                </div>
              ))}
            </div>

            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gold hover:bg-gold-light text-void font-body text-sm font-semibold tracking-[0.15em] uppercase text-center py-4 transition-colors duration-200 mb-4"
            >
              View Original Listing
            </a>
          </div>
        </div>

        {/* Price History Chart */}
        {priceHistory && priceHistory.length > 1 && (
          <div className="mt-16 mb-24">
            <h2 className="font-display text-ivory text-2xl mb-6">Price History</h2>
            <div className="border border-steel p-6 bg-carbon">
              <PriceHistoryChart data={priceHistory} />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
```

---

## Navigation

### components/layout/Nav.tsx

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/drops', label: 'Drops' },
  { href: '/market', label: 'Market' },
  { href: '/alerts', label: 'Alerts' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-sm border-b border-steel">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-ivory text-xl tracking-tight">
          Buy The Whip
        </Link>
        <div className="flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
                pathname.startsWith(link.href)
                  ? 'text-gold'
                  : 'text-silver hover:text-ivory'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

---

## Cron Setup (Vercel)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/scrape",
      "schedule": "0 22 * * *"
    }
  ]
}
```

This fires at 22:00 UTC = 02:00 UAE time daily. The route must check `Authorization: Bearer {CRON_SECRET}` — Vercel sends this automatically when you set `CRON_SECRET` in project env.

---

## Deployment

### Frontend (Vercel)

```bash
# From project root
vercel
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APIFY_API_TOKEN`
- `RESEND_API_KEY`
- `CRON_SECRET`

### Database

Run the SQL schema in Supabase > SQL Editor.

Generate TypeScript types after schema is set:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

---

## Phase Roadmap

| Phase | Scope | Estimated Build Time |
|---|---|---|
| 1 | Scaffold + DB schema + Dubizzle scraper (Apify) | 1–2 days |
| 2 | Homepage, Drops feed, Car detail page | 2–3 days |
| 3 | Market stats page, Drop Score live in UI | 1–2 days |
| 4 | Alert sign-up, weekly email digest (Resend) | 1–2 days |
| 5 | Premium tier, real-time alerts, watchlist | 2–3 days |
| 6 | SEO, editorial blog, social auto-post cards | ongoing |

---

## Outstanding Decisions (Action Required Before Building)

1. **Hero image:** Source a high-quality editorial car image for the homepage hero. Use a licensed image (Unsplash/Pexels at minimum, commissioned shoot eventually). No watermarks.
2. **Domain:** Register domain and point to Vercel when ready.
3. **Apify account:** Create at apify.com, get API token, add `APIFY_API_TOKEN` to env.
4. **Supabase project:** Create new project at supabase.com, copy URL and anon key.
5. **Brand list:** Confirm final list of tracked brands. Current list covers the top 10 UAE luxury/exotic segments.
6. **Minimum price threshold:** Currently AED 150,000. Adjust if needed.

---

## Notes for the Building Agent

- Follow all component/file paths exactly as specified — the import structure assumes this layout
- Run `npm run build` before declaring any phase complete — catch type errors early
- The scraper's `normalizeDubizzle()` function will need tuning once you see actual Apify response shapes — log the raw response on first run and adjust field mappings
- `PriceHistoryChart` component is not implemented above — use `recharts` with a custom dark theme: charcoal background, single gold line, no grid lines, minimal axes
- All monetary values store as integers (AED, no decimals)
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client — it is server-only
