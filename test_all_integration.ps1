# Comprehensive Integration Test for dailyAGI
Write-Host "=== dailyAGI Full Integration Test ===" -ForegroundColor Cyan
Write-Host ""

$testWallet = "0x1234567890123456789012345678901234567890"
$baseUrl = "http://localhost:8000"
$agentUrl = "http://localhost:8001"

# Test 1: Backend Health
Write-Host "1. Testing Backend Health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -TimeoutSec 3
    Write-Host "   ✓ Backend is running (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Backend is NOT running" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Start with: cd backend; python main.py" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Get Reminders Endpoint
Write-Host "2. Testing Get Reminders..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/agent/reminders?address=$testWallet" -Method GET -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   ✓ Get Reminders works (Found $($data.reminders.Count) reminders)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Get Reminders failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Create Reminder Endpoint
Write-Host "3. Testing Create Reminder..." -ForegroundColor Yellow
try {
    $reminderBody = @{
        address = $testWallet
        title = "Test Reminder"
        description = "Integration test reminder"
        datetime = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm")
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/agent/reminders" -Method POST -ContentType "application/json" -Body $reminderBody -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   ✓ Create Reminder works (ID: $($data.reminder.id))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Create Reminder failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Spending Analysis Endpoint
Write-Host "4. Testing Spending Analysis..." -ForegroundColor Yellow
try {
    $spendingBody = @{
        address = $testWallet
        timeRange = "7d"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/agent/spending" -Method POST -ContentType "application/json" -Body $spendingBody -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   ✓ Spending Analysis works" -ForegroundColor Green
    if ($data.totalSpent) {
        Write-Host "   Total Spent: `$$($data.totalSpent)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ Spending Analysis failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Sentient Agent Endpoint (SSE)
Write-Host "5. Testing Sentient Agent (SSE Streaming)..." -ForegroundColor Yellow
try {
    $agentBody = @{
        message = "remind me to buy groceries tomorrow"
        wallet = $testWallet
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$agentUrl/sentient/agent" -Method POST -ContentType "application/json" -Body $agentBody -TimeoutSec 10
    Write-Host "   ✓ Sentient Agent endpoint responds" -ForegroundColor Green
    Write-Host "   Response length: $($response.Content.Length) bytes" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 405) {
        Write-Host "   ⚠ Agent Server running but method issue (405)" -ForegroundColor Yellow
    } else {
        Write-Host "   ✗ Sentient Agent failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Start with: cd backend; python agent_server.py" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 6: Frontend Check
Write-Host "6. Testing Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 3
    Write-Host "   ✓ Frontend is running (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Frontend is NOT running" -ForegroundColor Red
    Write-Host "   Start with: npm run dev" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Test Summary ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To test manually in browser:" -ForegroundColor Yellow
Write-Host "  1. Open http://localhost:3000" -ForegroundColor White
Write-Host "  2. Connect wallet or click 'Try Demo'" -ForegroundColor White
Write-Host "  3. Test Chat: Click chat button, send message" -ForegroundColor White
Write-Host "  4. Test Reminders: Go to /reminders, create reminder" -ForegroundColor White
Write-Host "  5. Test Spending: Go to /spending, check charts" -ForegroundColor White
Write-Host "  6. Test Grocery: Go to /grocery, upload image" -ForegroundColor White
Write-Host ""



