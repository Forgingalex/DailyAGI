# Test Script for Sentient Agent Endpoint
# Usage: .\test_agent_endpoint.ps1

Write-Host "=== Testing Sentient Agent Endpoint ===" -ForegroundColor Cyan
Write-Host ""

$url = "http://localhost:8001/sentient/agent"
$body = @{
    message = "remind me to call my sister tomorrow"
    wallet = "0x1234567890123456789012345678901234567890"
} | ConvertTo-Json

Write-Host "URL: $url" -ForegroundColor Yellow
Write-Host "Request Body:" -ForegroundColor Yellow
Write-Host $body
Write-Host ""

try {
    Write-Host "Sending request..." -ForegroundColor Green
    
    $response = Invoke-WebRequest -Uri $url `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -TimeoutSec 30 `
        -ErrorAction Stop
    
    Write-Host "✅ Success! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response Headers:" -ForegroundColor Cyan
    $response.Headers | Format-Table
    Write-Host ""
    Write-Host "Response Content (first 1000 chars):" -ForegroundColor Cyan
    $content = $response.Content
    if ($content.Length -gt 1000) {
        Write-Host $content.Substring(0, 1000) "..."
    } else {
        Write-Host $content
    }
    
} catch {
    Write-Host "❌ Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Make sure agent_server.py is running: python backend/agent_server.py"
    Write-Host "2. Check if port 8001 is available: netstat -ano | findstr :8001"
    Write-Host "3. Check backend logs for errors"
}

