$os = Get-CimInstance Win32_OperatingSystem
$totalGB = [math]::Round($os.TotalVisibleMemorySize/1MB,2)
$freeGB = [math]::Round($os.FreePhysicalMemory/1MB,2)
$usedGB = [math]::Round(($os.TotalVisibleMemorySize - $os.FreePhysicalMemory)/1MB,2)
$usedPercent = [math]::Round((($os.TotalVisibleMemorySize - $os.FreePhysicalMemory)/$os.TotalVisibleMemorySize)*100,1)

Write-Output "=== RAM Status ==="
Write-Output "Total RAM: $totalGB GB"
Write-Output "Used RAM: $usedGB GB ($usedPercent%)"
Write-Output "Free RAM: $freeGB GB"
Write-Output ""
Write-Output "=== Process Monitor ==="
Get-Process | Where-Object {$_.ProcessName -match 'node|python|uvicorn|railway'} | 
    Select-Object ProcessName, Id, @{Name='RAM_MB';Expression={[math]::Round($_.WorkingSet/1MB,2)}} | 
    Sort-Object RAM_MB -Descending | 
    Format-Table -AutoSize
