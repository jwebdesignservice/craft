# Session: 2026-03-24 11:04:58 UTC

- **Session Key**: agent:main:discord:channel:1485582181303849012
- **Session ID**: bf8a53c6-3eb7-4833-82b1-6e18db1ab9e8
- **Source**: discord

## Conversation Summary

assistant: 🌙 Desert Falcons Nightly — 2026-03-24
**Task:** Full site audit — both public marketing site and portal, prioritised fix list
**Done:** Complete audit of all 9 public pages + 11 portal pages. `DEV-IN-PROGRESS.md` created with full prioritised findings (URGENT / HIGH / MEDIUM / LOW)
**Files changed:** `DEV-IN-PROGRESS.md` (new — 258 lines)
**Build:** N/A (vanilla HTML)
**Branch:** nightly/2026-03-24 (ready to merge)

**Notes:**
- No broken 404s, no missing assets, no broken auth flow — site is structurally solid
- **Top issues to action next:**
  - 🔴 HIGH: No portal link in public nav (`.nav-portal` CSS class exists but is never used in HTML — dead class)
  - 🔴 HIGH: `jebel-tuwaiq.jpg` image exists but vision page still shows a CSS placeholder — asset is ready to wire in
  - 🟡 MED: All OG share images use the square logo (512×512) instead of a hero image — bad social previews
  - 🟡 MED: No canonical links on public pages
  - 🟡 MED: Join form specialization dropdown doesn't swap when role changes to Designer/Investor
  - 🟡 MED: Arabic success state on join form is hardcoded English
  - 🟡 MED: All portal pages missing `noindex` meta
  - 🟢 LOW: Dual loader timers on several pages (harmless but redundant)
  - 🟢 LOW: No `robots.txt` or `sitemap.xml`
