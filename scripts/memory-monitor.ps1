# memory-monitor.ps1
# Monitors free RAM and alerts when it drops below threshold
# Includes cooldown and Shield dashboard integration

$threshold = 500  # Alert when free RAM < 500MB
$cooldownSeconds = 1800  # 30 minutes between alerts
$logFile = "$PSScriptRoot\..\memory\memory-monitor.log"
$shieldActionsDir = "$env:USERPROFILE\.openclaw\workspace\shield-actions"

# Ensure shield-actions directory exists
if (!(Test-Path $shieldActionsDir)) {
    New-Item -ItemType Directory -Path $shieldActionsDir -Force | Out-Null
}

# Get memory info
$os = Get-CimInstance Win32_OperatingSystem
$freeMemoryMB = [math]::Round($os.FreePhysicalMemory / 1KB, 2)
$totalMemoryMB = [math]::Round($os.TotalVisibleMemorySize / 1KB, 2)
$usedMemoryMB = $totalMemoryMB - $freeMemoryMB
$percentUsed = [math]::Round(($usedMemoryMB / $totalMemoryMB) * 100, 1)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$status = "$timestamp | RAM: $usedMemoryMB MB / $totalMemoryMB MB ($percentUsed%) | Free: $freeMemoryMB MB"

# Always log current stats
Add-Content -Path $logFile -Value $status
Write-Host "$status"

# Check if we should alert
if ($freeMemoryMB -lt $threshold) {
    # Check cooldown - find most recent alert file
    $lastAlert = Get-ChildItem $shieldActionsDir -Filter "*-memory-alert.json" -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1
    
    $shouldAlert = $true
    if ($lastAlert) {
        $timeSinceLastAlert = (Get-Date) - $lastAlert.LastWriteTime
        if ($timeSinceLastAlert.TotalSeconds -lt $cooldownSeconds) {
            $shouldAlert = $false
            Write-Host "[COOLDOWN] Last alert was $([math]::Round($timeSinceLastAlert.TotalMinutes, 1)) min ago (cooldown: 30 min)" -ForegroundColor Yellow
        }
    }
    
    if ($shouldAlert) {
        Write-Host "⚠️ LOW MEMORY ALERT: Only $freeMemoryMB MB free (threshold: $threshold MB)" -ForegroundColor Red
        
        # Show top memory consumers
        Write-Host "`nTop 5 memory consumers:"
        Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 | 
            Format-Table Name, @{Name="Memory (MB)";Expression={[math]::Round($_.WorkingSet / 1MB, 2)}} -AutoSize
        
        # Write Shield dashboard alert file
        $alertTimestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $alertFile = Join-Path $shieldActionsDir "$alertTimestamp-memory-alert.json"
        
        $alertData = @{
            type = "memory_alert"
            timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
            free_mb = $freeMemoryMB
            pressure_pct = $percentUsed
            message = "Low memory: Only $freeMemoryMB MB free (threshold: $threshold MB)"
        } | ConvertTo-Json
        
        $alertData | Set-Content -Path $alertFile
        
        # Log alert
        Add-Content -Path $logFile -Value "⚠️ ALERT: Low memory condition detected - Shield alert written"
        
        return $false
    }
} else {
    Write-Host "[OK] Memory OK: $freeMemoryMB MB free" -ForegroundColor Green
    return $true
}

return $true
