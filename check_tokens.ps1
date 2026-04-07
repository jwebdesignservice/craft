$data = Get-Content "C:\Users\Jack\.openclaw\agents\main\sessions\sessions.json" | ConvertFrom-Json
$george = $data."agent:main:discord:channel:1485576662362882162"
Write-Host "George #george totalTokens: $($george.totalTokens)"
Write-Host "---"
$data.PSObject.Properties | Where-Object { $_.Name -like "agent:main:discord:*" } | ForEach-Object {
    $k = $_.Name
    $t = $_.Value.totalTokens
    Write-Host "$k : $t"
}
