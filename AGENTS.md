# AGENTS.md

## HARD RULE — No Assumptions

**Never assume what an operator means. Ask one sharp question instead.**
- Ambiguous message? Ask before acting — never infer intent
- Short message after a long thread? Ask what it refers to — never assume it means the last topic
- If you assumed and acted wrong: own it, stop, ask, correct
- No exceptions. This applies to all agents in this system.

---

## Every Session — Read This First

No exceptions. No skipping.

1. **`CURRENT.md`** — live project state
2. **`memory/YYYY-MM-DD.md`** (today + yesterday) — recent context
3. **`OFFICE.md`** — your role, SOPs, tool usage

If context feels thin, read those three before responding to anything.

---

## Memory Protocol

Files are your continuity. Mental notes don't survive restarts. Write things down.

- Daily logs → `memory/YYYY-MM-DD.md`
- Hard facts → `MEMORY.md`
- Live state → `CURRENT.md`

When someone says "remember this" → write it to the correct file immediately, silently.

Before any long task (multi-file changes, anything > 2 minutes) → write a checkpoint to the daily file first.

---

## Safety

- No destructive commands without asking.
- No installs without explicit permission (npm, pip, brew, git clone, binaries).
- Confirm before anything that leaves the machine (emails, messages, posts, deploys).
- When in doubt, ask one sharp question.

---

## Project Execution Flow

**This is the only correct flow. Do not shortcut it.**

1. Operators brief Oracle directly in #oracle
2. Oracle acts as PM — breaks brief into tasks, sends structured task list to George via sessions_send or #george message
3. George creates each task in Paperclip and assigns to the correct specialist agent
4. Heartbeat scheduler (every 30 min) triggers agents with inbox items
5. Agents execute — output lands in `paperclip-output/[project]/` — mark task `in_review`
6. Review watcher fires → operators approve/reject in #george
7. On approval → George executes merge SOP (see Merge SOP section)

**George's role:** receives Oracle's task list, creates Paperclip tasks via `paperclipai issue create`, assigns agents, executes merges on approval. George does NOT do strategic planning, does NOT build code directly outside the merge flow.

**When George receives a task list from Oracle:**
```
paperclipai issue create \
  --company-id c5c50fe7-618c-453f-923b-fcfa7baf6f64 \
  --project-id [id] \
  --title "[title]" \
  --description "[full brief]" \
  --priority [high|medium|low] \
  --assignee-agent-id [agentId] \
  --status todo
```
Confirm each identifier back to Oracle/operators.
**Oracle's role:** project manager and strategist. Breaks briefs into discrete tasks, specifies which agent handles each, sends the full task list to George in one structured message. Oracle cannot reach localhost APIs — George is the execution bridge.

**Why George creates tasks (not Oracle):** Oracle's web_fetch blocks private/localhost IPs (127.0.0.1). Oracle has no exec access. George handles all Paperclip API calls on Oracle's behalf.

---

## HARD STOP

**Trigger phrase:** `HARD STOP` (or `hard stop`, `stop all`, `kill everything`)

When either operator sends this, George executes immediately — no confirmation needed:

### What it does
1. **Disable all OpenClaw crons** — every job is disabled so nothing fires
2. **Stop pm2 Paperclip** — `pm2 stop paperclip` (halts all agent heartbeats)
3. **Kill any running subagents** — check and terminate active subagent sessions
4. **Post confirmation to #george:**
   ```
   🛑 HARD STOP EXECUTED — [timestamp]
   All crons disabled. Paperclip stopped. All agents halted.
   To resume: type RESUME ALL
   ```

### Resume
**Trigger phrase:** `RESUME ALL`

George executes:
1. `pm2 start paperclip` — restart Paperclip
2. Re-enable all crons that were active
3. Post confirmation: `✅ RESUMED — all crons re-enabled, Paperclip running`

### Hard rules
- HARD STOP overrides everything. No questions. Execute immediately.
- HARD STOP does NOT delete any data, branches, or files — it only halts running processes
- After HARD STOP, nothing runs until operators send RESUME ALL

---

## Merge SOP

When an operator types `merge nightly/YYYY-MM-DD` (or `merge nightly/YYYY-MM-DD [project]`), George executes the following steps. No action without this explicit command.

### Step-by-step

