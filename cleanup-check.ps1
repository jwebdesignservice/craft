# Check for old processes (>24h)
Write-Output "=== Processes Running >24 Hours ==="
Get-Process | Where-Object {
    $_.ProcessName -match 'node|python|uvicorn' -and 
    $_.StartTime -and 
    $_.StartTime -lt (Get-Date).AddHours(-24)
} | Select-Object ProcessName, Id, StartTime, @{Name='RAM_MB';Expression={[math]::Round($_.WorkingSet/1MB,2)}} | Format-Table -AutoSize

# Check temp files in workspace
Write-Output "`n=== Temp Files in Workspace ==="
Get-ChildItem -Path . -Recurse -Include '*.tmp','*.temp','*.log' -File -ErrorAction SilentlyContinue | 
    Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-7)} |
    Select-Object FullName, @{Name='Size_MB';Expression={[math]::Round($_.Length/1MB,2)}}, LastWriteTime |
    Format-Table -AutoSize
