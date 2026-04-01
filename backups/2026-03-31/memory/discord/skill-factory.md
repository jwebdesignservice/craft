# #skill-factory Channel Memory

Channel purpose: Build programs into 1-click installable OpenClaw skills.

## Sessions

### 2026-02-27 — Batch Skill Build
- Verified voice-transcribe skill (Groq + offline, both working)
- Built 9 new skills from memory/skills-incoming/ queue
- All 18 skills copied to Jack's desktop: `C:\Users\Jack\Desktop\OpenClaw Skills\`
- Discussed free vs premium tier split
- Jack + JMoon both present

## Installed Skills (Custom)
All at `C:\Users\Jack\.openclaw\skills\`:

| Skill | Description |
|---|---|
| voice-transcribe | Audio → text (Groq cloud + faster-whisper offline) |
| agent-voice | Tone/personality + ElevenLabs TTS config |
| algo-trading-intelligence | Hummingbot market-making + Meteora LP |
| android-agent-intelligence | ADB phone control (droidclaw) |
| browser-intelligence | agent-browser CLI automation |
| daily-rhythm | Morning report + EOD handover |
| internet-intelligence | Scrapling web scraping + Cloudflare bypass |
| prediction-market-intelligence | Polymarket CLI trading |
| solana-portfolio-intelligence | &milo autonomous Solana trading |
| token-launch-intelligence | Clawncher ERC-20 deploy on Base |
| activity-report | Activity summary |
| deep-think | Deliberate thinking protocol |
| deploy-pipeline | GitHub → Vercel deployment |
| github-push | Push project to GitHub |
| hard-verify | Strict fact-checking protocol |
| polymarket-arb | Polymarket arbitrage bot |
| securiclaw | Code security audit |
| task-memory | Task logging + recall protocol |

## Notes
- Source skill descriptions stored in: `memory/skills-incoming/`
- Groq API key in voice-transcribe/.env — auto-loads, no env var needed
