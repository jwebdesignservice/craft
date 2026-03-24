# CURRENT.md — Live State

Last updated: 2026-03-24

---

## Active Projects

### Primrose Ever Care
- **Status:** Live at https://primrose-ever-care.vercel.app
- **Done:** All pages ✅ Contact form (Resend integration) ✅
- **Remaining:** SEO metadata pass (tonight) → then project complete
- **Repo:** github.com/jwebdesignservice/Primrose-evercare (main is up to date)
- **Pending operator action:** Add `RESEND_API_KEY` to Vercel env vars (Settings → Environment Variables) — emails won't send at runtime without it
- **Contract:** Signed with Aminah Carew — project live and paid
- **Nightly branch ready to merge:** nightly/2026-03-24

### Desert Falcons
- **Status:** Active — main branch live
- **Repo:** jwebdesignservice/desert-falcons
- **Done:** Full site built, Arabic RTL i18n, full audit (DEV-IN-PROGRESS.md with 258-line fix list)
- **Remaining:** HIGH-priority fixes (nav portal link, wire jebel-tuwaiq.jpg, portal noindex meta) → medium/low fixes → copy pass (BLOCKED on brand sign-off)
- **Nightly branch ready to merge:** nightly/2026-03-24

---

## System State

- Paperclip: Running on port 3100 ✅
- Paperclip startup VBS: installed in Windows startup folder ✅
- Heartbeat scheduler: cron f6bb708a — fires every 30 min ✅
- Review watcher: Active, every 2 min, port 3100 ✅
- Oracle: claude-sonnet-4-6, session clean ✅
- All crons: Healthy ✅
- Nightly policy: Isolation + autoresearch iteration loop locked in ✅
- OPENCLAW_TOKEN: persistent user env var ✅

---

## Blocked / Pending Operator Decision

- Desert Falcons brand/tone — copy and SEO tasks blocked until confirmed
- Primrose RESEND_API_KEY — must be added to Vercel env vars before emails work in production
- Paperclip daemon auto-restart — VBS only, no restart on crash (Task Scheduler needs elevated perms)

---

## Done Last Night (2026-03-24 nightly)

- **Primrose:** Contact form email integration complete — `/api/contact` route created, Resend wired, lazy-init fix for build. nightly/2026-03-24 pushed, ready to merge.
- **Desert Falcons:** Full site audit completed — DEV-IN-PROGRESS.md created with prioritised findings across 9 public pages + 11 portal pages. nightly/2026-03-24 pushed, ready to merge.
- **Debug agent:** Both projects CLEAN. No main contamination, no broken commits.
