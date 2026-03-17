# OpenClaw Metrics Collector
# Tracks performance metrics over time for analysis

param(
    [string]$MetricsPath = "$env:USERPROFILE\.openclaw\metrics",
    [int]$IntervalSeconds = 300,  # 5 minutes
    [switch]$Continuous
)

$ErrorActionPreference = "Continue"

# Create metrics directory
if (-not (Test-Path $MetricsPath)) {
    New-Item -ItemType Directory -Path $MetricsPath -Force | Out-Null
}

function Collect-Metrics {
    $timestamp = Get-Date -Format "o"
    $metrics = @{
        timestamp = $timestamp
        gateway = @{}
        sessions = @{}
        database = @{}
        system = @{}
    }
    
    # Gateway metrics
    $process = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*openclaw*gateway*"
    }
    
    if ($process) {
        $metrics.gateway = @{
            pid = $process.Id
            memoryMB = [math]::Round($process.WorkingSet64 / 1MB, 2)
            cpuSeconds = $process.CPU
            threads = $process.Threads.Count
            uptime = ((Get-Date) - $process.StartTime).TotalMinutes
        }
    }
    
    # Session metrics (try to get from API)
    try {
        $sessions = openclaw sessions list --json 2>$null | ConvertFrom-Json
        if ($sessions) {
            $metrics.sessions = @{
                total = $sessions.Count
                messageCount = ($sessions | Measure-Object -Property messageCount -Sum).Sum
            }
        }
    } catch {}
    
    # Database metrics
    $dbPath = "$env:USERPROFILE\.openclaw\lcm.db"
    if (Test-Path $dbPath) {
        $metrics.database = @{
            sizeMB = [math]::Round((Get-Item $dbPath).Length / 1MB, 2)
            lastModified = (Get-Item $dbPath).LastWriteTime.ToString("o")
        }
    }
    
    # System metrics
    $metrics.system = @{
        cpuPercent = (Get-Counter '\Processor(_Total)\% Processor Time' -ErrorAction SilentlyContinue).CounterSamples.CookedValue
        memoryAvailableMB = [math]::Round((Get-Counter '\Memory\Available MBytes' -ErrorAction SilentlyContinue).CounterSamples.CookedValue, 2)
    }
    
    return $metrics
}

function Save-Metrics {
    param($Metrics)
    
    $date = Get-Date -Format "yyyy-MM-dd"
    $metricsFile = Join-Path $MetricsPath "metrics-$date.jsonl"
    
    $Metrics | ConvertTo-Json -Compress | Add-Content $metricsFile
}

function Generate-Report {
    $date = Get-Date -Format "yyyy-MM-dd"
    $metricsFile = Join-Path $MetricsPath "metrics-$date.jsonl"
    
    if (-not (Test-Path $metricsFile)) {
        Write-Host "No metrics for today" -ForegroundColor Yellow
        return
    }
    
    $allMetrics = Get-Content $metricsFile | ForEach-Object { $_ | ConvertFrom-Json }
    
    Write-Host "`n=== Metrics Summary ($date) ===" -ForegroundColor Cyan
    Write-Host "Data points: $($allMetrics.Count)" -ForegroundColor Gray
    
    if ($allMetrics.Count -gt 0) {
        $avgMemory = ($allMetrics.gateway.memoryMB | Measure-Object -Average).Average
        $maxMemory = ($allMetrics.gateway.memoryMB | Measure-Object -Maximum).Maximum
        $minMemory = ($allMetrics.gateway.memoryMB | Measure-Object -Minimum).Minimum
        
        Write-Host "`nGateway Memory:" -ForegroundColor Yellow
        Write-Host "  Average: $([math]::Round($avgMemory, 2)) MB" -ForegroundColor Gray
        Write-Host "  Maximum: $([math]::Round($maxMemory, 2)) MB" -ForegroundColor Gray
        Write-Host "  Minimum: $([math]::Round($minMemory, 2)) MB" -ForegroundColor Gray
        
        $latestDb = $allMetrics[-1].database.sizeMB
        Write-Host "`nDatabase Size: $latestDb MB" -ForegroundColor Yellow
    }
}

# Main execution
if ($Continuous) {
    Write-Host "Starting metrics collection (Ctrl+C to stop)..." -ForegroundColor Cyan
    Write-Host "Interval: $IntervalSeconds seconds" -ForegroundColor Gray
    Write-Host "Storage: $MetricsPath" -ForegroundColor Gray
    
    while ($true) {
        $metrics = Collect-Metrics
        Save-Metrics -Metrics $metrics
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Metrics collected" -ForegroundColor Green
        Start-Sleep -Seconds $IntervalSeconds
    }
} else {
    $metrics = Collect-Metrics
    Save-Metrics -Metrics $metrics
    Write-Host "✅ Metrics collected and saved" -ForegroundColor Green
    Generate-Report
}
