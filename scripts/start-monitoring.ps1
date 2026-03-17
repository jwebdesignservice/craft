# Start Continuous Monitoring
# Run this in a separate PowerShell window

$webhookUrl = Read-Host "Enter Discord webhook URL (optional, press Enter to skip)"

$scriptPath = "C:\Users\Jack\Desktop\AI Website\htdocs\Websites\Project Manager\scripts\alert-system.ps1"

if ($webhookUrl) {
    & $scriptPath -WebhookUrl $webhookUrl -Continuous
} else {
    Write-Host "Running without alerts (logs only)"
    & $scriptPath -Continuous
}
