try {
    $r = Invoke-WebRequest -Uri 'https://memory-market.up.railway.app/health' -UseBasicParsing -TimeoutSec 10
    Write-Output "RAILWAY_STATUS: $($r.StatusCode)"
    Write-Output "RAILWAY_BODY: $($r.Content)"
} catch {
    Write-Output "RAILWAY_ERROR: $($_.Exception.Message)"
}

try {
    $r = Invoke-WebRequest -Uri 'https://memory-market.vercel.app' -UseBasicParsing -TimeoutSec 10
    Write-Output "VERCEL_STATUS: $($r.StatusCode)"
} catch {
    Write-Output "VERCEL_ERROR: $($_.Exception.Message)"
}
