# emergency-stop.ps1
# Kills all active agent runs, disables all crons, restarts gateway
# Use when something is runaway or you need everything stopped NOW

param([switch]$Resume)

if ($Resume) {
  Write-Output "🟢 RESUMING — re-enabling crons and starting Paperclip..."
  pm2 start paperclip 2>&1
  Write-Output "✅ RESUMED — Paperclip running. Crons must be re-enabled manually if needed."
  exit
}

Write-Output "🛑 EMERGENCY STOP — $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss GMT')"

# 1. Stop Paperclip (kills agent heartbeats)
Write-Output "Stopping Paperclip..."
pm2 stop paperclip 2>&1

# 2. Disable all crons
Write-Output "Disabling all crons..."
openclaw cron list --json 2>&1 | ConvertFrom-Json | ForEach-Object {
  if ($_.id) {
    openclaw cron disable $_.id 2>&1
    Write-Output "  Disabled: $($_.id) ($($_.name))"
  }
}

# 3. Restart gateway to kill active sessions
Write-Output "Restarting gateway..."
openclaw gateway restart 2>&1

Write-Output ""
Write-Output "🛑 HARD STOP COMPLETE — $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss GMT')"
Write-Output "All crons disabled. Paperclip stopped. Gateway restarted."
Write-Output "To resume: .\scripts\emergency-stop.ps1 -Resume"
