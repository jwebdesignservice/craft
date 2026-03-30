# HEARTBEAT.md

## Checks (run silently, only report problems)

1. **Cron health** — run `cron(action=list)`. Flag any job with `consecutiveErrors > 0`.
2. **Session sizes** — check active sessions. Flag any transcript > 50MB.
3. **CURRENT.md freshness** — flag if not updated in 48 hours.
4. **RAM** — check gateway process. Flag if > 1GB.
5. **Gork burn reporter** — check `gork-buyback/burn-results.json` for `reported: false` entries. Post to #gork-buyback channel if found.

If all pass → reply `HEARTBEAT_OK`
If anything fails → report the specific issue and fix if safe to do so.
