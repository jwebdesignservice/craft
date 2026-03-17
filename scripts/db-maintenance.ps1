# OpenClaw Database Maintenance Script
# Performs VACUUM, cleanup, and health checks on LCM database

param(
    [string]$DbPath = "$env:USERPROFILE\.openclaw\lcm.db",
    [int]$ArchiveAfterDays = 90,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "=== OpenClaw Database Maintenance ===" -ForegroundColor Cyan
Write-Host "Database: $DbPath" -ForegroundColor Gray

# Check if database exists
if (-not (Test-Path $DbPath)) {
    Write-Host "❌ Database not found: $DbPath" -ForegroundColor Red
    exit 1
}

# Get initial size
$initialSize = [math]::Round((Get-Item $DbPath).Length / 1MB, 2)
Write-Host "Initial size: $initialSize MB" -ForegroundColor Gray

# Backup before maintenance
Write-Host "`n[1/5] Creating backup..." -ForegroundColor Yellow
$backupPath = "$DbPath.backup-$(Get-Date -Format 'yyyy-MM-dd_HHmmss')"
Copy-Item $DbPath $backupPath
Write-Host "✅ Backup created: $backupPath" -ForegroundColor Green

# 1. VACUUM
Write-Host "`n[2/5] Running VACUUM..." -ForegroundColor Yellow
if ($DryRun) {
    Write-Host "[DRY RUN] Would run VACUUM" -ForegroundColor Yellow
} else {
    try {
        # Use sqlite3 CLI if available, otherwise skip
        $sqlite3 = Get-Command sqlite3 -ErrorAction SilentlyContinue
        if ($sqlite3) {
            & sqlite3 $DbPath "VACUUM;"
            Write-Host "✅ VACUUM complete" -ForegroundColor Green
        } else {
            Write-Host "⚠️  sqlite3 not found, skipping VACUUM" -ForegroundColor Yellow
            Write-Host "   Install: winget install SQLite.SQLite" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ VACUUM failed: $_" -ForegroundColor Red
    }
}

# 2. Analyze database
Write-Host "`n[3/5] Analyzing database..." -ForegroundColor Yellow
if ($sqlite3) {
    $stats = @{}
    
    # Get table sizes
    $tables = & sqlite3 $DbPath ".tables" | Out-String
    Write-Host "Tables: $($tables.Trim())" -ForegroundColor Gray
    
    # Get row counts (example for common tables)
    $conversations = & sqlite3 $DbPath "SELECT COUNT(*) FROM conversations;" 2>$null
    $messages = & sqlite3 $DbPath "SELECT COUNT(*) FROM messages;" 2>$null
    $summaries = & sqlite3 $DbPath "SELECT COUNT(*) FROM summaries;" 2>$null
    
    Write-Host "Conversations: $conversations" -ForegroundColor Gray
    Write-Host "Messages: $messages" -ForegroundColor Gray
    Write-Host "Summaries: $summaries" -ForegroundColor Gray
} else {
    Write-Host "⚠️  sqlite3 not available, skipping analysis" -ForegroundColor Yellow
}

# 3. Archive old data (optional)
Write-Host "`n[4/5] Checking for old data..." -ForegroundColor Yellow
$cutoffDate = (Get-Date).AddDays(-$ArchiveAfterDays).ToString("yyyy-MM-dd")
Write-Host "Archiving data older than: $cutoffDate" -ForegroundColor Gray

if ($DryRun) {
    Write-Host "[DRY RUN] Would archive old conversations" -ForegroundColor Yellow
} else {
    if ($sqlite3) {
        # Count old conversations
        $oldCount = & sqlite3 $DbPath "SELECT COUNT(*) FROM conversations WHERE created_at < '$cutoffDate';" 2>$null
        if ($oldCount -and $oldCount -gt 0) {
            Write-Host "⚠️  Found $oldCount old conversation(s)" -ForegroundColor Yellow
            Write-Host "   (Archive feature not implemented yet)" -ForegroundColor Gray
        } else {
            Write-Host "✅ No old conversations to archive" -ForegroundColor Green
        }
    }
}

# 4. Integrity check
Write-Host "`n[5/5] Running integrity check..." -ForegroundColor Yellow
if ($sqlite3) {
    $integrityResult = & sqlite3 $DbPath "PRAGMA integrity_check;" 2>$null
    if ($integrityResult -eq "ok") {
        Write-Host "✅ Database integrity: OK" -ForegroundColor Green
    } else {
        Write-Host "❌ Database integrity issues found:" -ForegroundColor Red
        Write-Host $integrityResult -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  sqlite3 not available, skipping integrity check" -ForegroundColor Yellow
}

# Get final size
$finalSize = [math]::Round((Get-Item $DbPath).Length / 1MB, 2)
$saved = $initialSize - $finalSize

Write-Host "`n=== Maintenance Complete ===" -ForegroundColor Cyan
Write-Host "Initial size: $initialSize MB" -ForegroundColor Gray
Write-Host "Final size: $finalSize MB" -ForegroundColor Gray
if ($saved -gt 0) {
    Write-Host "Space saved: $saved MB" -ForegroundColor Green
}

# Cleanup old backups (keep last 5)
Write-Host "`n[CLEANUP] Removing old database backups..." -ForegroundColor Yellow
Get-ChildItem "$env:USERPROFILE\.openclaw" -Filter "lcm.db.backup-*" | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -Skip 5 | 
    ForEach-Object {
        Write-Host "   Removing: $($_.Name)" -ForegroundColor Gray
        Remove-Item $_.FullName -Force
    }

Write-Host "`n✅ All done!" -ForegroundColor Green
