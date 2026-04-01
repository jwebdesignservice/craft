# Disaster Recovery Plan

**Last Updated:** 2026-03-15  
**Owner:** OpenClaw Team

---

## Emergency Contacts

- **Primary:** JMoon (Discord: jmoon_174)
- **Secondary:** wils (Discord: jackwilson7)
- **Discord Server:** Wils & Jazzy Cooks

---

## Failure Scenarios

### 1. Gateway Crash

**Symptoms:**
- Bot not responding in Discord
- `openclaw` commands timeout
- No process found: `Get-Process -Name node | Where CommandLine -like "*openclaw*"`

**Recovery:**
```powershell
# Check if crashed
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where { $_.CommandLine -like "*openclaw*" }

# If not running, restart
openclaw gateway start

# Or manually
cd C:\Users\Jack\AppData\Roaming\npm\node_modules\openclaw
node dist/cli.js gateway start
```

**Prevention:**
- Auto-recovery task (checks every 5 min)
- Check logs: `$env:USERPROFILE\.openclaw\logs\gateway.log`

---

### 2. Database Corruption

**Symptoms:**
- "database disk image is malformed"
- Queries failing
- LCM errors in logs

**Recovery:**
```powershell
# Stop gateway
openclaw gateway stop

# Restore from latest backup
$latestBackup = Get-ChildItem "$env:USERPROFILE\.openclaw\backups" -Directory | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -First 1

Copy-Item "$($latestBackup.FullName)\lcm.db" "$env:USERPROFILE\.openclaw\lcm.db" -Force

# Restart gateway
openclaw gateway start
```

**Prevention:**
- Daily backups (automated)
- Weekly VACUUM (automated)
- Monitor db size

---

### 3. Config Corruption

**Symptoms:**
- "invalid config" errors
- Gateway won't start
- Unexpected behavior

**Recovery:**
```powershell
# Restore from backup
$latestBackup = Get-ChildItem "$env:USERPROFILE\.openclaw\backups" -Directory | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -First 1

Copy-Item "$($latestBackup.FullName)\openclaw.json" "$env:USERPROFILE\.openclaw\openclaw.json" -Force

# Or restore from .bak file
Copy-Item "$env:USERPROFILE\.openclaw\openclaw.json.bak" "$env:USERPROFILE\.openclaw\openclaw.json" -Force

# Restart
openclaw gateway restart
```

**Prevention:**
- Config auto-backed up before changes
- .bak file created on every patch
- Daily full backups

---

### 4. Complete System Loss

**Symptoms:**
- Machine dead/stolen/wiped
- All local data gone

**Recovery:**
```powershell
# On new machine:

# 1. Install OpenClaw
npm install -g openclaw

# 2. Run wizard
openclaw configure

# 3. Restore from backup (if available)
# - Copy backup from cloud storage
# - Extract to ~/.openclaw/

# 4. Or start fresh:
openclaw wizard
```

**Prevention:**
- Cloud backup storage (TODO - Phase 2)
- Document all API keys separately
- Git repo for workspace files

---

### 5. Discord Bot Kicked/Banned

**Symptoms:**
- Bot offline in server
- "Missing Access" errors

**Recovery:**
```powershell
# Generate new invite link
# Client ID: 1471476102886199317
# Use: https://discord.com/api/oauth2/authorize?client_id=1471476102886199317&permissions=8&scope=bot

# Re-invite to server
# Configure permissions in Discord server settings
```

**Prevention:**
- Document bot Application ID
- Keep invite link safe
- Multiple admin users

---

### 6. Memory Explosion

**Symptoms:**
- Gateway using >2GB RAM
- System slowdown
- OOM errors

**Recovery:**
```powershell
# Restart gateway (clears memory)
openclaw gateway restart

# If stuck, force kill
Get-Process -Name "node" | Where { $_.CommandLine -like "*openclaw*" } | Stop-Process -Force

# Then restart
openclaw gateway start
```

**Prevention:**
- Session auto-reset (24h idle)
- Monitor memory usage
- Alert at >2GB

---

### 7. Disk Full

**Symptoms:**
- "ENOSPC: no space left on device"
- Backup failures
- Database write errors

