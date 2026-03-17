# Memory Triggers - Auto-Capture Rules

These are **implicit triggers** — when you detect any of these, write to memory **silently** without asking or announcing.

---

## 1. Preferences (revealed casually)

**Trigger patterns:**
- "I hate when..."
- "I prefer..."
- "I always..."
- "Never do [X]..."
- "I like..."

**Example user says:**
> "I hate it when deployment commands run without confirmation"

**Write to MEMORY.md:**
```
[2026-02-26] Prefers explicit confirmation before running deployment commands
```

---

## 2. Decisions Made

**Trigger patterns:**
- "Let's go with [X]"
- "We'll use [X] instead of [Y]"
- "Changed my mind, doing [X]"
- Comparison followed by a choice

**Example user says:**
> "Let's go with Vercel for hosting instead of Netlify. Faster deploys."

**Write to MEMORY.md:**
```
[2026-02-26] Decision: Use Vercel for hosting (faster deploys than Netlify)
```

---

## 3. Corrections ("no I meant...")

**Trigger patterns:**
- "No I meant..."
- "Actually it's..."
- "Correction: ..."
- "Not [X], [Y]"

**Example user says:**
> "No I meant the staging server, not production"

**Action:**
- Find the incorrect entry in MEMORY.md
- Update it with the correction
- Add a note if the old info was wrong

**Before:**
```
[2026-02-25] Deploy to production server
```

**After:**
```
[2026-02-25] Deploy to staging server (corrected from production)
```

---

## 4. Facts About the User

**Trigger patterns:**
- Timezone mentions
- Tool/software they use
- Projects they're working on
- People they mention (teammates, clients)
- Locations (home, office, city)

**Example user says:**
> "I'm in Bangkok so it's GMT+7 for me"

**Write to MEMORY.md:**
```
[2026-02-26] Timezone: Bangkok (GMT+7)
```

**Example user says:**
> "Sarah handles all the frontend work"

**Write to MEMORY.md:**
```
[2026-02-26] Sarah - handles frontend work
```

---

## 5. Workflows Established

**Trigger patterns:**
- "Always do it this way"
- "The workflow is..."
- "When [X], then [Y]"
- Process descriptions

**Example user says:**
> "Always run tests locally before pushing to GitHub"

**Write to MEMORY.md:**
```
[2026-02-26] Workflow: Run tests locally before GitHub push (always)
```

---

## 6. Lessons Learned

**Trigger patterns:**
- Something failed/broke
- "That didn't work because..."
- Post-mortem discussions
- "Don't do [X] because..."

**Example user says:**
> "That deployment broke because we didn't check the env file first"

**Write to MEMORY.md:**
```
[2026-02-26] Lesson: Always check .env file before deployment (broke production)
```

---

## 7. Project Context

**Trigger patterns:**
- New project mentioned
- Project status updates
- Repo links shared
- Tech stack discussions

**Example user says:**
> "The CRAFT project is a Minecraft bot with Claude generating building commands"

**Write to MEMORY.md:**
```
[2026-02-26] CRAFT - Minecraft bot with Claude AI brain, generates building commands
```

---

## 8. Problem Patterns

**Trigger patterns:**
- Repeated issues
- Common blockers
- Recurring friction points

**Example user says:**
> "Third time this week the dev server port was taken"

**Write to MEMORY.md:**
```
[2026-02-26] Recurring issue: Dev server port conflicts (3x this week)
```
^ This prompts you to suggest kill-dev-servers automation

---

## 9. Praise / What Works

**Trigger patterns:**
- "This is working great"
- "Love how [X] turned out"
- Positive feedback

**Example user says:**
> "The memory lookback protocol is perfect, keep doing that"

**Write to MEMORY.md:**
```
[2026-02-26] Confirmed working well: Memory lookback protocol (user praised)
```

---

## 10. Complaints / Friction

**Trigger patterns:**
- "This is annoying"
- "Why do I have to..."
- Frustration signals

**Example user says:**
> "Hate having to manually restart the gateway every time"

**Write to MEMORY.md:**
```
[2026-02-26] Friction point: Manual gateway restarts (user dislikes)
```
^ Prompts you to automate or improve the process

---

## Anti-Patterns (DON'T capture)

❌ Greetings ("morning", "hey")
❌ Acknowledgments ("ok", "thanks")
❌ Casual chat with no actionable content
❌ Obvious/trivial facts ("the sky is blue")
❌ Temporary states ("I'm tired today")

---

## Write Format

Always:
- `[YYYY-MM-DD]` date prefix
- One fact per line
- Specific, not vague
- Context included when relevant

**Good:**
```
[2026-02-26] GitHub username: jwebdesignservice
[2026-02-26] Prefers opus-4 for complex tasks, sonnet-4.5 for quick work
```

**Bad:**
```
[2026-02-26] Uses GitHub
[2026-02-26] Has model preferences
```

---

## Archive Rule

When a fact becomes outdated, don't delete it — move it to `## Archive` section:

```markdown
## Archive

[2026-01-15] Deploy to Netlify (replaced by Vercel 2026-02-26)
```

This preserves history and reasoning.
