# CURRENT.md — Live Project State
Last updated: 2026-03-26 17:44 GMT

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
**Branch:** main (nightly/2026-03-26 merged this morning)

### What's live:
- SEO metadata pass (OG tags, canonicals, title templates) — all 8+ pages
- Accessibility fixes: ContactForm label wrapping, step progress aria, CookieBanner aria-hidden
- Contact form wired to Resend API

### Open items:
- ⚠️ RESEND_API_KEY not added to Vercel — emails won't send until this is done
  → Add in Vercel dashboard: Settings → Environment Variables

---

## Desert Falcons
**Status:** Live — https://desert-falcons.vercel.app
**Repo:** jwebdesignservice/desert-falcons
**Local:** C:\Users\Jack\Desktop\AI Website\htdocs\Websites\desert-falcons
**Branch:** main (nightly/2026-03-26 merged, 6 agent-infra files cleaned up)

### What's live:
- 3 passes of full site audit (public + portal)
- i18n wrapping across portal pages
- approved/rejected translation keys fixed in portal-i18n.js
- Nav-toggle aria-label i18n on all public pages
- DEV-IN-PROGRESS.md updated with prioritised fix list

### Open items (from DEV-IN-PROGRESS.md):
- H1 (HIGH): No portal nav link on public site — .nav-portal CSS class exists, just needs HTML on 9 pages
- M8 (MED): jebel-tuwaiq.jpg not wired into vision.css — 2-line fix, image confirmed present
- Portal noindex meta missing on all portal pages
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