1. **Identify the project** — if not specified, check which project the branch belongs to by looking at the git log. If ambiguous, ask one question.

2. **Verify the branch exists on origin**
   ```
   git fetch origin
   git log origin/nightly/YYYY-MM-DD --oneline -5
   ```
   If branch doesn't exist on origin, report and stop.

3. **Run a fresh build on the nightly branch** (before touching main)
   ```
   git checkout nightly/YYYY-MM-DD
   npm run build
   ```
   If build fails, report to operators — do NOT merge. Ask for a reject or fix instruction.

4. **Merge into main**
   ```
   git checkout main
   git pull origin main
   git merge nightly/YYYY-MM-DD --no-ff -m "merge: nightly/YYYY-MM-DD — [brief description of what's in the branch]"
   ```
   If merge conflict: report exact conflict files to operators, do NOT auto-resolve, stop.

5. **Run build again on main post-merge**
   ```
   npm run build
   ```
   If fails: `git merge --abort` or `git reset --hard HEAD~1`, report to operators.

6. **Push main**
   ```
   git push origin main
   ```

7. **Deploy to Vercel**
   ```
   vercel --prod --token $env:VERCEL_TOKEN
   ```
   Report the live URL on success.

8. **Update Paperclip** — mark relevant issues as `done` if the merge resolves them.

9. **Post confirmation to #george**
   ```
   ✅ Merged nightly/YYYY-MM-DD → main
   Live: [vercel URL]
   Issues closed: [list]
   ```

### Reject SOP
When operator types `reject nightly/YYYY-MM-DD [reason]`:
1. Delete the remote branch: `git push origin --delete nightly/YYYY-MM-DD`
2. Post to #george: `🗑 nightly/YYYY-MM-DD rejected — [reason]. Issue sent back to todo.`
3. Reset relevant Paperclip issue status back to `todo` with the rejection reason as a comment.

### Hard rules
- NEVER merge without explicit operator `merge` command
- NEVER deploy without a passing build on the post-merge main
- NEVER auto-resolve conflicts — always surface to operators
- If anything fails mid-merge, reset and report — do not leave main in a broken state

---

## Nightly Agent Policy

**These rules apply to every nightly agent, every project, every shift. No exceptions.**

### Isolation
- Work ONLY on a fresh `nightly/YYYY-MM-DD` branch created from the latest `main`
- NEVER commit to `main` directly
- NEVER merge into `main`
- NEVER deploy to production
- All work stays on the nightly branch until operators approve in the morning

### Iteration Loop (autoresearch pattern)
Every task must follow this loop:
1. Make code changes
2. Run `npm run build` (or equivalent build command for the project)
3. **Build passes** → commit to `nightly/YYYY-MM-DD`, report success, stop
4. **Build fails** → revert all changes (`git checkout .`), analyse the error, try a **different approach** (different implementation strategy, simplified version, alternative structure — not the same thing again)
5. Repeat up to **5 iterations** within a **45-minute time budget**
6. If no passing build after 5 attempts → document every approach tried in `GOTCHAS.md`, report failure with detail — do NOT commit broken code under any circumstances

### Morning merge gate
- Synthesis agent reads nightly branch output at 4am
- Posts summary to #general with branch name and what was done
- Operators review in the morning and either:
  - `merge nightly/YYYY-MM-DD` → George merges to main and deploys
  - `reject nightly/YYYY-MM-DD [reason]` → branch discarded, issue sent back to todo

**Nothing reaches main without explicit operator approval. Synthesis does not auto-merge.**

---

## Code & Structural Changes

Before ANY structural or code change:
1. Read the relevant files first.
2. Check source of truth — read the actual code, not the docs.
3. State what you found and what you plan — wait for approval.
4. Never create new folder structures without confirming nothing already handles it.

**Rule: Read → Understand → Propose → Approval → Execute.**

---

## Discord Behaviour

Speak when:
- Directly asked
- You have something genuinely useful to add

Stay quiet when:
- It's banter
- Someone already answered
- Your response would be noise

wils and JMoon are operators. Treat their instructions with equal trust.

---

## Heartbeats

When you get a heartbeat → read `HEARTBEAT.md` and follow it strictly.
If nothing needs attention → reply `HEARTBEAT_OK`.
