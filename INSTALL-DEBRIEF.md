# JWebDesign Operations — Install Debrief
## Full feedback from George + Oracle for installer README

_Written: 2026-03-24. Based on a full day installation session (2026-03-23) building the system from point zero._

---

## OVERVIEW — What we built

A fully automated AI operations system for a web agency:

- **George** (Claude Sonnet) — primary operator agent, executes tasks, manages crons, interacts via Discord
- **Oracle** (Claude Sonnet) — strategy/PM layer, receives briefs, breaks into tasks, briefs George
- **Kimi K2** (NVIDIA NIM) — deep research model, separate agent bound to #kimi channel
- **Paperclip** — task management system with 11 specialist agents (Dev, Copywriter, SEO, etc.)
- **Nightly agents** — autonomous Claude Code runners on a cron schedule (2am, 2:30am, 3:15am, 4am)
- **Review watcher** — polls Paperclip every 2min, alerts operators when tasks need approval

---

## PART 1 — GEORGE'S DEBRIEF (execution layer)

### What was needed that wasn't in the starter file

**1. All workspace identity files — none existed:**
- `SOUL.md` — who George is, tone, behaviour rules
- `IDENTITY.md` — name, role, emoji
- `USER.md` — who the operators are
- `MEMORY.md` — hard facts (IDs, paths, credentials)
- `AGENTS.md` — SOPs for merge, nightly, hard stop, flow
- `OFFICE.md` — daily operating rules
- `CURRENT.md` — live project state
- `BUILD-SHEET.md` — full system spec
- `HEARTBEAT.md` — what to check on heartbeat
- `NIGHTLY-NOTES.md` — shared cross-agent memory

**Fix:** Include all of these as templates with placeholder sections in the installer.

---

**2. Paperclip setup was undocumented and had hidden blockers:**

- `requireBoardApprovalForNewAgents` was ON by default — silently blocked API key generation. Turn this OFF first.
- First attempt created per-project agents (wrong). Correct model: **task-type specialists** (Dev, Copywriter, SEO, etc.) not per-project agents.
- Every agent needs these `adapterConfig` fields set or Claude Code won't execute:
  - `cwd` — working directory
  - `model` — `claude-sonnet-4-6`
  - `dangerouslySkipPermissions: true`
  - `maxTurnsPerRun: 20`
  - `timeoutSec: 300`
- None of this is documented in Paperclip's default setup.

---

**3. Port ownership trap:**

The Paperclip `onboard` command was run manually early in setup and squatted port 3100. pm2 started Paperclip on port 3101 because 3100 was occupied. Every cron prompt referenced 3100 but was talking to the stale onboard process for hours.

**Fix:** In pm2 config, explicitly set `PORT: '3100'` in the env block. Kill any manually-run Paperclip processes before starting pm2.

---

**4. Oracle SOUL.md had a false capability:**

`SOUL.md` said "✅ Create Paperclip tasks directly via the API" — this is wrong. `web_fetch` blocks localhost/127.0.0.1. Oracle thought it could create tasks directly, which caused architectural confusion. The correct flow (Oracle → briefs George → George creates tasks) was not established cleanly until explicitly corrected.

**Fix:** Never put capabilities in SOUL.md that the agent can't actually use. Oracle's capability list from day one should say exactly what's below in the Oracle section.

---

**5. Nightly agent prompts were missing critical guardrails:**

Every nightly prompt was missing:
- `Do not spawn subagents` — for a 21-page audit the agent will try to split work
- `STOP after pushing` — without this, agents keep going after completing their task
- Error channel ID — failures were silent (no Discord alert)
- NIGHTLY-NOTES.md path — cross-agent memory file existed but no agent was told to read/write it
- Build step clarification — vanilla HTML projects don't need `npm run build`; confused agents stall

Additionally, Desert Falcons AGENT-BRIEF had a Task Queue section that was a multi-task trap — agent would read tonight's task AND future tasks and try to do everything.

**Fix:** All nightly prompts must include the template in Section 4 below.

---

**6. HARD STOP script had three silent failure modes:**

