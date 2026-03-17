# Setup Automated Tasks for OpenClaw Maintenance
# Creates Windows Task Scheduler jobs for backups, monitoring, and maintenance

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== OpenClaw Automation Setup ===" -ForegroundColor Cyan

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "❌ This script requires administrator privileges" -ForegroundColor Red
    Write-Host "   Please run as administrator" -ForegroundColor Yellow
    exit 1
}

# 1. Daily Backup Task
Write-Host "`n[1/4] Setting up daily backup task..." -ForegroundColor Yellow
$backupAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptRoot\backup-system.ps1`""
$backupTrigger = New-ScheduledTaskTrigger -Daily -At "02:00AM"
$backupSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

try {
    Register-ScheduledTask -TaskName "OpenClaw-DailyBackup" -Action $backupAction -Trigger $backupTrigger -Settings $backupSettings -Description "Daily backup of OpenClaw database and config" -Force | Out-Null
    Write-Host "✅ Daily backup task created (runs at 2:00 AM)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create backup task: $_" -ForegroundColor Red
}

# 2. Weekly Database Maintenance
Write-Host "`n[2/4] Setting up weekly database maintenance..." -ForegroundColor Yellow
$dbAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptRoot\db-maintenance.ps1`""
$dbTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At "03:00AM"

try {
    Register-ScheduledTask -TaskName "OpenClaw-WeeklyMaintenance" -Action $dbAction -Trigger $dbTrigger -Settings $backupSettings -Description "Weekly database VACUUM and maintenance" -Force | Out-Null
    Write-Host "✅ Weekly maintenance task created (runs Sundays at 3:00 AM)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create maintenance task: $_" -ForegroundColor Red
}

# 3. Continuous Health Monitoring (optional - requires webhook)
Write-Host "`n[3/4] Setting up health monitoring..." -ForegroundColor Yellow
$webhookUrl = Read-Host "Enter Discord webhook URL for alerts (or press Enter to skip)"

if ($webhookUrl) {
    $monitorAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptRoot\alert-system.ps1`" -WebhookUrl `"$webhookUrl`" -Continuous"
    $monitorTrigger = New-ScheduledTaskTrigger -AtStartup
    
    # This task runs continuously, so different settings
    $monitorSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Days 0)
    
    try {
        Register-ScheduledTask -TaskName "OpenClaw-HealthMonitor" -Action $monitorAction -Trigger $monitorTrigger -Settings $monitorSettings -Description "Continuous health monitoring with Discord alerts" -Force | Out-Null
        Write-Host "✅ Health monitoring task created (starts at boot)" -ForegroundColor Green
        
        # Start immediately
        Start-ScheduledTask -TaskName "OpenClaw-HealthMonitor"
        Write-Host "✅ Health monitoring started" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create monitoring task: $_" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Skipped health monitoring (no webhook provided)" -ForegroundColor Yellow
}

# 4. Auto-Recovery Task (restarts gateway on crash)
Write-Host "`n[4/4] Setting up auto-recovery..." -ForegroundColor Yellow
$recoveryScript = @'
# Auto-recovery script for OpenClaw gateway
$process = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*openclaw*gateway*"
}

if (-not $process) {
    Write-Host "Gateway not running, attempting restart..."
    Start-Process powershell -ArgumentList "-NoProfile -Command openclaw gateway start" -WindowStyle Hidden
}
'@

$recoveryScriptPath = Join-Path $scriptRoot "auto-recovery.ps1"
$recoveryScript | Set-Content $recoveryScriptPath

$recoveryAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$recoveryScriptPath`""
$recoveryTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration ([TimeSpan]::MaxValue)

try {
    Register-ScheduledTask -TaskName "OpenClaw-AutoRecover" -Action $recoveryAction -Trigger $recoveryTrigger -Settings $backupSettings -Description "Auto-restart gateway if it crashes" -Force | Out-Null
    Write-Host "✅ Auto-recovery task created (checks every 5 minutes)" -ForegroundColor Green
    
    # Start immediately
    Start-ScheduledTask -TaskName "OpenClaw-AutoRecover"
} catch {
    Write-Host "❌ Failed to create auto-recovery task: $_" -ForegroundColor Red
}

# Summary
Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "`nCreated tasks:" -ForegroundColor White
Write-Host "1. OpenClaw-DailyBackup (2:00 AM daily)" -ForegroundColor Gray
Write-Host "2. OpenClaw-WeeklyMaintenance (3:00 AM Sundays)" -ForegroundColor Gray
if ($webhookUrl) {
    Write-Host "3. OpenClaw-HealthMonitor (continuous)" -ForegroundColor Gray
}
Write-Host "4. OpenClaw-AutoRecover (every 5 minutes)" -ForegroundColor Gray

Write-Host "`nManage tasks with:" -ForegroundColor White
Write-Host "  taskschd.msc" -ForegroundColor Gray
Write-Host "  Get-ScheduledTask -TaskName 'OpenClaw-*'" -ForegroundColor Gray
Write-Host "  Disable-ScheduledTask -TaskName 'OpenClaw-HealthMonitor'" -ForegroundColor Gray

Write-Host "`n✅ Automation configured!" -ForegroundColor Green
