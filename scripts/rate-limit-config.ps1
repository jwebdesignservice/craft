# Configure Rate Limiting for OpenClaw
# Adds per-user and per-channel rate limits

param(
    [int]$MaxConcurrentPerUser = 2,
    [int]$MaxConcurrentPerChannel = 3,
    [int]$GlobalMaxConcurrent = 6,
    [switch]$Apply
)

Write-Host "=== OpenClaw Rate Limiting Configuration ===" -ForegroundColor Cyan

$config = @{
    "agents" = @{
        "defaults" = @{
            "maxConcurrent" = $GlobalMaxConcurrent
            "rateLimiting" = @{
                "enabled" = $true
                "perUser" = @{
                    "maxConcurrent" = $MaxConcurrentPerUser
                    "windowSeconds" = 60
                }
                "perChannel" = @{
                    "maxConcurrent" = $MaxConcurrentPerChannel
                    "windowSeconds" = 60
                }
            }
        }
    }
}

Write-Host "`nProposed Rate Limits:" -ForegroundColor Yellow
Write-Host "  Global max concurrent: $GlobalMaxConcurrent" -ForegroundColor Gray
Write-Host "  Per-user max concurrent: $MaxConcurrentPerUser" -ForegroundColor Gray
Write-Host "  Per-channel max concurrent: $MaxConcurrentPerChannel" -ForegroundColor Gray

if ($Apply) {
    Write-Host "`n⚠️  This will update your OpenClaw config!" -ForegroundColor Yellow
    $confirm = Read-Host "Apply these rate limits? (y/n)"
    
    if ($confirm -eq 'y') {
        try {
            $configJson = $config | ConvertTo-Json -Depth 10
            openclaw config patch --raw $configJson --note "Configure rate limiting"
            Write-Host "✅ Rate limits applied! Gateway restarting..." -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to apply config: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "Cancelled" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nTo apply, run with -Apply flag:" -ForegroundColor White
    Write-Host "  .\rate-limit-config.ps1 -Apply" -ForegroundColor Gray
    Write-Host "`nOr customize:" -ForegroundColor White
    Write-Host "  .\rate-limit-config.ps1 -GlobalMaxConcurrent 10 -MaxConcurrentPerUser 3 -Apply" -ForegroundColor Gray
}
