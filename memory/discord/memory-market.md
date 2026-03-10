# memory/discord/memory-market.md

## Channel: #memory-market
## Project: MemoryMarket — AI agent memory marketplace on Solana

---

## Skills Library Plan
[2026-02-26] JMoon building a skills library to bundle with MemoryMarket
[2026-02-26] First skill uploaded: daily-rhythm — start/end of day protocols for AI agents
[2026-02-26] More skills incoming — JMoon will upload the rest
[2026-02-26] Task: design packaging format + integrate skills into marketplace before next upload

## Site Status
[2026-02-26] Live at https://memory-market.vercel.app
[2026-02-26] Backend live at https://memory-market.up.railway.app (Railway)
[2026-02-26] GitHub: jwebdesignservice/memory-market (Jack's account)
[2026-02-26] Frontend rootDirectory=frontend, Vercel project: memory-market

## Fixes Made Today
[2026-02-26] Added NEXT_PUBLIC_SOLANA_NETWORK=devnet to Vercel
[2026-02-26] Created /auth/nonce + /auth/verify endpoints (JWT wallet auth)
[2026-02-26] Fixed /marketplace/listings DNS error — added in-memory demo fallback
[2026-02-26] Added auth.py to backend, registered in main.py + __init__.py
[2026-02-26] All endpoints verified: health, memory/search, marketplace/listings, auth — all 200

## Participants
- JMoon (jmoon_174) — project owner
- Jack (wils/jackwilson7) — dev/infra

## Session Update 2026-03-10 (afternoon)

### Local Dev Running
- Frontend: localhost:3000 (memory-market-dev/frontend)
- Backend: localhost:8001 (memory-market-dev/backend, demo mode, no local DB)

### Infra Gaps Remaining
- IPFS: JWT fix in progress (error:401, awaiting Railway redeploy)
- OpenAI: missing (embeddings off)
- Helius: missing (public RPC only)
- JWT_SECRET: unverified in Railway

### Skills Library (9 total, in memory/skills-incoming/)
All procedural/semantic, priced 0.05-0.25 SOL
Episodic + Relational categories still need building (sandbox timed out)

## Session Update â€” 2026-03-10 (Afternoon/Evening)

### Backend Local Setup Attempt
- Uvicorn started (swift-gulf session) on port 8001 -- degraded mode (no local DB)
- Port 8001 LISTENING but health check times out (loopback issue TBD)
- Missing packages installed: alembic, python-multipart

### Skills Library Status
- 9 skills created in skills-incoming/
- Missing sectors: Episodic (0 skills), Relational (0 skills)
- Sub-agent for sandbox skills timed out -- needs re-run

### Blocked
- Superpowers Claude Code original repo still unlocated (pjs7678 fork found, original missing)
- RoundtableSpace Claude Code workflow -- image only, no GitHub link
- Local backend health check timeout -- firewall/AV investigation needed next session

### Next Priority
- Diagnose localhost:8001 timeout
- Create Episodic + Relational skills (re-run sandbox sub-agent)
- Get Superpowers repo link from JMoon
- Skills ingestion pipeline (bulk upload to /memory/create)
