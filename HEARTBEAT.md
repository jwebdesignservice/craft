# HEARTBEAT.md

## Active Monitors

### MemoryMarket Health
- Check: GET https://memory-market.up.railway.app/health
- Expect: status=healthy, database_configured=true
- Alert if: non-200 or database_configured=false
- Frequency: every ~2 heartbeats (roughly once an hour)

### Vercel Frontend
- Check: GET https://memory-market.vercel.app
- Expect: HTTP 200
- Alert if: non-200
