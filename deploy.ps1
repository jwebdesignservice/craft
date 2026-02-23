# Vercel Deployment Script
# Usage: .\deploy.ps1 [project-path] [environment]

param(
    [string]$ProjectPath = ".",
    [string]$Environment = "preview"
)

# Load environment variables
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*?)\s*=\s*(.*?)\s*$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        }
    }
}

$token = $env:VERCEL_TOKEN

if (-not $token) {
    Write-Host "❌ Error: VERCEL_TOKEN not found in .env" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Starting Vercel deployment..." -ForegroundColor Cyan
Write-Host "📁 Project: $ProjectPath" -ForegroundColor Gray
Write-Host "🎯 Environment: $Environment" -ForegroundColor Gray
Write-Host ""

$deployArgs = @("--token", $token, "--yes")

if ($Environment -eq "production" -or $Environment -eq "prod") {
    $deployArgs += "--prod"
    Write-Host "⚠️  Deploying to PRODUCTION" -ForegroundColor Yellow
} else {
    Write-Host "🔍 Creating preview deployment" -ForegroundColor Green
}

Push-Location $ProjectPath

try {
    vercel @deployArgs
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Deployment failed" -ForegroundColor Red
        exit 1
    }
} finally {
    Pop-Location
}
