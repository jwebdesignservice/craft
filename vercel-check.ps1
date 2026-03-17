try {
    $r = Invoke-WebRequest -Uri 'https://memory-market.vercel.app' -UseBasicParsing -TimeoutSec 10
    Write-Output $r.StatusCode
} catch {
    Write-Output "ERROR"
    Write-Output $_.Exception.Message
}
