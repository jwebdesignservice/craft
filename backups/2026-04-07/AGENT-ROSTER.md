# AGENT-ROSTER.md — Single Source of Truth

*Every agent reads this. Every agent knows the full team.*
*Last updated: 2026-04-04*

---

## The Team

### ⚡ George — Main Executor
- **Agent ID:** `main`
- **Discord channel:** #george (`1485576662362882162`)
- **Model:** anthropic/claude-opus-4-5
- **Workspace:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\Project Manager`
- **SessionKey:** `agent:main:discord:channel:1485576662362882162`
- **Role:** Full-access executor. Code, shell, deploys, Paperclip, crons, Discord, git.
- **CAN:** Everything — run shell commands, deploy to Vercel, manage GitHub, create Paperclip tasks, manage crons, send/read Discord messages, read/write files, restart OpenClaw
- **CANNOT:** Auto-merge to main without explicit operator approval. Strategise (that's Oracle's job).

---

### 🔮 Oracle — Strategy & Planning
- **Agent ID:** `oracle`
- **Discord channel:** #oracle (`1485587083102781586`)
- **Model:** anthropic/claude-opus-4-5
- **Workspace:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\Project Manager\oracle-workspace`
- **SessionKey:** `agent:oracle:discord:channel:1485587083102781586`
- **Role:** PM and strategist. Breaks briefs into tasks. Creates Paperclip tasks via exec. Does NOT deploy or merge.
- **CAN:** Web research, file read/write, create Paperclip tasks via exec, send Discord messages
- **CANNOT:** exec shell for builds/deploys, call localhost APIs via web_fetch, deploy, modify OpenClaw config

---

### 🧠 Kimi — Deep Research
- **Agent ID:** `kimi`
- **Discord channel:** #kimi (`1485587455083151391`)
- **Model:** nvidia-nim/moonshotai/kimi-k2-instruct
- **Workspace:** `C:\Users\Jack\.openclaw\workspace`
- **SessionKey:** `agent:kimi:discord:channel:1485587455083151391`
- **Role:** Long-form research, competitive intel, deep analysis. Text in, text out.
- **CAN:** Research, analysis, strategic thinking (text only)
- **CANNOT:** Everything else — no tools, no exec, no file access, no API calls
- **Note:** Kimi has NO tools. Pure reasoning model. Don't send it tasks requiring execution.

---

### 🌸 Primrose — Nightly Dev Agent
- **Agent ID:** `primrose-ever-care`
- **Discord channel:** #primrose-nightly (`1485582161137635500`)
- **Model:** anthropic/claude-opus-4-5
- **Workspace:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\primrose-ever-care`
- **Cron ID:** `379c10e8-843f-4b83-b699-19e3237d6e06`
- **Schedule:** 2:00am GMT daily (currently DISABLED — project complete)
- **Role:** Overnight dev agent for Primrose Ever Care. Reads AGENT-BRIEF.md, executes, pushes nightly branch.
- **CAN:** Code changes, npm build, git commit/push to nightly branch only
- **CANNOT:** Merge to main, deploy to Vercel, modify OpenClaw config

---

### 🦅 Falcon — Nightly Dev Agent
- **Agent ID:** `desert-falcons`
- **Discord channel:** #desert-falcons-nightly (`1485582181303849012`)
- **Model:** anthropic/claude-opus-4-5
- **Workspace:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\desert-falcons`
- **Cron ID:** `0a760b2a-2aac-4646-9d76-ef89c60f38b1`
- **Schedule:** 2:30am GMT daily
- **Role:** Overnight dev agent for Desert Falcons. Vanilla HTML/CSS/JS only (no npm).
- **CAN:** Code changes, git commit/push to nightly branch only
- **CANNOT:** Merge to main, deploy, run npm, write copy (brand not confirmed)

---

## Supporting Agents (Cron-Driven)

### 🐛 Debug Agent
- **Cron ID:** `32c44a8d-7afe-4242-9fc4-0a8ad9a88e46`
- **Schedule:** 3:15am GMT daily
- **Role:** Post-nightly sanity checker. Verifies branches build. Reports issues to #george.

### 🌅 Synthesis Agent
- **Cron ID:** `4bfaf407-1cff-4c83-9c0a-235782a71c78`
- **Schedule:** 4:00am GMT daily
- **Posts to:** #george (`1485576662362882162`)
- **Role:** Morning handover. Reads nightly reports, updates CURRENT.md and AGENT-BRIEF files.

---

## Paperclip Specialists

All triggered by heartbeat scheduler (`f6bb708a`, every hour) when inbox has work.
Output → `paperclip-output/[project]/`

| Agent | ID | Handles |
|---|---|---|
| Dev | `f93dc400-e141-4130-bac1-21db16803e9d` | Code, builds, debugging |
| Copywriter | `861e3ef0-65f9-43f2-b0f5-63e73ebb96aa` | Copy, emails, descriptions |
| Scriptwriter | `34403575-0491-4750-9bca-065223efbc6f` | Video/ad scripts |
| Social | `42dbde88-f0a4-48fd-ae0a-38ecdbea4ae8` | Branded social posts |
| SEO | `af5632b0-50a3-4c57-9448-74eb900e8f87` | Keywords, on-page SEO |
| Marketing | `4b295d83-bbec-4b42-a08a-a127ddc9bba3` | Campaign strategy, GTM |
| Ads | `39dac44c-8f58-4525-bc98-82105115aee7` | Google/Meta ad copy |
| Outreach | `750e1aeb-d589-462f-afca-453fa4ca2964` | Cold email, LinkedIn |
| Analytics | `d087e120-8162-4fed-bb44-3cd91e25d509` | KPI plans, metrics |
| Video | `1ae5bdf9-5884-47c2-b467-64b225d76f4f` | Video production briefs |
| Visual Director | `35d45b16-ab3d-45ca-b3be-9d9e7f150762` | Design briefs, visual QA |

---

## Discord Channel Map (guild: 1471449053220044935)

**Command**
- #george — `1485576662362882162`
- #kimi — `1485587455083151391`
- #oracle — `1485587083102781586`

**Projects**
- #primrose-ever-care — `1485576732810678272`
- #desert-falcons — `1485576753509302373`
- #fast-launch — `1485688058266521790`
- #clausekit — `1487562759137919158`
- #fibbot — `1487568849866985704`
- #aj-gammond — `1489214800071360512`

**Nightly**
- #primrose-nightly — `1485582161137635500`
- #desert-falcons-nightly — `1485582181303849012`
- #clausekit-nightly — `1486498003715096858`

**System**
- #errors — `1485697827324825611`
- #design — `1485591738402996294`

---

## Operators (full trust, equal authority)

| Name | Discord | ID | Timezone |
|---|---|---|---|
| wils (Jack Wilson) | jackwilson7 | `809133430315024384` | GMT |
| JMoon | jmoon_174 | `1370781720563024089` | GMT |

---

## Cross-Agent Communication

**How to reach an agent:**
```
sessions_send(
  sessionKey="agent:[agentId]:discord:channel:[channelId]",
  message="...",
  timeoutSeconds=30
)
```

- Fire-and-forget: `timeoutSeconds=0`
- Wait for reply: `timeoutSeconds=30`
- Stop ping-pong: agent replies `REPLY_SKIP`

**Discord routing does NOT work between agents** — all agents share one bot user, self-message filter drops them.

**Rules:**
- Only operators can authorise cross-agent handoffs
- Bot messages don't auto-trigger other agents
- File handoffs are reliable; Discord messages between agents are not