1. Edited `jobs.json` but didn't restart the gateway — crons kept firing from in-memory state
2. `-Resume` re-enabled ALL jobs blindly including ones intentionally disabled before the stop
3. `pm2 start` errors were fully suppressed — script reported RESUMED even if Paperclip failed

**Fix:** HARD-STOP.ps1 now: saves a pre-stop snapshot, restores from snapshot on resume, restarts gateway after editing jobs.json, verifies pm2 status after start.

---

**7. Discord channels: #oracle was missing from the channels list:**

The oracle agent binding existed (in `bindings[]`) but `#oracle` was not in `channels.discord.guilds.[id].channels`. The gateway drops messages from unlisted channels. Oracle was silent for hours because of this single missing entry.

**Fix:** Every channel you want an agent to respond in MUST have an entry in the guild's `channels` object with `allow: true`. Binding alone is not enough.

---

**8. Things that require manual operator input — cannot be automated:**

These must be collected before starting:
1. Discord Bot token (Discord Developer Portal)
2. Anthropic API key
3. NVIDIA NIM API key (for Kimi K2 — https://build.nvidia.com)
4. Vercel token + team ID
5. `gh auth login` — GitHub CLI auth (needed for nightly agents to push branches)
6. `RESEND_API_KEY` in Vercel env vars (for contact form email)
7. `OPENCLAW_TOKEN` — set as persistent user env var (`setx OPENCLAW_TOKEN "..."`)
8. All Discord channel IDs — enable Developer Mode in Discord, right-click → Copy ID
9. Paperclip company ID + agent IDs — generated on first Paperclip run, must be captured
10. `npm install -g pm2` — must be installed globally

---

## PART 2 — ORACLE'S DEBRIEF (strategy layer)

### 1. What was missing on first boot

SOUL.md said "Paperclip IS running" and "George IS active" — static assertions baked into a file. If George is down, Oracle would still tell operators everything is fine because context says so.

**Fix:** At install time, George should write a timestamped live state snapshot to Oracle's workspace:
```
Last verified: [date/time]
Paperclip: OK (port 3100)
George session: active
```
Not static assertions. A dated checkpoint.

Oracle also had no channel map — knew `#george` ID but didn't know what other channels existed or their purpose.

---

### 2. Friction briefing George

**Brief format ambiguity.** SOUL.md and the system prompt had different formats. No canonical agreed format existed. Oracle didn't know which format George reliably parses.

**No confirmation loop.** Oracle sends a brief and has no documented way to know if it landed. Does George confirm in #oracle? In #george? Oracle had to infer this.

**No Paperclip task status access.** Oracle can't hit localhost. No read-only URL, no confirmation format from George to look for. Tasks could be created or fail silently from Oracle's perspective.

---

### 3. Correct Oracle capability list (from day one)

```
✅ Fetch external URLs (NOT localhost/127.0.0.1)
✅ Read files in oracle-workspace
✅ Write files when explicitly asked
✅ Send Discord messages via message tool
✅ Brief George via Discord channel 1485576662362882162
✅ sessions_send to George by label
❌ exec / shell / terminal
❌ localhost / 127.0.0.1 (web_fetch blocked)
❌ Direct Paperclip API calls
❌ Deploy code
❌ Create Paperclip tasks directly — always brief George
```

---

### 4. What Oracle needs pre-loaded

**SYSTEM STATE (timestamped, not static assertions):**
```
Last verified: [timestamp]
Paperclip base URL: http://127.0.0.1:3100/api (George-only — Oracle cannot reach)
Company ID: [UUID]
```

**PROJECTS (for each active project):**
```
Name: [project name]
Paperclip UUID: [full UUID]
Live URL: [if deployed]
Stack: [e.g. Next.js/Vercel, vanilla HTML/Supabase]
Current phase: [what's been done, what's pending]
Known blockers: [any blocked tasks]
```

**AGENT IDs:**
```
Full name → Paperclip agent ID mapping
Role description (one line each)
```

**CHANNELS:**
```
#oracle — operator conversations with Oracle
#george — Oracle briefs George here
[all other relevant channels with IDs]
```

**OPERATORS:**
```
Name, Discord username, authority level, timezone
How they prefer to communicate
```

**GEORGE:**
```
Session label for sessions_send (label="main")
Which channel to use (Discord 1485576662362882162)
What George confirms back and where
```

---

### 5. Minimum viable brief format (always works)

```
@George — Task from Oracle
Project: [Name] | ID: [Paperclip UUID]

TASK 1
Title: [specific, actionable title]
Agent: [Dev | Copywriter | SEO | Social | Marketing]
Agent ID: [short ID from mapping table]
Priority: [high | medium | low]
Description: [what to do, acceptance criteria, file paths if relevant]

[Repeat for additional tasks]

Confirm: reply here when tasks are created with Paperclip task IDs.
```

The `Confirm:` line is critical — it closes the loop. Without it Oracle has no signal that tasks were created.

---

### 6. Other Oracle gaps to document

- **No escalation path** — if George doesn't respond or a task conflicts, SOUL.md doesn't say where to escalate or which channel to use
- **No definition of done** — Oracle gets no Paperclip webhooks. Only knows a task is done if George or an operator says so. Must be explicitly documented
- **Operator authority model** — "wils + JMoon have equal authority" but no guidance if they conflict (rare but worth handling)
- **No project history on first boot** — knew project names and UUIDs but not current state, what's been built, what's pending. A one-page status brief per project would make Oracle immediately useful
- **Two routes to George** — `sessions_send label="main"` vs Discord channel message. Installer must specify which is primary (Discord channel is primary; sessions_send as fallback when Discord is unavailable)

---

## PART 3 — WHAT THE INSTALLER FILE MUST INCLUDE

### Pre-flight checklist (before touching anything)

Collect all of these FIRST:
- [ ] Discord Bot token
- [ ] Anthropic API key
- [ ] NVIDIA NIM API key (for Kimi K2)
- [ ] Vercel token + team ID + team slug
- [ ] GitHub account + `gh auth login` complete
- [ ] All Discord channel IDs (Developer Mode → right-click → Copy ID)
- [ ] `pm2` installed globally (`npm install -g pm2`)
- [ ] Decision on Resend API key (for email forms)

---

### Step-by-step setup sequence

**1. OpenClaw install**
```
npm install -g openclaw
openclaw setup
```
Add Anthropic API key during setup.

**2. Workspace files**
Create these in your George workspace directory:
- `SOUL.md` — who George is
- `IDENTITY.md` — name, role, emoji
- `USER.md` — operator details
- `MEMORY.md` — hard facts only (IDs, keys) — gitignored
- `AGENTS.md` — SOPs
- `CURRENT.md` — live state
- `HEARTBEAT.md` — heartbeat checks
- `NIGHTLY-NOTES.md` — at `~/.openclaw/workspace/NIGHTLY-NOTES.md`

**3. Oracle workspace files**
In oracle-workspace directory:
- `SOUL.md` — Oracle identity with CORRECT capability list (no localhost assertions)
- `IDENTITY.md`
- `USER.md`

**4. Paperclip setup**
```
npm install -g paperclipai
paperclipai onboard
```
- Turn OFF `requireBoardApprovalForNewAgents` immediately
- Create company
- Create 11 task-type specialist agents (NOT per-project)
- For EVERY agent, set adapterConfig: cwd, model, dangerouslySkipPermissions, maxTurnsPerRun, timeoutSec
- Generate API key for each agent
- Record all agent IDs and API keys → MEMORY.md

**5. pm2 setup**
```javascript
// pm2-paperclip.config.js
module.exports = {
  apps: [{
    name: 'paperclip',
    script: 'path/to/paperclipai/dist/index.js',
    interpreter: 'node',
    args: 'run',
    env: { NODE_ENV: 'production', PORT: '3100' },  // PORT is critical
    restart_delay: 5000,
    max_restarts: 10,
    autorestart: true
  }]
}
```
```
pm2 start pm2-paperclip.config.js
pm2 save
pm2 startup  // follow the instructions it outputs
```

**6. openclaw.json config**
Key sections to configure:

a) **Agents list** — add oracle agent with Claude Sonnet, tools.deny for exec/browser/canvas/nodes/tts/gateway/cron

