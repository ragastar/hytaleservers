$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jeGVscXdwbGtobGh2Ym1kYXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDY3NTMsImV4cCI6MjA4NDA4Mjc1M30.8P_zds-RcwFC-CdqCg6TXCCEtapcQYeYrSlB7gavp9s"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "https://mcp.supabase.com/mcp?project_ref=ncxelqwplkhlhvbmdatf" -Method Get -Headers $headers
    Write-Output "Success:"
    Write-Output ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Error "Error: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Error "Details: $($_.ErrorDetails.Message)"
    }
}
