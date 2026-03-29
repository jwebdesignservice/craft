# full-backup.ps1
# Backs up workspace files and openclaw config to dated folder
# Keeps last 30 backups
# Usage: .\scripts\full-backup.ps1

$ws = Split-Path $PSScriptRoot -Parent
$backupRoot = Join-Path $ws "backups"
$date = Get-Date -Format "yyyy-MM-dd"
$backupDir = Join-Path $backupRoot $date

New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

# Backup openclaw config
$configSrc = "$env:USERPROFILE\.openclaw\openclaw.json"
if (Test-Path $configSrc) {
  Copy-Item $configSrc "$backupDir\openclaw.json"
}

# Backup workspace files
$wsFiles = @("SOUL.md","AGENTS.md","MEMORY.md","OFFICE.md","USER.md","IDENTITY.md",
             "HEARTBEAT.md","TOOLS.md","CURRENT.md","AGENT-ROSTER.md","NIGHTLY-NOTES.md")
foreach ($f in $wsFiles) {
  $src = Join-Path $ws $f
  if (Test-Path $src) { Copy-Item $src "$backupDir\$f" }
}

# Backup memory dir
$memorySrc = Join-Path $ws "memory"
if (Test-Path $memorySrc) {
  Copy-Item -Recurse $memorySrc "$backupDir\memory" -Force
}

Write-Output "✅ Backup complete: $backupDir"

# Prune old backups (keep last 30)
$allBackups = Get-ChildItem $backupRoot -Directory | Sort-Object Name -Descending
if ($allBackups.Count -gt 30) {
  $toDelete = $allBackups | Select-Object -Skip 30
  foreach ($old in $toDelete) {
    Remove-Item $old.FullName -Recurse -Force
    Write-Output "🗑 Pruned old backup: $($old.Name)"
  }
}
