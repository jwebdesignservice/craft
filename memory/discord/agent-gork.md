# 🤖 agent-gork - Channel Memory

## Project Overview
Agent Gork - Twitter bot development and testing workspace
Reply-only bot for @Agent_Gork (Twitter ID: 2032857947630612486)

## Key Decisions
[2026-03-14 21:37] Switched from promotional to cheeky/fun personality - more natural conversation, less launch spam
[2026-03-14 21:52] Removed forced $GORK mentions - natural replies only, inspired by actual @gork account
[2026-03-15] **No $GORK cashtag** unless specifically prompted - keep replies organic/degen fun
[2026-03-15] **CRITICAL: No emojis in Agent Gork's Twitter replies** - clean text only on X platform
[2026-03-15] **Rate limits configured (ultra-safe, never flag):**
  - 30 replies/day max (daily cap)
  - 6 replies/hour max (hourly burst limit)
  - 4 hour cooldown per user (don't spam same person)
  - 3-8 min randomized delay between replies (looks human)
  - Based on actual @gork voice: lowercase chaos, gen-z casual, absurdist humor

## Progress
[2026-03-14 22:42] ✅ **PRODUCTION READY** - Running smooth, no hiccups
[2026-03-14 22:42] ✅ Save point created: gork.v1
[2026-03-14 22:42] ✅ Git scripts created for GitHub backup
[2026-03-14 22:40] ✅ Duplicate prevention working perfectly (tracks replied-to tweets)
[2026-03-14 22:20] ✅ Grok API integration complete (grok-4-1-fast-reasoning)
[2026-03-14 22:20] ✅ Contextual replies verified working
[2026-03-14 22:15] ✅ First contextual reply: "Message sent: 'Hi.' Did it arrive in the void? 🚀"

## Technical Notes
- Location: `C:\Users\Jack\.openclaw\agents\agent-gork-staging\bot-v2`
- Previous location: `C:\Users\Jack\Desktop\agent-gork-staging\bot-v2`
- **Using Grok API** (reply-generator.ts) - contextual generation
- Model: `grok-4-1-fast-reasoning`
- API Key: [REDACTED - stored in Railway env vars]
- **Duplicate prevention:** Persistent state in `.bot-state.json` (never replies to same tweet twice)
- Rate limit: 20 replies/day max, 30-second delays between replies
- Security: validates against scams/addresses but no content requirements
- Personality: self-aware AI, absurdist, deadpan humor (original, not copied)

## Scripts
- `RESTART-CLEAN.ps1` - Clean restart with state cleared
- `SAVE-GORK-V1.ps1` - Create save point snapshot
- `RESTORE-GORK-V1.ps1` - Restore from save point
- `GIT-PUSH.ps1` - Git commit and push instructions
- `DEPLOY-RAILWAY.md` - Full Railway deployment guide for 24/7 uptime

## Current Status
- ✅ Running locally on wils' machine
- ⚠️ Requires terminal window to stay open + computer on
- 📝 Ready for Railway deployment for 24/7 uptime

## Important Links
- Twitter: @Agent_Gork
- Staging folder: C:\Users\Jack\Desktop\agent-gork-staging\

## Team Notes
JMoon - Requested personality change from promotional to natural/cheeky

---
_Last updated: 2026-03-14_
