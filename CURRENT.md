# CURRENT.md — Live State

Last updated: 2026-03-23

---

## Active Projects

### Primrose Ever Care
- **Status:** Live at https://primrose-ever-care.vercel.app
- **Done:** Homepage ✅ Contact ✅ Services ✅ About ✅ Cookies Policy ✅ Cookie Banner ✅ Areas We Cover ✅ Complaints ✅ Privacy Policy ✅ Safeguarding ✅
- **Remaining:** Contact form email integration only (JWE-2)
- **Repo:** github.com/jwebdesignservice/Primrose-evercare (main is up to date)
- **Contract:** Signed with Aminah Carew — project live and paid
- **Next nightly task:** Contact form email integration (Resend/Formspree)

### Desert Falcons
- **Status:** Active — main branch live
- **Repo:** jwebdesignservice/desert-falcons
- **Done:** Full site built (all pages)
- **Remaining:** Site audit (tonight) → fix pass → copy pass (BLOCKED on brand sign-off)
- **Next nightly task:** Full site audit (fires 2:30am GMT)

---

## System State

- Paperclip: Running on port 3100 ✅
- Paperclip startup VBS: installed in Windows startup folder ✅
- Heartbeat scheduler: cron f6bb708a — fires every 30 min ✅
- Review watcher: Active, every 2 min, port 3100 ✅
- Oracle: claude-sonnet-4-6, session clean ✅
- All 6 crons: Healthy, 0 errors ✅
- Nightly policy: Isolation + autoresearch iteration loop locked in ✅
- OPENCLAW_TOKEN: persistent user env var ✅
- All 11 Paperclip agents: API keys generated, cwd set ✅

---

## Blocked / Pending Operator Decision

- Desert Falcons brand/tone — copy and SEO tasks blocked until confirmed
- Paperclip daemon auto-restart — VBS only, no restart on crash (Task Scheduler needs elevated perms)

---

## Done This Session (2026-03-23)

- Full system rebuild — foundation files, agents, crons, channels
- Oracle session fixed and running on Sonnet
- Nightly cron iteration loop + isolation policy (autoresearch pattern)
- All 9 plan steps completed + 6 critical bug fixes
- All 11 Paperclip agent API keys generated + cwd configured
- Heartbeat scheduler cron created
- Primrose site effectively complete — all pages built and pushed to main
- Delivery queue cleared (70 stale failures removed)
