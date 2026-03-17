# OpenClaw Automation Scripts

Comprehensive system hardening and automation tools for production OpenClaw deployment.

---

## Quick Start

### 1. Setup Automation (Run Once)
```powershell
# Run as Administrator
.\setup-automation.ps1
```

This creates scheduled tasks for:
- Daily backups (2:00 AM)
- Weekly database maintenance (Sundays 3:00 AM)
- Continuous health monitoring (if webhook provided)
- Auto-recovery (checks every 5 minutes)

---

## Individual Scripts

### 📦 backup-system.ps1
**Purpose:** Full system backup (LCM database, config, workspace files, logs)

**Usage:**
```powershell
# Default (backs up to ~/.openclaw/backups)
.\backup-system.ps1

# Custom location
.\backup-system.ps1 -BackupRoot "D:\Backups\OpenClaw"

# With verification
.\backup-system.ps1 -Verify

# Custom retention (default 30 days)
.\backup-system.ps1 -RetentionDays 60
```

**What it backs up:**
- LCM database (lcm.db)
- Configuration (openclaw.json)
- Workspace files (AGENTS.md, SOUL.md, MEMORY.md, etc.)
- Memory folder (entire directory)
- Recent logs (last 7 days)

**Output:** Timestamped backup directory with manifest.json

---

### 🚨 alert-system.ps1
**Purpose:** Continuous health monitoring with Discord alerts

**Usage:**
```powershell
# One-time check (no alerts sent)
.\alert-system.ps1

# Continuous monitoring with alerts
.\alert-system.ps1 -WebhookUrl "https://discord.com/api/webhooks/..." -Continuous

# Custom check interval (default 60 seconds)
.\alert-system.ps1 -WebhookUrl "..." -Continuous -CheckIntervalSeconds 30

# Custom alert throttle (default 60 minutes)
.\alert-system.ps1 -WebhookUrl "..." -Continuous -AlertThrottleMinutes 30
```

**What it monitors:**
- Gateway process status
- Recent errors in logs
- Failed message deliveries
- Memory usage

**Alert levels:**
- WARN (yellow) - High memory, delivery issues
- ERROR (red) - Log errors, failures
- CRITICAL (dark red) - Gateway down, crashes

**Throttling:** Same alert won't be sent twice within throttle window

---

### 🗄️ db-maintenance.ps1
**Purpose:** Database optimization and cleanup

**Usage:**
```powershell
# Full maintenance
.\db-maintenance.ps1

# Dry run (see what would happen)
.\db-maintenance.ps1 -DryRun

# Custom database path
.\db-maintenance.ps1 -DbPath "C:\custom\path\lcm.db"

# Custom archive age (default 90 days)
.\db-maintenance.ps1 -ArchiveAfterDays 180
```

**What it does:**
1. Creates backup before changes
2. Runs VACUUM (reclaim space)
3. Analyzes database (stats)
4. Checks for old data to archive
5. Runs integrity check
6. Cleans up old backups (keeps last 5)

**Requirements:** sqlite3 CLI (install via `winget install SQLite.SQLite`)

---

### 💓 monitor-health.ps1
**Purpose:** Real-time system health dashboard

**Usage:**
```powershell
# One-time health check
.\monitor-health.ps1

# Continuous monitoring (refreshes every 60 seconds)
.\monitor-health.ps1 -Watch

# Custom interval
.\monitor-health.ps1 -Watch -IntervalSeconds 30
```

**Checks:**
1. Gateway process status + memory/CPU
2. Active sessions
3. Recent errors (last 50 log lines)
4. Pending/failed deliveries
5. LCM database size

**Output:** Color-coded health report (✅ green, ⚠️ yellow, ❌ red)

---

### 🔄 auto-recovery.ps1
**Purpose:** Automatically restart gateway if it crashes

**Usage:**
```powershell
# Manual run (checks once)
.\auto-recovery.ps1
```

**Note:** This is automatically created and scheduled by `setup-automation.ps1`

**What it does:**
- Checks if gateway process is running
- If not running → attempts to restart
- Runs every 5 minutes via scheduled task

---

## Scheduled Tasks Management

### View all OpenClaw tasks
```powershell
Get-ScheduledTask -TaskName "OpenClaw-*"
```

### Start a task manually
```powershell
Start-ScheduledTask -TaskName "OpenClaw-DailyBackup"
```

### Disable a task
```powershell
Disable-ScheduledTask -TaskName "OpenClaw-HealthMonitor"
```

### Enable a task
```powershell
Enable-ScheduledTask -TaskName "OpenClaw-HealthMonitor"
```

### Remove a task
```powershell
Unregister-ScheduledTask -TaskName "OpenClaw-AutoRecover" -Confirm:$false
```

### View task history
```powershell
Get-WinEvent -LogName "Microsoft-Windows-TaskScheduler/Operational" -MaxEvents 50 | 
    Where-Object { $_.Message -like "*OpenClaw*" }
```

---

## Discord Webhook Setup

1. Go to your Discord server
2. Server Settings → Integrations → Webhooks
3. Create Webhook
4. Copy webhook URL
5. Use in `alert-system.ps1` or `setup-automation.ps1`

**Test webhook:**
```powershell
.\alert-system.ps1 -WebhookUrl "YOUR_WEBHOOK_URL"
```

---

## Troubleshooting

### "Script cannot be loaded" error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Scheduled task not running
- Check Task Scheduler (taskschd.msc)
- View task history tab
- Ensure task is enabled
- Check if "Run whether user is logged on or not" is set

### sqlite3 not found
```powershell
winget install SQLite.SQLite
```

### Backup taking too long
- Reduce retention days
- Exclude large log files
- Move backups to faster drive

---

## Best Practices

### Daily
- ✅ Automated (daily backup task)

### Weekly
- Review backup sizes
- Check database maintenance logs
- Review alert history

### Monthly
- Test restore procedure
- Review and update retention policies
- Check disk space for backups

### Quarterly
- Full disaster recovery test
- Review and update automation scripts
- Security audit

---

## File Structure

```
scripts/
├── README.md                  # This file
├── setup-automation.ps1       # One-time setup (run as admin)
├── backup-system.ps1          # Daily backups
├── alert-system.ps1           # Continuous monitoring
├── db-maintenance.ps1         # Weekly database maintenance
├── monitor-health.ps1         # Manual health checks
└── auto-recovery.ps1          # Auto-restart gateway (auto-created)
```

---

## Support

Issues? Questions?
1. Check `SYSTEM-STABILITY-FIXES.md` for architecture details
2. Run health check: `.\monitor-health.ps1`
3. Check logs: `$env:USERPROFILE\.openclaw\logs\gateway.log`
4. Ask in Discord #general

---

**Last Updated:** 2026-03-15  
**OpenClaw Version:** 2026.3.13
