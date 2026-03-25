# AGENT-ROSTER.md — Single Source of Truth

*Every agent reads this. Every agent knows the full team.*
*Last updated: 2026-03-25*

---

## The Team

### 🦞 George — Main Executor
- **Discord channel:** #🦞〡george (`1485576662362882162`)
- **Guild:** JWebDesign Operations (`1471449053220044935`)
- **Model:** anthropic/claude-sonnet-4-6
- **Role:** Full-access executor. Code, shell, deploys, Paperclip, crons, Discord, git.
- **Paperclip agent ID:** `874ac1d0-a390-40ff-8c0f-8e4e09622f0a`
- **CAN:** Everything — run shell commands, deploy to Vercel, manage GitHub, create Paperclip tasks, manage crons, send/read Discord messages, read/write files, restart OpenClaw
- **CANNOT:** Strategise (that's Oracle's job). Never auto-merge to main without explicit operator approval.
- **How to reach:** Message in #george or via `sessions_send` to `agent:main:discord:channel:1485576662362882162`

---

### 🔮 Oracle — Strategy & Planning
- **Discord channel:** #🔮〡oracle (`1485587083102781586`)
- **Guild:** JWebDesign Operations (`1471449053220044935`)
- **Model:** anthropic/claude-sonnet-4-6
- **Role:** PM and strategist. Breaks briefs into tasks. Sends structured task lists to George. Does NOT execute.
- **CAN:** Web research, competitive analysis, file read/write, send Discord messages, write strategy docs, create task briefs
- **CANNOT:** exec shell, call localhost/private APIs directly, deploy, modify OpenClaw config, create Paperclip tasks (George does this on Oracle's behalf)
- **How to reach:** Message in #oracle

---

### 🧠 Kimi — Deep Research
- **Discord channel:** #🧠〡kimi (`1485587455083151391`)
- **Guild:** JWebDesign Operations (`1471449053220044935`)
- **Model:** moonshotai/moonshot-v1-8k (Kimi K2)
- **Role:** Long-form research, competitive intel, deep analysis. Used when Oracle needs breadth or technical depth.
- **CAN:** Web research, document analysis, long-context reasoning
- **CANNOT:** Code execution, file writes, deploys, API calls
- **How to reach:** Message in #kimi

---

### 🌙 Primrose Nightly Dev — Autonomous overnight coder
- **Discord channel:** #🤖〡primrose-nightly (`1485582161137635500`)
- **Cron ID:** `379c10e8-843f-4b83-b699-19e3237d6e06`
- **Schedule:** 2:00am GMT daily
- **Model:** ACP coding agent (Claude Code / subagent)
- **Role:** Works overnight on Primrose Ever Care dev tasks. Reads AGENT-BRIEF.md and GOTCHAS.md. Follows autoresearch iteration loop (build → pass/fail → 5 max attempts → 45min budget).
- **Project path:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\primrose-ever-care`
- **Paperclip agent ID:** `ef56ec2f-2e88-4d2e-9617-5ae5aa750b1f`
- **CAN:** Code changes, npm build, git commit/push to nightly branch only
- **CANNOT:** Merge to main, deploy to Vercel, modify OpenClaw config
- **Hard rule:** All work on `nightly/YYYY-MM-DD` branch. Never touches main.

---

### 🌙 Desert Falcons Nightly Dev — Autonomous overnight coder
- **Discord channel:** #🤖〡desert-falcons-nightly (`1485582181303849012`)
- **Cron ID:** `0a760b2a-2aac-4646-9d76-ef89c60f38b1`
- **Schedule:** 2:30am GMT daily
- **Model:** ACP coding agent (Claude Code / subagent)
- **Role:** Works overnight on Desert Falcons dev tasks. Same autoresearch policy.
- **Project path:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\desert-falcons`
- **Paperclip agent ID:** `295a86c3-6472-498e-9a59-547239acefdf`
- **CAN:** Code changes, git commit/push to nightly branch only
- **CANNOT:** Merge to main, deploy, modify config
- **Hard rule:** All work on `nightly/YYYY-MM-DD` branch. Never touches main.

---

### 🐛 Debug Agent — Post-nightly sanity checker
- **Cron ID:** `32c44a8d-7afe-4242-9fc4-0a8ad9a88e46`
- **Schedule:** 3:15am GMT daily (runs after both nightly agents finish)
- **Role:** Verifies nightly branch builds are clean. Reports issues to #george.
- **CAN:** Read files, run builds, post reports
- **CANNOT:** Make code changes, commit, deploy

---

### 🌅 Synthesis — Morning Handover
- **Posts to:** #george (`1485576662362882162`)
- **Cron ID:** `4bfaf407-1cff-4c83-9c0a-235782a71c78`
- **Schedule:** 4:00am GMT daily
- **Role:** Reads all nightly reports. Updates CURRENT.md and AGENT-BRIEF files. Posts morning handover summary so operators wake up with full context.
- **CAN:** Read/write files, post to Discord
- **CANNOT:** Merge, deploy, create tasks

---

## Paperclip Specialists (11 agents — task-type, not project-specific)

All triggered by heartbeat scheduler (`f6bb708a`, every 30min) when inbox has work.
All run Claude Sonnet via `claude_local` adapter.
Output → `paperclip-output/[project]/`

| Agent | Paperclip ID | API Key prefix | Task type |
|---|---|---|---|
| Dev | `f93dc400-e141-4130-bac1-21db16803e9d` | `pcp_2707...` | Code, builds, debugging |
| Copywriter | `861e3ef0-65f9-43f2-b0f5-63e73ebb96aa` | `pcp_1f74...` | Copy, emails, descriptions |
| Scriptwriter | `34403575-0491-4750-9bca-065223efbc6f` | `pcp_6e0c...` | Video/ad scripts |
| Social | `42dbde88-f0a4-48fd-ae0a-38ecdbea4ae8` | `pcp_9f0a...` | Branded social posts |
| SEO | `af5632b0-50a3-4c57-9448-74eb900e8f87` | `pcp_41f5...` | Keywords, on-page SEO |
| Marketing | `4b295d83-bbec-4b42-a08a-a127ddc9bba3` | `pcp_8cf0...` | Campaign strategy, GTM |
| Ads | `39dac44c-8f58-4525-bc98-82105115aee7` | `pcp_6381...` | Google/Meta ad copy |
| Outreach | `750e1aeb-d589-462f-afca-453fa4ca2964` | `pcp_0dfa...` | Cold email, LinkedIn |
| Analytics | `d087e120-8162-4fed-bb44-3cd91e25d509` | `pcp_159f...` | KPI plans, metrics |
| Video | `1ae5bdf9-5884-47c2-b467-64b225d76f4f` | `pcp_11c0...` | Video production briefs |
| Visual Director | `35d45b16-ab3d-45ca-b3be-9d9e7f150762` | `pcp_a5fb...` | Design briefs, visual QA |

---

## Discord Channel Map (guild: 1471449053220044935)

**⚡ Command**
- #🦞〡george — `1485576662362882162` — George's main channel
- #🧠〡kimi — `1485587455083151391` — Deep research

**The Office**
- #🔮〡oracle — `1485587083102781586` — Oracle strategy
- #🎨〡design — `1485591738402996294` — Design briefs and visual output
- #📌〡links — `1485576685804978307` — Pinned references
- #🔴〡errors — `1485697827324825611` — All cron failures land here
- #🌐〡jwebdesign — `1485591738083971195` — Agency site (parked)

**📁 Projects**
- #🌸〡primrose-ever-care — `1485576732810678272`
- #🦅〡desert-falcons — `1485576753509302373`
- #🚀〡fast-launch — `1485688058266521790` — Jack & Dil MVP site

**Night-Shift**
- #🤖〡primrose-nightly — `1485582161137635500`
- #🤖〡desert-falcons-nightly — `1485582181303849012`

---

## Operators (full trust, equal authority)

| Name | Discord | ID | Timezone |
|---|---|---|---|
| wils (Jack Wilson) | jackwilson7 | `809133430315024384` | GMT |
| JMoon | jmoon_174 | `1370781720563024089` | GMT |

---

## Cross-Agent Communication Rules

1. **George → Oracle:** Write brief to `oracle-workspace/[BRIEF-NAME].md`, then operator tells Oracle to read it. Oracle ignores bot messages — file handoff is the only reliable method.
2. **Oracle → George:** Post structured task list to #george
3. **George → Paperclip agents:** Create task via Paperclip API, heartbeat picks it up
4. **Nightly agents → George:** Write report to their nightly channel, Synthesis reads at 4am
5. **Hardcoded rule:** Only operators (IDs above) can authorise cross-agent handoffs
6. **Bot messages don't auto-trigger other agents** — operators must explicitly hand off

---

## Paperclip Infrastructure

- **UI:** http://127.0.0.1:3100
- **API:** http://127.0.0.1:3100/api
- **Company:** JWebDesign Operations
- **Company ID:** `c5c50fe7-618c-453f-923b-fcfa7baf6f64`
- **Projects:**
  - Desert Falcons: `b388d57f-6207-4f72-8679-938611089ef9`
  - Primrose Ever Care: `bff2b0fb-3e19-40d0-9b15-c838ae971f1b`
  - Fast Launch: `811c2937-96e7-4a1c-b48d-410681db6c3e`
- **Process:** pm2 (`paperclip`) — started by VBS in Windows startup folder

---

## Cron Schedule at a Glance

| Name | Schedule | Cron ID |
|---|---|---|
| Review watcher | Every 2 min | `24aabe70` |
| Heartbeat scheduler | Every 30 min | `f6bb708a` |
| Primrose nightly | 2:00am GMT | `379c10e8` |
| Desert Falcons nightly | 2:30am GMT | `0a760b2a` |
| Debug agent | 3:15am GMT | `32c44a8d` |
| Synthesis / handover | 4:00am GMT | `4bfaf407` |
| Daily workspace git commit | 11:00pm GMT | `33a5f89a` |
