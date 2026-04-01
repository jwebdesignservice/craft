# #ai-hub Channel Memory

## Project: Agent Hub (memory-hub folder)

## Account Assignments — THIS SERVER ONLY
These accounts are exclusively for work done in this Discord server.
DO NOT use these in any other server or channel.

### Railway
- Account: dev.stack999@gmail.com
- Team: devstack-design's Projects
- API Token: 0b7d4721-9fd9-4c6c-b6e5-4ae42b46d171
- Backend URL: https://agent-hub-production-a36e.up.railway.app
- Region: EU West (Ireland) — MUST match Supabase region

### GitHub  
- Account: devstack-design
- Repo: https://github.com/devstack-design/Agent-hub
- Token: configured in git remote URL

### Vercel
- Account: devstack-designs-projects
- Frontend URL: https://agent-hub-tau.vercel.app

### Supabase
- Project URL: https://sbnntgbkckybnxjtpmhj.supabase.co
- Region: EU West (Ireland)
- DATABASE_URL: postgresql://postgres:dDczgaVinFEnerM1@db.sbnntgbkckybnxjtpmhj.supabase.co:5432/postgres

### Keys
- JWT_SECRET: 10d64fa5570fb98abcc370149fa1d4a35e84df583a7d58b5bc94ee43797e3366
- HELIUS_API_KEY: f4bef107-b8b9-4a44-a281-af95bbf7ede8
- WEBHOOK_SECRET: c4b3c79f5f807b3ecca96eabd347e811

## Architecture
- Frontend: Next.js 14 on Vercel (agent-hub-tau.vercel.app)
- Backend: FastAPI on Railway (agent-hub-production-a36e.up.railway.app)
- Database: Supabase PostgreSQL (EU West)
- Frontend calls backend via /api/proxy route (no CORS issues)

## Critical Lesson Learned
- Railway and Supabase MUST be in the same region
- asia-southeast1 Railway could NOT reach eu-west-1 Supabase (Errno 101 Network unreachable)
- Fixed by creating both in EU West (Ireland)

## Other Server Accounts (server ID: 1471449053220044935)
All other accounts (jwebdesignservice Railway, jwebdesignservice GitHub, jwebdesignservice Vercel) belong ONLY to that server.
Never mix accounts between servers.
