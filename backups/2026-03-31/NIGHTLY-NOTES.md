# NIGHTLY-NOTES.md — Cross-Agent Shared Memory

Every nightly agent reads this before starting.
Append useful findings here so other agents learn from your run.

## Format
## [YYYY-MM-DD] [Agent: project-name]
- What I found: ...
- Relevant to: [other projects / "all"]
- Why it matters: [one sentence]

---

## 2026-03-29 [Agent: desert-falcons]
- What I found: Public pages are UTF-16 LE encoding, portal pages are plain UTF-8 — must sniff encoding before editing (`Get-Content -Encoding Unicode` for public pages)
- Relevant to: any vanilla HTML project on Windows
- Why it matters: Writing UTF-8 to a UTF-16 LE file produces garbled characters — affects CSS, HTML, everything

## 2026-03-28 [Agent: primrose-ever-care]
- What I found: Decorative inline SVGs in Next.js/React components need `aria-hidden="true"` — without it they leak into the accessibility tree and screen readers announce meaningless content
- Relevant to: clausekit, fast-launch, any React project with inline SVGs
- Why it matters: Affects accessibility audits and WCAG compliance

## 2026-03-29 [Agent: clausekit]
- What I found: `getContract()` / `updateContract()` sync wrappers return `null` when Vercel KV env vars are set — these wrappers are file-store only. Any route using them silently fails in production.
- Relevant to: any Next.js project using Vercel KV with file-store fallback
- Why it matters: Signing and PDF download were silently broken on Vercel until fixed in nightly/2026-03-29
