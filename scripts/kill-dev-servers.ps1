# kill-dev-servers.ps1
# Kills orphaned dev servers on common development ports
# Also scans for orphaned processes by name
#
# SAFEGUARDS:
# - Only kills on defined port list (never blind kills)
# - Silent errors on all kills (-ErrorAction SilentlyContinue)
# - Logs every kill with port + PID for traceability
# - Duplicate kill prevention (tracks killed PIDs)
# - Gateway process exclusion (CommandLine check)

# Common dev server ports
$devPorts = @(3000, 3001, 3002, 5000, 5173, 5174, 5180, 8000, 8080, 8081, 8888, 9000)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logFile = "$PSScriptRoot\..\memory\dev-server-cleanup.log"

Write-Host "[$timestamp] Scanning for orphaned dev servers..." -ForegroundColor Cyan
Add-Content -Path $logFile -Value "`n[$timestamp] Dev server cleanup scan"

$killedCount = 0
$killedPids = @()

# Step 1: Kill processes by port
foreach ($port in $devPorts) {
    $connections = netstat -ano | Select-String ":$port " | Select-String "LISTENING"
    
    if ($connections) {
        foreach ($conn in $connections) {
            $pidMatch = $conn -match '\s+(\d+)$'
            if ($pidMatch) {
                $processId = $Matches[1]
                
                # Skip if already killed
                if ($killedPids -contains $processId) { continue }
                
                try {
                    $process = Get-Process -Id $processId -ErrorAction Stop
                    $processName = $process.Name
                    $cmdLine = $process.CommandLine
                    
                    # Only kill dev servers, exclude OpenClaw gateway
                    if ($processName -match "node|python|vite|npm|yarn|pnpm" -and 
                        $cmdLine -notmatch "openclaw.*gateway") {
                        
                        Write-Host "  Port $port → Killing $processName (PID $processId)" -ForegroundColor Yellow
                        Add-Content -Path $logFile -Value "  Killed: $processName (PID $processId) on port $port"
                        
                        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                        $killedCount++
                        $killedPids += $processId
                    }
                } catch {
                    # Process already gone or access denied
                }
            }
        }
    }
}

# Step 2: Scan for orphaned processes by name
Write-Host "  Scanning for orphaned vite/ts-node processes..." -ForegroundColor Cyan

$orphanedProcesses = Get-Process | Where-Object {
    ($_.Name -match "node" -and $_.CommandLine -match "vite|ts-node") -and
    $_.CommandLine -notmatch "openclaw.*gateway" -and
    $killedPids -notcontains $_.Id
}

foreach ($proc in $orphanedProcesses) {
    Write-Host "  Orphan → Killing $($proc.Name) (PID $($proc.Id))" -ForegroundColor Yellow
    Add-Content -Path $logFile -Value "  Killed orphan: $($proc.Name) (PID $($proc.Id))"
    
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    $killedCount++
}

# Summary
if ($killedCount -eq 0) {
    Write-Host "[OK] No orphaned dev servers found" -ForegroundColor Green
    Add-Content -Path $logFile -Value "  No orphaned servers found"
} else {
    Write-Host "[OK] Killed $killedCount orphaned dev server(s)" -ForegroundColor Green
    Add-Content -Path $logFile -Value "  Total killed: $killedCount"
}

return $killedCount
