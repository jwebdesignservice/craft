# CURRENT.md — Live Project State
Last updated: 2026-03-30 11:30 GMT (George — token optimisation pass)

---

## ClauseKit
**Status:** Active development — live at https://clausekit-lemon.vercel.app
**Repo:** github.com/jwebdesignservice/Clause-Kit
**Local:** C:\Users\Jack\Desktop\AI Website\htdocs\Websites\clausekit
**Branch:** main (HEAD: 0557830)

**Open items:**
- File-based JSON stores (contract-store, payment-store) won't scale to multi-instance — future fix
- `lib/contractTypes.ts` orphaned dead code — candidate for deletion
- `/api/payment/webhook` is unsigned stub — Stripe should point to `/api/webhooks/stripe`

---

## Primrose Ever Care
**Status:** Live — https://www.primroseevercare.co.uk
**Repo:** github.com/jwebdesignservice/Primrose-evercare
**Local:** C:\Users\Jack\Desktop\AI Website\htdocs\Websites\primrose-ever-care
**Branch:** main (nightly/2026-03-29 merged)

**Tonight's task:** Performance/structured data — JSON-LD LocalBusiness schema, image priority audit, meta description review

**⚠️ Action required:**
- RESEND_API_KEY not added to Vercel — emails won't send until added (Settings → Environment Variables)

---

## Desert Falcons
**Status:** Live — https://desert-falcons.vercel.app
**Repo:** jwebdesignservice/desert-falcons
**Local:** C:\Users\Jack\Desktop\AI Website\htdocs\Websites\desert-falcons
**Branch:** main

**Pending branches (awaiting operator review):**
- `nightly/2026-03-28` — 5th audit pass, DEV-IN-PROGRESS.md updated
- `nightly/2026-03-29` — M8 (tuwaiq bg image), H1 (portal nav link on 9 public pages), M6 (noindex on 11 portal pages)

**Tonight's task:** M3 — Join form conditional field visibility (join-form.js change listener)

**⚠️ Action required:**
- Merge queue: `merge nightly/2026-03-28` → then `merge nightly/2026-03-29`
- Encoding: public pages are UTF-16 LE, portal pages are UTF-8 — nightly agent briefed

**Open items (from DEV-IN-PROGRESS.md):**
- M2: No canonical links on public pages
- M4: Arabic success state hardcoded English
- M5: i18n.js load order fix
- M7: Meta descriptions on portal pages
- L1: robots.txt + sitemap.xml missing
- OG images use square logo not hero image

---

## Nightly Crons
- Primrose: 379c10e8 — 2am GMT
- Desert Falcons: 0a760b2a — 2:30am GMT
- ClauseKit audit: 1dd14aa5 — 3am GMT
- Synthesis: 4bfaf407 — 4am GMT

---

## Paperclip
**URL:** http://127.0.0.1:3100
**Company ID:** c5c50fe7-618c-453f-923b-fcfa7baf6f64

---

## Known Issues
- Dev agent (f93dc400) heartbeat returning "Agent not found" — recurring, uninvestigated
- Nightly backup cron (0352286c) — last run status: error (message delivery issue) — monitor tonight
