# Test Integration Script for dailyAGI
Write-Host "=== dailyAGI Integration Test ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if backend is running
Write-Host "1. Testing Backend Health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -Method GET -TimeoutSec 5
    Write-Host "   ✓ Backend is running on port 8000" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Backend is NOT running on port 8000" -ForegroundColor Red
    Write-Host "   Start it with: cd backend; python main.py" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Check if Sentient Agent Server is running
Write-Host "2. Testing Sentient Agent Server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8001/sentient/agent" -Method POST -ContentType "application/json" -Body '{"message":"test","wallet":"0x123"}' -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "   ✓ Sentient Agent Server is running on port 8001" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 405) {
        Write-Host "   ✓ Sentient Agent Server is running (405 = method not allowed, but server is up)" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Sentient Agent Server is NOT running on port 8001" -ForegroundColor Red
        Write-Host "   Start it with: cd backend; python agent_server.py" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 3: Check if frontend is running
Write-Host "3. Testing Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "   ✓ Frontend is running on port 3000" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Frontend is NOT running on port 3000" -ForegroundColor Red
    Write-Host "   Start it with: npm run dev" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start all servers:" -ForegroundColor Yellow
Write-Host "  Terminal 1: cd backend; python main.py" -ForegroundColor White
Write-Host "  Terminal 2: cd backend; python agent_server.py" -ForegroundColor White
Write-Host "  Terminal 3: npm run dev" -ForegroundColor White



