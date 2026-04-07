---
name: android-agent-intelligence
description: Complete knowledge for AI agents to control Android phones via ADB. Give the agent a goal in plain English — it reads the screen, thinks about what to do, taps and types, and repeats until the job is done. Covers the perception-reasoning-action loop, all 28 actions, workflows, flows, stuck detection, vision fallback, remote control via Tailscale, and 35+ ready-to-use workflow patterns. Use when an agent needs to automate apps without APIs, control a device remotely, or execute multi-app tasks on Android.
type: procedural
domain_tags: ["android", "automation", "adb", "mobile", "agent", "workflows", "no-api", "device-control"]
price_sol: 0.15
source: "droidclaw by unitedby.ai (MIT License) — https://github.com/unitedbyai/droidclaw"
---

# Android Agent Intelligence

Control any Android phone with plain English goals. No APIs needed — the agent reads the screen, decides what to do, and executes via ADB.

---

## Install

```bash
# Quick install (installs bun + adb + sets up .env)
curl -fsSL https://droidclaw.ai/install.sh | sh

# Manual
git clone https://github.com/unitedbyai/droidclaw.git
cd droidclaw && bun install && cp .env.example .env
```

**Prerequisites:** [bun](https://bun.sh), [adb](https://developer.android.com/tools/adb), Android phone with USB debugging enabled

---

## Connect Phone

1. Settings ? About Phone ? tap "Build Number" 7 times
2. Settings ? Developer Options ? Enable "USB Debugging"
3. Plug in USB, tap "Allow" on phone
4. Verify: `adb devices`

---

## Configure LLM

Edit `.env`:
```bash
# Fastest (free tier)
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your_key_here

# Fully local (no API, no internet)
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.2
```

Supported providers: `groq` | `ollama` | `openai` | `openrouter` | `bedrock`

---

## Three Modes

### 1. Interactive (type your goal, AI figures it out)
```bash
bun run src/kernel.ts
# enter your goal: open youtube and search for lofi hip hop
```

### 2. Workflows (AI-powered, multi-app, JSON)
```bash
bun run src/kernel.ts --workflow examples/workflows/research/weather-to-whatsapp.json
```
```json
{
  "name": "weather to whatsapp",
  "steps": [
    { "app": "com.google.android.googlequicksearchbox", "goal": "search for london weather today" },
    { "goal": "share the result to whatsapp contact Alex" }
  ]
}
```

### 3. Flows (deterministic, no AI, instant — YAML macros)
```bash
bun run src/kernel.ts --flow examples/flows/send-whatsapp.yaml
```
```yaml
appId: com.whatsapp
name: Send WhatsApp Message
---
- launchApp
- wait: 2
- tap: "Contact Name"
- type: "hello from agent"
- tap: "Send"
- done: "Message sent"
```

---

## 28 Actions

**Interaction:** `tap` `type` `enter` `longpress` `clear` `paste` `swipe` `scroll`

**Navigation:** `home` `back` `launch` `switch_app` `open_url` `open_settings` `notifications`

**Clipboard:** `clipboard_get` `clipboard_set`

**Multi-step Skills (compound — replace 5-10 manual actions):**
- `read_screen` — auto-scrolls, collects all text, copies to clipboard
- `submit_message` — handles sending across different messaging apps
- `copy_visible_text` — grabs all readable text from current view
- `wait_for_content` — waits for specific content to appear
- `find_and_tap` — finds element by text and taps it
- `compose_email` — fills To, Subject, Body using Android intents

**System:** `screenshot` `shell` `keyevent` `pull_file` `push_file` `wait` `done`

---

## Failure Handling

- **Stuck loop detection** — if screen unchanged for 3 steps, recovery hints injected
- **Repetition tracking** — catches retry loops even across screen changes
- **Drift detection** — flags nav spam without real interaction
- **Vision fallback** — when accessibility tree is empty (Flutter, webviews), screenshot sent to LLM instead
- **Action feedback** — every action result fed back to LLM on next step

---

## 35 Ready-to-Use Workflows

**Messaging:** Slack standup, WhatsApp broadcast, Telegram send, email reply, email digest

**Social:** Cross-platform post, Instagram check, YouTube watch later

**Productivity:** Morning briefing, GitHub PR check, calendar event, notification cleanup

**Research:** Weather ? WhatsApp, price comparison, news roundup, flight status check

**Lifestyle:** Food order, Uber ride, Spotify playlist, fitness log, expense tracker

---

## Remote Control (Tailscale)

Run the phone as a remote always-on agent — no USB needed:

```bash
# Install Tailscale on phone + laptop/server
# Enable Wireless Debugging on phone
adb connect <phone-tailscale-ip>:<port>
adb devices  # confirms connection

bun run src/kernel.ts  # control from anywhere in the world
```

Use with a VPS + cron for scheduled morning workflows, daily standups, etc.

---

## Key Config (.env)

| Key | Default | Description |
|-----|---------|-------------|
| `LLM_PROVIDER` | groq | LLM to use |
| `MAX_STEPS` | 30 | Steps before agent gives up |
| `STEP_DELAY` | 2 | Seconds between actions |
| `STUCK_THRESHOLD` | 3 | Steps unchanged before recovery |
| `VISION_MODE` | fallback | `off` / `fallback` / `always` |
| `MAX_ELEMENTS` | 40 | Max UI elements per step |

---

## Troubleshooting

- **"no devices found"** — check USB debugging enabled, cable supports data (not charge-only)
- **agent repeating actions** — try a stronger model (`llama-3.3-70b` or `gpt-4o`)
- **empty accessibility tree** — set `VISION_MODE=always` for Flutter/webview apps
