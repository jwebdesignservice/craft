# OpenClaw Health Monitor
# Run this periodically to check system stability

param(
    [switch]$Watch,
    [int]$IntervalSeconds = 60
)

function Get-OpenClawHealth {
    Write-Host "`n=== OpenClaw Health Check ===" -ForegroundColor Cyan
    Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
    
    # 1. Check if gateway is running
    Write-Host "`n[1/5] Gateway Status..." -ForegroundColor Yellow
    $process = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*openclaw*gateway*"
    }
    
    if ($process) {
        Write-Host "✅ Gateway running (PID: $($process.Id))" -ForegroundColor Green
        Write-Host "   Memory: $([math]::Round($process.WorkingSet64 / 1MB, 2)) MB" -ForegroundColor Gray
        Write-Host "   CPU: $($process.CPU)s" -ForegroundColor Gray
    } else {
        Write-Host "❌ Gateway NOT running!" -ForegroundColor Red
        return $false
    }
    
    # 2. Check active sessions
    Write-Host "`n[2/5] Active Sessions..." -ForegroundColor Yellow
    try {
        $sessions = openclaw sessions list --json 2>$null | ConvertFrom-Json
        if ($sessions) {
            Write-Host "✅ $($sessions.Count) active session(s)" -ForegroundColor Green
            foreach ($session in $sessions) {
                Write-Host "   - $($session.label): $($session.messageCount) messages" -ForegroundColor Gray
            }
        }
    } catch {
        Write-Host "⚠️  Could not fetch sessions" -ForegroundColor Yellow
    }
    
    # 3. Check log for errors (last 50 lines)
    Write-Host "`n[3/5] Recent Errors..." -ForegroundColor Yellow
    $logPath = "$env:USERPROFILE\.openclaw\logs\gateway.log"
    if (Test-Path $logPath) {
        $errors = Get-Content $logPath -Tail 50 | Select-String -Pattern "error|Error|ERROR|failed|Failed|FAILED"
        if ($errors) {
            Write-Host "⚠️  Found $($errors.Count) error(s) in last 50 log lines:" -ForegroundColor Yellow
            $errors | Select-Object -First 3 | ForEach-Object {
                Write-Host "   $($_.Line)" -ForegroundColor Gray
            }
        } else {
            Write-Host "✅ No errors in recent logs" -ForegroundColor Green
        }
    }
    
    # 4. Check delivery queue
    Write-Host "`n[4/5] Message Delivery..." -ForegroundColor Yellow
    $deliveryPath = "$env:USERPROFILE\.openclaw\delivery"
    if (Test-Path $deliveryPath) {
        $pending = Get-ChildItem "$deliveryPath\pending" -ErrorAction SilentlyContinue | Measure-Object
        $failed = Get-ChildItem "$deliveryPath\failed" -ErrorAction SilentlyContinue | Measure-Object
        
        if ($pending.Count -gt 0) {
            Write-Host "⚠️  $($pending.Count) pending delivery(ies)" -ForegroundColor Yellow
        } else {
            Write-Host "✅ No pending deliveries" -ForegroundColor Green
        }
        
        if ($failed.Count -gt 0) {
            Write-Host "❌ $($failed.Count) failed delivery(ies)" -ForegroundColor Red
        }
    }
    
    # 5. Check LCM database
    Write-Host "`n[5/5] LCM Database..." -ForegroundColor Yellow
    $lcmPath = "$env:USERPROFILE\.openclaw\lcm.db"
    if (Test-Path $lcmPath) {
        $size = [math]::Round((Get-Item $lcmPath).Length / 1MB, 2)
        Write-Host "✅ LCM database: $size MB" -ForegroundColor Green
    } else {
        Write-Host "⚠️  LCM database not found" -ForegroundColor Yellow
    }
    
    Write-Host "`n=== Health Check Complete ===" -ForegroundColor Cyan
    return $true
}

# Main execution
if ($Watch) {
    Write-Host "Starting health monitor (Ctrl+C to stop)..." -ForegroundColor Cyan
    while ($true) {
        Clear-Host
        Get-OpenClawHealth
        Start-Sleep -Seconds $IntervalSeconds
    }
} else {
    Get-OpenClawHealth
}
