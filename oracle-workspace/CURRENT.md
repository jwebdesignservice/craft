# CURRENT.md — Live Project State
Last updated: 2026-03-28 21:30 GMT (synthesis agent)

---

## ClauseKit
**Status:** Active development — live at https://clausekit-lemon.vercel.app
**Repo:** github.com/jwebdesignservice/Clause-Kit
**Local:** C:\Users\Jack\Desktop\AI Website\htdocs\Websites\clausekit
**Branch:** main (HEAD: 0557830)

### What's live:
- Homepage with rich SVG section backgrounds, UK-only positioning, sharp copy
- Full dashboard with trust banner, stats, Quick Start tiles, My Contracts
- IntakeWizard: £ currency inputs, validation with field names, encoding fixed, portfolioRight toggle removed
- Contract viewer/editor: two-panel layout (65% editable doc / 35% sidebar)
  - Editable document — contentEditable paragraphs, debounced 500ms save to localStorage
  - Sidebar tabs: Parties, Contract Details, Key Terms
  - Download paywall at £7 via Stripe (not at view/edit stage)
  - My Contracts rows clickable → opens contract viewer
- OpenAI API key wired to Vercel env vars + .env.local
- Contract generation navigates straight to contract-view tab after generate

### Open items:
- ⚠️ RESEND_API_KEY not yet added to Vercel (ClauseKit doesn't use email — N/A)
- File-based JSON stores (contract-store, payment-store) won't scale to multi-instance — flagged by nightly audit for future fix
- lib/contractTypes.ts is orphaned dead code — candidate for deletion
- /api/payment/webhook is unsigned stub — Stripe should point to /api/webhooks/stripe

---

## Primrose Ever Care
**Status:** Live — https://www.primroseevercare.co.uk
**Repo:** github.com/jwebdesignservice/Primrose-evercare
**Local:** C:\Users\Jack\Desktop\AI Website\htdocs\Websites\primrose-ever-care
**Branch:** main (nightly/2026-03-29 merged — 2026-03-29 ~11:55 GMT)

### What's live:
- SEO metadata pass (OG tags, canonical links, metadataBase, title template) — all 9 pages
- Accessibility fixes: ContactForm label wrapping, step progress aria, CookieBanner aria-hidden, decorative SVG aria-hidden
- Contact form wired to Resend API

### ⚠️ Action required — operators:
- **AGENT-BRIEF.md** — update to next task (Performance audit / JSON-LD schema) before tonight's run
- ⚠️ RESEND_API_KEY not added to Vercel — emails won't send until this is done
  → Add in Vercel dashboard: Settings → Environment Variables

---

## Desert Falcons
**Status:** Live — https://desert-falcons.vercel.app
**Repo:** jwebdesignservice/desert-falcons
**Local:** C:\Users\Jack\Desktop\AI Website\htdocs\Websites\desert-falcons
**Branch:** main (nightly/2026-03-28 + nightly/2026-03-29 PENDING OPERATOR REVIEW)

### What's live on main:
- 5 passes of full site audit (public + portal)
- i18n wrapping across portal pages
- approved/rejected translation keys fixed in portal-i18n.js
- DEV-IN-PROGRESS.md comprehensive — 5th pass complete

### Pending branches (awaiting operator review):
- `nightly/2026-03-28` — 5th audit pass, DEV-IN-PROGRESS.md updated, L10 new finding
- `nightly/2026-03-29` — M8 (tuwaiq bg image), H1 (portal nav link on 9 public pages), M6 (noindex on 11 portal pages)

### Tonight's agent will work on:
- M3: Join form conditional field visibility (show/hide fields based on role selection) — join-form.js event listener

### Open items (from DEV-IN-PROGRESS.md):
- M2: No canonical links on public pages
- M3: Join form field show/hide logic — **TONIGHT**
- M4: Arabic success state hardcoded English
- M5: i18n.js load order preventative fix
- M7: Meta descriptions on portal pages
- L1: robots.txt + sitemap.xml missing
- OG images use square logo not hero image

### ⚠️ Action required — operators:
- **Merge queue:** `merge nightly/2026-03-28` → then `merge nightly/2026-03-29`
- **Encoding note:** Public pages are UTF-16 LE, portal pages are plain UTF-8 — nightly agent has been briefed on this

---

## Nightly Crons (tonight — 2am/2:30am/3am/4am GMT)
- Primrose: cron 379c10e8 — 2am
- Desert Falcons: cron 0a760b2a — 2:30am
- ClauseKit audit: cron 1dd14aa5 — 3am
- Synthesis: cron 4bfaf407 — 4am

### Tonight's briefs (updated 2026-03-29 04:00 by synthesis):
- Primrose: Performance/structured data pass — JSON-LD LocalBusiness schema, image priority audit, meta description review
- Desert Falcons: M3 — Join form conditional field visibility (join-form.js change listener)

---

## Paperclip
**URL:** http://127.0.0.1:3100
**Company ID:** c5c50fe7-618c-453f-923b-fcfa7baf6f64

---

## Known Issues
- Dev agent (f93dc400) heartbeat returning "Agent not found" — recurring, uninvestigated
- Paperclip API base confirmed on port 3100
