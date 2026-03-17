# system-monitor.ps1
# Master script that runs memory monitoring and dev server cleanup

$scriptDir = $PSScriptRoot

Write-Host "=== OpenClaw System Monitor ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check memory
Write-Host "1. Memory Check:" -ForegroundColor White
& "$scriptDir\memory-monitor.ps1"
Write-Host ""

# 2. Kill orphaned dev servers
Write-Host "2. Dev Server Cleanup:" -ForegroundColor White
& "$scriptDir\kill-dev-servers.ps1"
Write-Host ""

Write-Host "=== Monitor complete ===" -ForegroundColor Cyan
