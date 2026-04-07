# Agent Setup Checklist

Use this to verify each agent is properly configured.

---

## Files

- [ ] `SOUL.md` — has personality + voice examples (not just a job description)
- [ ] `IDENTITY.md` — factual role, capabilities, constraints
- [ ] `AGENTS.md` — has session-start read list + memory rules + safety rules
- [ ] `USER.md` — who the agent works for, their preferences
- [ ] `MEMORY.md` — exists, has hard facts (LOCAL-ONLY, never commit)
- [ ] `TOOLS.md` — environment-specific notes (optional but recommended)
- [ ] `memory/` directory exists for daily logs

## Config

- [ ] Agent listed in `openclaw.json` under `agents.list`
- [ ] Workspace path set correctly
- [ ] Model specified (or inherits default)
- [ ] Tools deny list configured (if restricted agent)

## Routing

- [ ] Channel binding set in `openclaw.json` under `bindings`
- [ ] NO systemPrompt in channel config (identity comes from SOUL.md)
- [ ] Agent listed in `AGENT-ROSTER.md`

## Communication

- [ ] Agent knows about `sessions_send` for cross-agent comms (in AGENTS.md)
- [ ] SessionKey documented: `agent:[agentId]:discord:channel:[channelId]`

## Memory

- [ ] `memory/` directory exists
- [ ] Daily log pattern: `memory/YYYY-MM-DD.md`
- [ ] MEMORY.md in `.gitignore` (never commit secrets)

---

*If all boxes are checked, the agent is production-ready.*
