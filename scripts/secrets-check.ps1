# secrets-check.ps1
# Scans workspace markdown files for patterns matching API keys, tokens, passwords
# Usage: .\scripts\secrets-check.ps1

$ws = Split-Path $PSScriptRoot -Parent
$patterns = @(
  'sk-[a-zA-Z0-9]{20,}',           # OpenAI
  'sk-proj-[a-zA-Z0-9_-]{20,}',    # OpenAI project keys
  'GOCSPX-[a-zA-Z0-9_-]{20,}',     # Google OAuth
  'pcp_[a-zA-Z0-9]{40,}',          # Paperclip API keys
  'ghp_[a-zA-Z0-9]{36,}',          # GitHub PAT
  'nvap-[a-zA-Z0-9]{20,}',         # NVIDIA API
  'whsec_[a-zA-Z0-9]{30,}',        # Stripe webhook
  'rk_live_[a-zA-Z0-9]{20,}',      # Stripe live key
  'sk_live_[a-zA-Z0-9]{20,}',      # Stripe secret
  'pk_live_[a-zA-Z0-9]{20,}'       # Stripe publishable
)

$files = Get-ChildItem $ws -Recurse -Include "*.md","*.json","*.txt" -File |
  Where-Object { $_.FullName -notmatch '\\\.git\\' -and $_.FullName -notmatch '\\backups\\' -and $_.FullName -notmatch '\\node_modules\\' }

$hits = @()

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
  foreach ($pattern in $patterns) {
    if ($content -match $pattern) {
      $hits += "WARNING: $($file.FullName) -- matches pattern: $pattern"
    }
  }
}

if ($hits.Count -gt 0) {
  Write-Output "SECRETS FOUND:"
  $hits | ForEach-Object { Write-Output $_ }
  exit 1
} else {
  Write-Output "OK: No secrets found in workspace markdown/text files."
}
