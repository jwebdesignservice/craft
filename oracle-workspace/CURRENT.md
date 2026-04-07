# CURRENT.md — Live Project State
Last updated: 2026-04-07 11:15 GMT (Synthesis Agent — Morning Handover)

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
**Status:** ✅ COMPLETE — removed from system 2026-04-01
**Live URL:** https://www.primroseevercare.co.uk

Project finished. Channels deleted, cron disabled, agent binding removed.

**Note:** RESEND_API_KEY still needs adding to Vercel if emails are required.

---

## Desert Falcons
**Status:** Live — https://desert-falcons.vercel.app
**Repo:** jwebdesignservice/desert-falcons
**Local:** C:\Users\Jack\Desktop\AI Website\htdocs\Websites\desert-falcons
**Branch:** main

**Pending branches (awaiting operator review):**
- `nightly/2026-03-28` — 5th audit pass, DEV-IN-PROGRESS.md updated
- `nightly/2026-03-29` — M8 (tuwaiq bg image), H1 (portal nav link on 9 public pages), M6 (noindex on 11 portal pages)
- `nightly/2026-03-30` — M7 (portal meta desc), M2 (canonical links), M3 (join form field visibility)
- `nightly/2026-03-31` — M4 (Arabic success state), L1 (robots.txt + sitemap.xml), M5 (i18n load order)
- `nightly/2026-04-01` — M1 (OG hero images), PM1 (discussion maxlength), L8 (join button aria-label)
- `nightly/2026-04-02` — PM4 (focus trap on portal mobile menu), PM3 (dashboard activity feed empty state)
- `nightly/2026-04-03` — PL1 (founders-hero.jpg compressed 73%), L5 (removed redundant setTimeout loaders)

**Tonight's run (2026-04-07):** No changes — agent confirmed audit queue cleared. Standing down.

**⚠️ Action required:**
- Merge queue: `merge nightly/2026-03-28` → `nightly/2026-03-29` → `nightly/2026-03-30` → `nightly/2026-03-31` → `nightly/2026-04-01` → `nightly/2026-04-02` → `nightly/2026-04-03`
- PM2 (Supabase avatar bucket verification) — requires operator action
- Encoding: public pages are UTF-16 LE, portal pages are UTF-8 — nightly agent briefed
- 🎯 **COMPLETE:** All HIGH/MEDIUM/LOW automated fixes shipped. Only operator-verification items remain.

**Remaining (operator-only):**
- PM2: Verify Supabase avatar bucket setup
- PL2: Add favicon.svg to portal pages (cosmetic)
- PL3: Verify admin analytics widget in production

---

## Nightly Crons
- Primrose: 379c10e8 — DISABLED (project complete)
- Desert Falcons: 0a760b2a — 2:30am GMT (STANDING DOWN — no automated work remains)
- ClauseKit audit: 1dd14aa5 — 3am GMT
- Synthesis: 4bfaf407 — 4am GMT

---

## Paperclip
**URL:** http://127.0.0.1:3100
**Company ID:** c5c50fe7-618c-453f-923b-fcfa7baf6f64

---

## Known Issues
- Dev agent (f93dc400) heartbeat returning "Agent not found" — recurring, uninvestigated
- Nightly backup cron (0352286c) — last run status: error (message delivery issue) — monitor
- Debug agent cron may not be running — no DEBUG REPORT found in #george for 2026-04-07