**Recovery:**
```powershell
# Check disk space
Get-PSDrive C

# Clean up old backups
Get-ChildItem "$env:USERPROFILE\.openclaw\backups" -Directory | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -Skip 5 | 
    Remove-Item -Recurse -Force

# Clean up logs
Get-ChildItem "$env:USERPROFILE\.openclaw\logs" -File | 
    Where LastWriteTime -lt (Get-Date).AddDays(-30) | 
    Remove-Item -Force

# Clean delivery queue
Get-ChildItem "$env:USERPROFILE\.openclaw\delivery\failed" | Remove-Item -Force
```

**Prevention:**
- Backup retention (30 days)
- Log rotation
- Disk usage monitoring (TODO)

---

### 8. Agent Gork Bot Crash

**Symptoms:**
- Not replying to Twitter mentions
- Process not running

**Recovery:**
```powershell
# Check if running
Get-Process -Name "node" | Where { $_.CommandLine -like "*agent-gork*" }

# Restart
cd "C:\Users\Jack\Desktop\AI Website\htdocs\Websites\agent-gork\bot-v2"
npm run dev
```

**Prevention:**
- Separate process from gateway
- Health monitoring
- Auto-restart (TODO)

---

## Recovery Time Objectives (RTO)

| Scenario | Target RTO | Actual |
|----------|-----------|--------|
| Gateway crash | < 5 minutes | Auto (5 min check) |
| Database corruption | < 15 minutes | Manual |
| Config corruption | < 5 minutes | Manual |
| Complete system loss | < 2 hours | Manual |
| Discord bot kicked | < 10 minutes | Manual |
| Memory explosion | < 5 minutes | Auto (restart) |
| Disk full | < 30 minutes | Manual |
| Agent Gork crash | < 5 minutes | Manual |

---

## Recovery Testing Schedule

- **Weekly:** Test backup restore
- **Monthly:** Simulate gateway crash
- **Quarterly:** Full disaster recovery drill

---

## Backup Locations

### Local
- `C:\Users\Jack\.openclaw\backups\` (30 days retention)
- `C:\Users\Jack\.openclaw\*.bak` (config backups)

### Cloud (TODO - Phase 2)
- OneDrive / Google Drive / Dropbox
- Auto-sync daily backups

---

## Emergency Procedures

### If All Else Fails

1. **Stop everything:**
   ```powershell
   Get-Process -Name "node" | Stop-Process -Force
   ```

2. **Backup current state:**
   ```powershell
   Copy-Item "$env:USERPROFILE\.openclaw" "$env:USERPROFILE\.openclaw-emergency-$(Get-Date -Format 'yyyy-MM-dd-HHmm')" -Recurse
   ```

3. **Fresh install:**
   ```powershell
   npm uninstall -g openclaw
   npm install -g openclaw
   openclaw configure
   ```

4. **Restore from backup** (if available)

5. **Contact support** (Discord #general)

---

## Monitoring & Alerts

### Daily
- ✅ Automated backup (2:00 AM)
- ✅ Health check (continuous)

### Weekly
- ✅ Database maintenance (Sunday 3:00 AM)

### Manual
- Review logs weekly
- Check backup sizes monthly
- Test recovery quarterly

---

## Critical Files to Preserve

1. **Database:** `~/.openclaw/lcm.db`
2. **Config:** `~/.openclaw/openclaw.json`
3. **Workspace:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\Project Manager\`
4. **Memory:** `workspace/memory/` folder
5. **Scripts:** `workspace/scripts/` folder

---

## Recovery Checklist

After any recovery:

- [ ] Gateway running
- [ ] Discord bot responding
- [ ] LCM database accessible
- [ ] Sessions loading correctly
- [ ] Agent Gork bot replying
- [ ] Backups continuing
- [ ] Monitoring active
- [ ] No errors in logs (last 100 lines)

---

## Escalation Path

1. Try auto-recovery (wait 5 min)
2. Check logs for errors
3. Attempt manual recovery (this doc)
4. Restore from backup
5. Fresh install + restore
6. Contact Discord support
7. Nuclear option: full rebuild

---

**Remember:** Panic is the enemy. Follow procedures. Document what you did.
