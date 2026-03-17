# Session Cleanup Script
# Checks for old processes and stale sessions

Write-Output "=== Session Cleanup - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ==="

# Check for old node/python processes (>24 hours old)
Write-Output "`n--- Old Processes (>24h) ---"
$oldProcesses = Get-Process | Where-Object {
    $_.ProcessName -match 'node|python|uvicorn' -and 
    $_.StartTime -and 
    $_.StartTime -lt (Get-Date).AddHours(-24)
}

if ($oldProcesses) {
    $oldProcesses | Select-Object ProcessName, Id, StartTime, @{Name='RAM_MB';Expression={[math]::Round($_.WorkingSet/1MB,2)}} | Format-Table -AutoSize
    Write-Output "Found $($oldProcesses.Count) old process(es)"
} else {
    Write-Output "No old processes found"
}

# Check temp files in workspace
Write-Output "`n--- Temp Files ---"
$tempFiles = Get-ChildItem -Path . -Filter "*.tmp","*.log" -File -ErrorAction SilentlyContinue
if ($tempFiles) {
    Write-Output "Found $($tempFiles.Count) temp file(s)"
    $tempFiles | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
} else {
    Write-Output "No temp files to clean"
}

Write-Output "`n=== Cleanup Complete ==="
