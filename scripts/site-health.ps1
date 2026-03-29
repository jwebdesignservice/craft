# site-health.ps1
# Checks all live project URLs return 200
# Usage: .\scripts\site-health.ps1 [-Quiet]

param([switch]$Quiet)

$sites = @(
  @{ name = "Primrose Ever Care";   url = "https://www.primroseevercare.co.uk" },
  @{ name = "Desert Falcons";       url = "https://desert-falcons.vercel.app" },
  @{ name = "ClauseKit";            url = "https://clausekit-lemon.vercel.app" },
  @{ name = "Fast Launch";          url = "https://www.fastlaunchmvp.com" }
)

$failures = @()

foreach ($site in $sites) {
  try {
    $resp = Invoke-WebRequest -Uri $site.url -Method GET -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    if ($resp.StatusCode -eq 200) {
      if (-not $Quiet) { Write-Output "OK: $($site.name) -- $($site.url)" }
    } else {
      $failures += "WARN: $($site.name) -- HTTP $($resp.StatusCode)"
    }
  } catch {
    $failures += "FAIL: $($site.name) -- $($_.Exception.Message)"
  }
}

if ($failures.Count -gt 0) {
  Write-Output ""
  Write-Output "FAILURES:"
  $failures | ForEach-Object { Write-Output $_ }
  exit 1
} elseif (-not $Quiet) {
  Write-Output ""
  Write-Output "All sites healthy."
}
