$body = @{
    client_id = 'a3df85e4-3d8c-4d69-b83f-b8d86566c0db'
    client_secret = 'sba_de04c43825a45310d592b1950361b769cb8e4834'
    grant_type = 'client_credentials'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri 'https://mcp.supabase.com/oauth/token' -Method Post -Body $body -ContentType 'application/json'
    Write-Output ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Error $_.Exception.Message
    Write-Error $_.ErrorDetails.Message
}
