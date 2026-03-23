param([switch]$Resume)

$JOBS_FILE     = "C:\Users\Jack\.openclaw\cron\jobs.json"
$SNAPSHOT_FILE = "C:\Users\Jack\.openclaw\cron\jobs-pre-hardstop.json"
$TIMESTAMP     = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

function Set-CronEnabled {
    param([bool]$enabled)
    try {
        $data = Get-Content $JOBS_FILE -Raw | ConvertFrom-Json
        $count = 0
        foreach ($job in $data.jobs) { $job.enabled = $enabled; $count++ }
        $data | ConvertTo-Json -Depth 20 | Set-Content $JOBS_FILE -Encoding UTF8
        return $count
    } catch {
        Write-Host "ERROR: $_" -ForegroundColor Red
        return 0
    }
}

if ($Resume) {
    Write-Host ""
    Write-Host "RESUME ALL" -ForegroundColor Green

    if (Test-Path $SNAPSHOT_FILE) {
        Write-Host "Restoring from snapshot..."
        Copy-Item $SNAPSHOT_FILE $JOBS_FILE -Force
        Remove-Item $SNAPSHOT_FILE -Force
        Write-Host "Snapshot restored"
    } else {
        $count = Set-CronEnabled $true
        Write-Host "No snapshot - re-enabled all $count crons"
    }

    openclaw gateway restart 2>&1 | Out-Null
    Start-Sleep -Seconds 3
    pm2 start paperclip 2>$null | Out-Null
    Start-Sleep -Seconds 5
    $s = pm2 list 2>&1 | Select-String "paperclip"
    if ($s -match "online") { Write-Host "Paperclip: online" } else { Write-Host "WARNING: check pm2 list" -ForegroundColor Yellow }
    Write-Host "RESUMED -- $TIMESTAMP" -ForegroundColor Green

} else {
    Write-Host ""
    Write-Host "HARD STOP" -ForegroundColor Red

    try { Copy-Item $JOBS_FILE $SNAPSHOT_FILE -Force; Write-Host "Snapshot saved" } catch { Write-Host "WARNING: snapshot failed" -ForegroundColor Yellow }
    $count = Set-CronEnabled $false
    Write-Host "Crons disabled: $count"

    openclaw gateway restart 2>&1 | Out-Null
    Start-Sleep -Seconds 3
    pm2 stop paperclip 2>$null | Out-Null
    Start-Sleep -Seconds 2
    $s = pm2 list 2>&1 | Select-String "paperclip"
    if ($s -match "stopped") { Write-Host "Paperclip: stopped" } else { Write-Host "WARNING: check pm2 list" -ForegroundColor Yellow }

    Write-Host ""
    Write-Host "HARD STOP COMPLETE -- $TIMESTAMP" -ForegroundColor Red
    Write-Host "Crons: $count disabled. Snapshot saved."
    Write-Host "Resume: .\HARD-STOP.ps1 -Resume"
    Write-Host ""
}
