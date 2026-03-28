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
**Branch:** main (nightly/2026-03-26 merged — 2026-03-27 and 2026-03-28 PENDING OPERATOR REVIEW)

### What's live:
- SEO metadata pass (OG tags, canonicals, title templates) — all 8+ pages
- Accessibility fixes: ContactForm label wrapping, step progress aria, CookieBanner aria-hidden
- Contact form wired to Resend API

### ⚠️ Action required — operators:
- **AGENT-BRIEF.md is stale** — still shows SEO task (completed 2026-03-25). Agent has self-directed 2 nights on accessibility work. Operators must update brief to the next explicit task.
- **Two unmerged branches:** `nightly/2026-03-27` and `nightly/2026-03-28` — both are accessibility passes (decorative SVG aria-hidden). Recommend reviewing `nightly/2026-03-28` as it appears to be a superset. Issue `merge nightly/2026-03-28` when ready (2026-03-27 may be redundant).
- ⚠️ RESEND_API_KEY not added to Vercel — emails won't send until this is done
  → Add in Vercel dashboard: Settings → Environment Variables

---

## Desert Falcons
**Status:** Live — https://desert-falcons.vercel.app
**Repo:** jwebdesignservice/desert-falcons
**Local:** C:\Users\Jack\Desktop\AI Website\htdocs\Websites\desert-falcons
**Branch:** main (nightly/2026-03-27 + nightly/2026-03-28 PENDING OPERATOR REVIEW)

### What's live:
- 5 passes of full site audit (public + portal)
- i18n wrapping across portal pages
- approved/rejected translation keys fixed in portal-i18n.js
- DEV-IN-PROGRESS.md comprehensive — 5th pass complete, L10 (legal.html) new finding added

### Tonight's agent will fix:
- M8: Wire jebel-tuwaiq.jpg into vision.css (2-line fix)
- H1: Add portal nav link to all 9 public pages
- M6: Add noindex to all 11 portal pages

### Open items (from DEV-IN-PROGRESS.md):
- M2: No canonical links on public pages
- M3: Join form field show/hide logic not implemented
- M4: Arabic success state hardcoded English
- M5: i18n.js load order preventative fix
- M7: Meta descriptions on portal pages
- L1: robots.txt + sitemap.xml missing
- OG images use square logo not hero image

---

## Nightly Crons (tonight — 2am/2:30am/3am/4am GMT)
- Primrose: cron 379c10e8 — 2am
- Desert Falcons: cron 0a760b2a — 2:30am
- ClauseKit audit: cron 1dd14aa5 — 3am
- Synthesis: cron 4bfaf407 — 4am

### Agent briefs needed before tonight:
- Desert Falcons AGENT-BRIEF.md — update to target H1 (portal nav link, 9 pages) + M8 (jebel-tuwaiq.jpg)
- ClauseKit AGENT-BRIEF.md — update to reflect current state (contract viewer built, OpenAI key live)
- Primrose AGENT-BRIEF.md — mark near-complete, remind about RESEND_API_KEY

---

## Paperclip
**URL:** http://127.0.0.1:3100
**Company ID:** c5c50fe7-618c-453f-923b-fcfa7baf6f64

---

## Known Issues
- Dev agent (f93dc400) heartbeat returning "Agent not found" — recurring, uninvestigated
- Paperclip API base confirmed on port 3100
