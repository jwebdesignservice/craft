# HEARTBEAT.md

## Checks (run silently, only report problems)

1. **Cron health** — `openclaw cron list`. Flag any job with `consecutiveErrors > 0`.
2. **Session sizes** — check active sessions. Flag any transcript > 50MB.
3. **CURRENT.md freshness** — flag if not updated in 48 hours.
4. **MEMORY.md size** — warn if > 3000 bytes.
5. **Site health** — `.\scripts\site-health.ps1 -Quiet` — flag any failing sites.
6. **Secrets check** — `.\scripts\secrets-check.ps1` — flag any credentials found in markdown.
7. **gork-buyback** — check `gork-buyback/burn-results.json` for `reported: false` entries. Post to #gork-buyback if found.

If all pass → reply `HEARTBEAT_OK`
If anything fails → report the specific issue and fix if safe to do so.
