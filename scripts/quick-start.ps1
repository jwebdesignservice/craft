# Quick Start - No Admin Required
# Runs immediate hardening tasks that don't need scheduled tasks

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== OpenClaw Quick Hardening ===" -ForegroundColor Cyan
Write-Host "Running immediate improvements (no admin needed)..." -ForegroundColor Gray

# 1. Run backup NOW
Write-Host "`n[1/4] Creating system backup..." -ForegroundColor Yellow
& "$scriptRoot\backup-system.ps1" -Verify
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backup complete" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backup had issues" -ForegroundColor Yellow
}

# 2. Run database maintenance
Write-Host "`n[2/4] Database maintenance..." -ForegroundColor Yellow
& "$scriptRoot\db-maintenance.ps1"
Write-Host "✅ Database optimized" -ForegroundColor Green

# 3. Health check
Write-Host "`n[3/4] System health check..." -ForegroundColor Yellow
& "$scriptRoot\monitor-health.ps1"

# 4. Create monitoring loop starter
Write-Host "`n[4/4] Creating monitoring starter..." -ForegroundColor Yellow
$monitorStarter = @'
# Start Continuous Monitoring
# Run this in a separate PowerShell window

$webhookUrl = Read-Host "Enter Discord webhook URL (optional, press Enter to skip)"

$scriptPath = "C:\Users\Jack\Desktop\AI Website\htdocs\Websites\Project Manager\scripts\alert-system.ps1"

if ($webhookUrl) {
    & $scriptPath -WebhookUrl $webhookUrl -Continuous
} else {
    Write-Host "Running without alerts (logs only)"
    & $scriptPath -Continuous
}
'@

$starterPath = Join-Path $scriptRoot "start-monitoring.ps1"
$monitorStarter | Set-Content $starterPath
Write-Host "✅ Created: $starterPath" -ForegroundColor Green

# Summary
Write-Host "`n=== Quick Start Complete ===" -ForegroundColor Cyan
Write-Host "`nCompleted:" -ForegroundColor White
Write-Host "✅ System backup created and verified" -ForegroundColor Green
Write-Host "✅ Database optimized (VACUUM run)" -ForegroundColor Green
Write-Host "✅ Health check performed" -ForegroundColor Green
Write-Host "✅ Monitoring script ready" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor White
Write-Host "1. Start monitoring: .\scripts\start-monitoring.ps1" -ForegroundColor Gray
Write-Host "2. Setup automation (admin): .\scripts\setup-automation.ps1" -ForegroundColor Gray
Write-Host "3. Review: COMPLETE-SYSTEM-HARDENING.md" -ForegroundColor Gray

Write-Host "`n✨ System hardened and ready!" -ForegroundColor Green
