# OpenClaw System Backup Script
# Backs up LCM database, config, and workspace files

param(
    [string]$BackupRoot = "$env:USERPROFILE\.openclaw\backups",
    [int]$RetentionDays = 30,
    [switch]$Verify
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupDir = Join-Path $backupRoot $timestamp

Write-Host "=== OpenClaw Backup ===" -ForegroundColor Cyan
Write-Host "Timestamp: $timestamp" -ForegroundColor Gray
Write-Host "Backup location: $backupDir" -ForegroundColor Gray

# Create backup directory
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# 1. Backup LCM Database
Write-Host "`n[1/5] Backing up LCM database..." -ForegroundColor Yellow
$lcmSource = "$env:USERPROFILE\.openclaw\lcm.db"
if (Test-Path $lcmSource) {
    $lcmDest = Join-Path $backupDir "lcm.db"
    Copy-Item $lcmSource $lcmDest
    $size = [math]::Round((Get-Item $lcmDest).Length / 1MB, 2)
    Write-Host "✅ LCM database backed up ($size MB)" -ForegroundColor Green
} else {
    Write-Host "⚠️  LCM database not found" -ForegroundColor Yellow
}

# 2. Backup Config
Write-Host "`n[2/5] Backing up configuration..." -ForegroundColor Yellow
$configSource = "$env:USERPROFILE\.openclaw\openclaw.json"
if (Test-Path $configSource) {
    $configDest = Join-Path $backupDir "openclaw.json"
    Copy-Item $configSource $configDest
    Write-Host "✅ Config backed up" -ForegroundColor Green
} else {
    Write-Host "❌ Config not found!" -ForegroundColor Red
}

# 3. Backup Workspace Files
Write-Host "`n[3/5] Backing up workspace..." -ForegroundColor Yellow
$workspaceSource = "C:\Users\Jack\Desktop\AI Website\htdocs\Websites\Project Manager"
$workspaceDest = Join-Path $backupDir "workspace"
if (Test-Path $workspaceSource) {
    # Only backup specific files (not entire workspace)
    $filesToBackup = @(
        "AGENTS.md",
        "SOUL.md",
        "USER.md",
        "TOOLS.md",
        "MEMORY.md",
        "HEARTBEAT.md",
        "*.ps1"
    )
    
    New-Item -ItemType Directory -Path $workspaceDest -Force | Out-Null
    foreach ($pattern in $filesToBackup) {
        Get-ChildItem $workspaceSource -Filter $pattern -ErrorAction SilentlyContinue | ForEach-Object {
            Copy-Item $_.FullName $workspaceDest
        }
    }
    
    # Backup memory folder
    $memorySource = Join-Path $workspaceSource "memory"
    if (Test-Path $memorySource) {
        $memoryDest = Join-Path $workspaceDest "memory"
        Copy-Item $memorySource $memoryDest -Recurse -Force
    }
    
    Write-Host "✅ Workspace files backed up" -ForegroundColor Green
} else {
    Write-Host "⚠️  Workspace not found" -ForegroundColor Yellow
}

# 4. Backup Logs (last 7 days)
Write-Host "`n[4/5] Backing up recent logs..." -ForegroundColor Yellow
$logsSource = "$env:USERPROFILE\.openclaw\logs"
if (Test-Path $logsSource) {
    $logsDest = Join-Path $backupDir "logs"
    New-Item -ItemType Directory -Path $logsDest -Force | Out-Null
    
    $cutoffDate = (Get-Date).AddDays(-7)
    Get-ChildItem $logsSource -Filter "*.log" | Where-Object {
        $_.LastWriteTime -gt $cutoffDate
    } | ForEach-Object {
        Copy-Item $_.FullName $logsDest
    }
    
    Write-Host "✅ Recent logs backed up" -ForegroundColor Green
} else {
    Write-Host "⚠️  Logs directory not found" -ForegroundColor Yellow
}

# 5. Create manifest
Write-Host "`n[5/5] Creating backup manifest..." -ForegroundColor Yellow
$manifest = @{
    timestamp = $timestamp
    date = Get-Date -Format "o"
    version = (openclaw --version 2>&1 | Out-String).Trim()
    files = @()
}

Get-ChildItem $backupDir -Recurse -File | ForEach-Object {
    $manifest.files += @{
        path = $_.FullName.Replace($backupDir, "")
        size = $_.Length
        hash = (Get-FileHash $_.FullName -Algorithm SHA256).Hash
    }
}

$manifestPath = Join-Path $backupDir "manifest.json"
$manifest | ConvertTo-Json -Depth 10 | Set-Content $manifestPath
Write-Host "✅ Manifest created" -ForegroundColor Green

# Verify backup (optional)
if ($Verify) {
    Write-Host "`n[VERIFY] Checking backup integrity..." -ForegroundColor Yellow
    $verified = $true
    
    foreach ($file in $manifest.files) {
        $filePath = Join-Path $backupDir $file.path
        if (Test-Path $filePath) {
            $currentHash = (Get-FileHash $filePath -Algorithm SHA256).Hash
            if ($currentHash -ne $file.hash) {
                Write-Host "❌ Hash mismatch: $($file.path)" -ForegroundColor Red
                $verified = $false
            }
        } else {
            Write-Host "❌ Missing file: $($file.path)" -ForegroundColor Red
            $verified = $false
        }
    }
    
    if ($verified) {
        Write-Host "✅ Backup verification passed" -ForegroundColor Green
    } else {
        Write-Host "❌ Backup verification FAILED" -ForegroundColor Red
        exit 1
    }
}

# Cleanup old backups
Write-Host "`n[CLEANUP] Removing backups older than $RetentionDays days..." -ForegroundColor Yellow
$cutoff = (Get-Date).AddDays(-$RetentionDays)
Get-ChildItem $backupRoot -Directory | Where-Object {
    $_.LastWriteTime -lt $cutoff
} | ForEach-Object {
    Write-Host "   Removing: $($_.Name)" -ForegroundColor Gray
    Remove-Item $_.FullName -Recurse -Force
}

# Summary
Write-Host "`n=== Backup Complete ===" -ForegroundColor Cyan
$totalSize = (Get-ChildItem $backupDir -Recurse -File | Measure-Object -Property Length -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "Total size: $totalSizeMB MB" -ForegroundColor Gray
Write-Host "Location: $backupDir" -ForegroundColor Gray
Write-Host "Files: $($manifest.files.Count)" -ForegroundColor Gray

# Return backup path for automation
return $backupDir