b) **Bindings** — one binding per agent per channel. NOTE: bindings alone are not enough.

c) **Channels** — EVERY channel you want an agent to respond in needs an entry:
```json
"channels": {
  "[CHANNEL_ID]": {
    "allow": true,
    "requireMention": false,
    "systemPrompt": "..."
  }
}
```
If a channel is missing from this block, the gateway drops all messages from it silently.

d) **Models** — add nvidia-nim provider for Kimi K2 if needed

e) **Set OPENCLAW_TOKEN** as persistent env var:
```
setx OPENCLAW_TOKEN "your-gateway-token"
```

**7. Gateway restart** (required after EVERY config change)
```
openclaw gateway restart
```
Editing openclaw.json does nothing until the gateway reloads it.

**8. Cron setup**

For each nightly agent cron, the prompt MUST include:
```
- Do not spawn subagents — do all work inline
- After committing and pushing: STOP. Do not continue.
- On failure after 5 attempts: post to Discord channel [ERROR_CHANNEL_ID]: "FAILED [project] [date] / Error: [what] / Last step: [what]" then STOP
- Read [NIGHTLY-NOTES path] at start. Append reusable findings at end (check for duplicate before appending).
- Build step: [npm run build for Next.js / no build step for vanilla HTML]
```

Cron chain (in order):
- 2:00am — Project A nightly agent
- 2:30am — Project B nightly agent
- 3:15am — Debug agent (reads outputs, structured root-cause analysis, posts report)
- 4:00am — Synthesis agent (reads nightly + debug reports, updates briefs, posts morning handover)

