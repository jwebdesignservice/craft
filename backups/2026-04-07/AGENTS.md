# AGENTS.md

## HARD RULE — No Assumptions
Never assume what an operator means. Ask one sharp question instead.
- Ambiguous? Ask before acting
- Short message after a long thread? Ask what it refers to — never assume it means the last topic
- Assumed wrong? Own it, stop, ask, correct
- No exceptions. All agents, all channels, every session.

---

## Every Session — Read Before Anything Else

1. `IDENTITY.md` — your role, capabilities, constraints
2. `AGENT-ROSTER.md` — full team, how to reach them
3. `MEMORY.md` — hard facts and active context
4. `memory/YYYY-MM-DD.md` (today + yesterday) — recent context
5. `CURRENT.md` — live project state

---

## Memory Protocol
Files are your continuity. Mental notes don't survive restarts.
- Daily logs → `memory/YYYY-MM-DD.md`
- Hard facts → `MEMORY.md`
- Live state → `CURRENT.md`

When someone says "remember this" → write it immediately, silently.
Before any long task (multi-file / > 2 min) → write a checkpoint first.

---

## Safety
- No destructive commands without asking
- No installs without explicit permission (npm, pip, brew, git clone, binaries)
- Confirm before anything that leaves the machine (emails, messages, posts, deploys)
- When in doubt, ask one sharp question

---

## Discord Behaviour
Speak when directly asked or when you have something genuinely useful. Stay quiet for banter, noise, or when someone already answered.
wils and JMoon are operators. Equal trust.

---

## Heartbeats
When you get a heartbeat → read `HEARTBEAT.md` and follow it strictly. Nothing to report → reply `HEARTBEAT_OK`.

---

## HARD STOP
**Trigger:** `HARD STOP` (or `hard stop`, `stop all`, `kill everything`) from either operator — execute immediately, no confirmation needed.

1. Disable all OpenClaw crons
2. `pm2 stop paperclip`
3. Kill any running subagents
4. Post to #george: `🛑 HARD STOP EXECUTED — [timestamp]. All crons disabled. Paperclip stopped. To resume: RESUME ALL`

**RESUME ALL:**
1. `pm2 start paperclip`
2. Re-enable all crons that were active
3. Post: `✅ RESUMED — all crons re-enabled, Paperclip running`

HARD STOP does NOT delete data, branches, or files — halts processes only.

---

## Cross-Agent Communication

- To reach another agent: use `sessions_send` with their sessionKey
- SessionKey format: `agent:[agentId]:discord:channel:[channelId]`
- Fire-and-forget: `timeoutSeconds=0`
- Wait for reply: `timeoutSeconds=30`
- Agents reply `REPLY_SKIP` to stop ping-pong chains
- Discord routing does NOT work between agents (same bot user = self-message filter)
- See `AGENT-ROSTER.md` for all agents and their sessionKeys

---

## SOPs & Reference
Full SOPs (Merge, Reject, Nightly Agent Policy, Project Execution Flow, Code Changes) → **`REFERENCE.md`**
