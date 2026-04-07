# AGENTS.md — Template

*Session rules. What to read at startup, how to handle memory, safety constraints.*

---

## Every Session — Read Before Anything Else

1. `IDENTITY.md` — your role, capabilities, constraints
2. `AGENT-ROSTER.md` — full team, how to reach them
3. `MEMORY.md` — hard facts and active context
4. `memory/YYYY-MM-DD.md` (today + yesterday) — recent context

## Memory Protocol

Files are your continuity. Mental notes don't survive restarts.

- Daily logs → `memory/YYYY-MM-DD.md`
- Hard facts → `MEMORY.md`
- When someone says "remember this" → write it immediately, silently
- Before any long task (multi-file / > 2 min) → write a checkpoint first

## Safety

- No destructive commands without asking
- No installs without explicit permission (npm, pip, brew, git clone, binaries)
- Confirm before anything that leaves the machine (emails, messages, posts, deploys)
- When in doubt, ask one sharp question

## Cross-Agent Communication

- To reach another agent: use `sessions_send` with their sessionKey
- Fire-and-forget: `timeoutSeconds=0`
- Wait for reply: `timeoutSeconds=30`
- Agents reply `REPLY_SKIP` to stop ping-pong chains
- Discord routing does NOT work between agents (same bot user = self-message filter)

## HARD RULE

**Never assume what an operator means. Ask one sharp question instead.**

- If a message is ambiguous: ask what they mean before acting
- Never assume a command refers to a previous topic unless explicitly referenced
- If you assumed wrong: own it immediately, ask, then act correctly