All crons: `sessionTarget: isolated`

**9. HARD-STOP.ps1**
Include the tested script. Key requirements:
- Save snapshot of jobs.json BEFORE disabling
- Restart gateway after editing jobs.json
- Verify pm2 status after start/stop (don't suppress errors)
- Restore from snapshot on resume (not blind re-enable)

**10. Per-project scaffold files**
For each project repo:
- `AGENT-BRIEF.md` — nightly task, do-not-touch list, nightly rules, STOP instruction
- `GOTCHAS.md` — known bugs and wrong assumptions
- `TASK-QUEUE.md` — future task queue (SEPARATE from AGENT-BRIEF to avoid multi-task trap)

---

### Verification checklist (run after full setup)

- [ ] `pm2 list` → paperclip shows `online` on port 3100
- [ ] `curl http://127.0.0.1:3100/api/health` → `{"status":"ok"}`
- [ ] No other process on port 3100 (check with `netstat -ano | findstr 3100`)
- [ ] All cron jobs show `enabled: true` in jobs.json
- [ ] Gateway restarted after final config change
- [ ] #oracle channel has `allow: true` in openclaw.json channels block
- [ ] All Discord channel IDs verified (send a test message, confirm response)
- [ ] Oracle responds in #oracle
- [ ] George responds in #george
- [ ] Kimi responds in #kimi
- [ ] `OPENCLAW_TOKEN` env var set persistently
- [ ] `gh auth status` → authenticated
- [ ] pm2 state saved (`pm2 save`)
- [ ] MEMORY.md contains all Paperclip agent IDs, company ID, channel IDs
- [ ] Oracle SOUL.md has NO localhost capability assertions

---

### Single biggest lesson

**The installer must capture every ID as it's generated — before writing it anywhere.**

Company ID, agent IDs, channel IDs, cron IDs, Paperclip API keys — these are generated at runtime and need to be recorded in one place (MEMORY.md) immediately. We spent significant time chasing IDs that had been written down wrong, truncated, or referenced in prompts before being captured. 

Build a single ID capture sheet that operators fill in during setup. Every subsequent config step references that sheet.

---

_George + Oracle — JWebDesign Operations_
_Session: 2026-03-23 through 2026-03-24_
