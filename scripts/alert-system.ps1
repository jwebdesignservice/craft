# OpenClaw Alert System
# Monitors for errors and sends alerts via Discord webhook

param(
    [string]$WebhookUrl = "",  # Discord webhook URL
    [string]$LogPath = "$env:USERPROFILE\.openclaw\logs\gateway.log",
    [int]$CheckIntervalSeconds = 60,
    [int]$AlertThrottleMinutes = 60,
    [switch]$Continuous
)

$ErrorActionPreference = "Continue"
$alertHistory = @{}

function Send-DiscordAlert {
    param(
        [string]$Title,
        [string]$Message,
        [string]$Level = "ERROR"  # WARN, ERROR, CRITICAL
    )
    
    if (-not $WebhookUrl) {
        Write-Host "⚠️  No webhook URL configured, skipping alert" -ForegroundColor Yellow
        return
    }
    
    # Throttle: Don't send same alert within throttle window
    $alertKey = "$Title|$Message"
    if ($alertHistory.ContainsKey($alertKey)) {
        $lastSent = $alertHistory[$alertKey]
        $elapsed = (Get-Date) - $lastSent
        if ($elapsed.TotalMinutes -lt $AlertThrottleMinutes) {
            Write-Host "   [Throttled] Alert not sent (last sent $([math]::Round($elapsed.TotalMinutes, 1)) min ago)" -ForegroundColor Gray
            return
        }
    }
    
    # Color based on level
    $color = switch ($Level) {
        "WARN" { 16776960 }      # Yellow
        "ERROR" { 16711680 }     # Red
        "CRITICAL" { 10038562 }  # Dark Red
        default { 16776960 }
    }
    
    $embed = @{
        embeds = @(
            @{
                title = "🚨 OpenClaw Alert: $Title"
                description = $Message
                color = $color
                timestamp = (Get-Date).ToUniversalTime().ToString("o")
                fields = @(
                    @{
                        name = "Level"
                        value = $Level
                        inline = $true
                    },
                    @{
                        name = "Host"
                        value = $env:COMPUTERNAME
                        inline = $true
                    }
                )
            }
        )
    } | ConvertTo-Json -Depth 10
    
    try {
        Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $embed -ContentType "application/json"
        Write-Host "✅ Alert sent: $Title" -ForegroundColor Green
        $alertHistory[$alertKey] = Get-Date
    } catch {
        Write-Host "❌ Failed to send alert: $_" -ForegroundColor Red
    }
}

function Check-GatewayProcess {
    $process = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*openclaw*gateway*"
    }
    
    if (-not $process) {
        Send-DiscordAlert -Title "Gateway Down" -Message "OpenClaw gateway process not running!" -Level "CRITICAL"
        return $false
    }
    
    return $true
}

function Check-RecentErrors {
    if (-not (Test-Path $LogPath)) {
        Write-Host "⚠️  Log file not found: $LogPath" -ForegroundColor Yellow
        return
    }
    
    # Get last 100 lines and look for errors
    $recentLines = Get-Content $LogPath -Tail 100
    $errors = $recentLines | Select-String -Pattern "\[error\]|\[ERROR\]|Error:|failed|Failed|FAILED" | Select-Object -Last 5
    
    if ($errors) {
        foreach ($error in $errors) {
            $errorText = $error.Line
            
            # Categorize error severity
            $level = "ERROR"
            if ($errorText -match "CRITICAL|crash|fatal") {
                $level = "CRITICAL"
            } elseif ($errorText -match "warn|warning") {
                $level = "WARN"
            }
            
            # Extract relevant part (max 500 chars)
            $message = $errorText.Substring(0, [Math]::Min(500, $errorText.Length))
            
            Send-DiscordAlert -Title "Error in Logs" -Message $message -Level $level
        }
    }
}

function Check-FailedDeliveries {
    $failedPath = "$env:USERPROFILE\.openclaw\delivery\failed"
    if (Test-Path $failedPath) {
        $failed = Get-ChildItem $failedPath -ErrorAction SilentlyContinue | Measure-Object
        if ($failed.Count -gt 10) {
            Send-DiscordAlert -Title "High Delivery Failure Rate" -Message "$($failed.Count) messages failed delivery" -Level "WARN"
        }
    }
}

function Check-MemoryUsage {
    $process = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*openclaw*gateway*"
    }
    
    if ($process) {
        $memoryMB = [math]::Round($process.WorkingSet64 / 1MB, 2)
        if ($memoryMB -gt 2000) {
            Send-DiscordAlert -Title "High Memory Usage" -Message "Gateway using $memoryMB MB" -Level "WARN"
        }
    }
}

function Run-HealthCheck {
    Write-Host "`n=== Health Check $(Get-Date -Format 'HH:mm:ss') ===" -ForegroundColor Cyan
    
    # 1. Gateway process
    Write-Host "[1/4] Checking gateway process..." -ForegroundColor Yellow
    if (-not (Check-GatewayProcess)) {
        Write-Host "❌ Gateway is down!" -ForegroundColor Red
    } else {
        Write-Host "✅ Gateway running" -ForegroundColor Green
    }
    
    # 2. Recent errors
    Write-Host "[2/4] Checking for errors..." -ForegroundColor Yellow
    Check-RecentErrors
    Write-Host "✅ Error check complete" -ForegroundColor Green
    
    # 3. Failed deliveries
    Write-Host "[3/4] Checking delivery queue..." -ForegroundColor Yellow
    Check-FailedDeliveries
    Write-Host "✅ Delivery check complete" -ForegroundColor Green
    
    # 4. Memory usage
    Write-Host "[4/4] Checking memory usage..." -ForegroundColor Yellow
    Check-MemoryUsage
    Write-Host "✅ Memory check complete" -ForegroundColor Green
}

# Main execution
if ($Continuous) {
    Write-Host "Starting continuous monitoring (Ctrl+C to stop)..." -ForegroundColor Cyan
    Write-Host "Check interval: $CheckIntervalSeconds seconds" -ForegroundColor Gray
    Write-Host "Alert throttle: $AlertThrottleMinutes minutes" -ForegroundColor Gray
    
    if ($WebhookUrl) {
        Write-Host "Webhook configured: Yes" -ForegroundColor Green
    } else {
        Write-Host "Webhook configured: No (alerts will be logged only)" -ForegroundColor Yellow
    }
    
    while ($true) {
        Run-HealthCheck
        Start-Sleep -Seconds $CheckIntervalSeconds
    }
} else {
    Run-HealthCheck
}
