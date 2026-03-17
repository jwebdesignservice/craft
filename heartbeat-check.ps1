# MemoryMarket Health Check
Write-Output "=== MemoryMarket Heartbeat Check ==="

# Backend health
try {
    $backend = Invoke-WebRequest -Uri "https://memory-market.up.railway.app/health" -UseBasicParsing -TimeoutSec 10
    Write-Output "Backend Status: $($backend.StatusCode)"
    Write-Output "Backend Response: $($backend.Content)"
} catch {
    Write-Output "Backend Status: ERROR"
    Write-Output "Backend Error: $($_.Exception.Message)"
}

Write-Output ""

# Frontend health
try {
    $frontend = Invoke-WebRequest -Uri "https://memory-market.vercel.app" -UseBasicParsing -TimeoutSec 10
    Write-Output "Frontend Status: $($frontend.StatusCode)"
} catch {
    Write-Output "Frontend Status: ERROR"
    Write-Output "Frontend Error: $($_.Exception.Message)"
}
