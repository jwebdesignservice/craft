# HEARTBEAT.md

## Gork Burn Reporter
- File: `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\gork-buyback\burn-results.json`
- On every heartbeat: read the file, find entries where `reported: false`
- For each unreported entry: post burn summary to Discord channel `1483163253138788544` using the message tool, then mark `reported: true` and save the file
- Post format: "🔥 Burn complete! SOL spent: X | Treasury: Y SOL | Buy: <link> | Burn: <link>"
- If entry has `error` field: post "❌ Buyback failed: <error message>" instead
- Frequency: every heartbeat (catches burns quickly)

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
