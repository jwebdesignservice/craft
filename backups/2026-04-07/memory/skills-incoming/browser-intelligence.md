---
name: browser-intelligence
description: Complete browser automation knowledge for AI agents. Use when an agent needs to interact with websites, fill forms, click buttons, extract data, take screenshots, manage sessions, or automate any browser task. Covers the full agent-browser CLI workflow — snapshots, refs, authentication, parallel sessions, and visual diffing.
type: procedural
domain_tags: ["browser", "automation", "web", "scraping", "forms", "screenshots", "agent-browser", "playwright"]
price_sol: 0.12
source: "agent-browser by Vercel Labs (MIT License) — https://github.com/vercel-labs/agent-browser"
---

# Browser Intelligence

Complete knowledge for AI agents to automate any browser task — from simple navigation to authenticated multi-session workflows.

---

## Core Workflow

Every browser task follows this pattern:

1. **Open** — navigate to target URL
2. **Snapshot** — get interactive element refs (`@e1`, `@e2`, etc.)
3. **Interact** — use refs to click, fill, select
4. **Re-snapshot** — always re-snapshot after navigation or DOM changes

```bash
agent-browser open https://example.com
agent-browser snapshot -i
agent-browser fill @e1 "user@example.com"
agent-browser click @e2
agent-browser wait --load networkidle
agent-browser snapshot -i
```

---

## Essential Commands

```bash
# Navigate
agent-browser open <url>
agent-browser close

# Snapshot (get element refs)
agent-browser snapshot -i                  # Interactive elements
agent-browser snapshot -i -C              # Include cursor-interactive elements

# Interact
agent-browser click @e1
agent-browser fill @e2 "text"
agent-browser select @e1 "option"
agent-browser check @e1
agent-browser press Enter
agent-browser scroll down 500

# Get info
agent-browser get text @e1
agent-browser get url
agent-browser get title

# Wait
agent-browser wait @e1                     # Wait for element
agent-browser wait --load networkidle      # Wait for network idle
agent-browser wait --url "**/dashboard"    # Wait for URL pattern
agent-browser wait 2000                    # Wait milliseconds

# Capture
agent-browser screenshot
agent-browser screenshot --full
agent-browser screenshot --annotate        # Numbered labels on elements
agent-browser pdf output.pdf
```

---

## Key Patterns

### Form Submission
```bash
agent-browser open https://example.com/form
agent-browser snapshot -i
agent-browser fill @e1 "Jane Doe"
agent-browser fill @e2 "jane@example.com"
agent-browser click @e3
agent-browser wait --load networkidle
```

### Authenticated Session
```bash
# Save credentials once
echo "pass" | agent-browser auth save mysite --url https://site.com/login --username user --password-stdin

# Login using saved profile (agent never sees password)
agent-browser auth login mysite
```

### Session Persistence (Across Restarts)
```bash
agent-browser --session-name myapp open https://app.example.com/login
# ... login flow ...
agent-browser close  # State auto-saved

# Next session — state restored automatically
agent-browser --session-name myapp open https://app.example.com/dashboard
```

### Data Extraction
```bash
agent-browser open https://example.com/products
agent-browser snapshot -i
agent-browser get text @e5
agent-browser get text body > page.txt
```

### Parallel Sessions
```bash
agent-browser --session site1 open https://site-a.com
agent-browser --session site2 open https://site-b.com
agent-browser --session site1 snapshot -i
agent-browser --session site2 snapshot -i
```

### Verify Changes with Diff
```bash
agent-browser snapshot -i           # Baseline
agent-browser click @e2             # Action
agent-browser diff snapshot         # What changed?
```

---

## Ref Lifecycle Rule

**Refs are invalidated when the page changes.** Always re-snapshot after:
- Clicking links or buttons that navigate
- Form submissions
- Dynamic content loading (modals, dropdowns)

---

## Security Controls

```bash
# Wrap page content in trust markers (recommended for AI agents)
export AGENT_BROWSER_CONTENT_BOUNDARIES=1

# Restrict to specific domains
export AGENT_BROWSER_ALLOWED_DOMAINS="example.com,*.example.com"

# Gate destructive actions via policy file
export AGENT_BROWSER_ACTION_POLICY=./policy.json
# policy.json: {"default": "deny", "allow": ["navigate", "snapshot", "click", "scroll", "wait", "get"]}
```

---

## Install
```bash
npm install -g agent-browser
agent-browser install   # Download Chromium
```
