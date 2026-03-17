Get-Process | Where-Object {$_.ProcessName -match 'node|python|uvicorn'} | 
    Select-Object ProcessName, Id, 
        @{Name='RAM_MB';Expression={[math]::Round($_.WorkingSet/1MB,2)}}, 
        @{Name='StartTime';Expression={$_.StartTime}} | 
    Sort-Object RAM_MB -Descending | 
    Format-Table -AutoSize
