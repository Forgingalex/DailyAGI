@echo off
REM DAILYAGI Development Startup Script for Windows

echo Starting DAILYAGI Development Environment...

REM Check if .env exists
if not exist .env (
    echo .env file not found. Copying from env.example...
    copy env.example .env
    echo Please edit .env and add your API keys
    pause
    exit /b 1
)

REM Start backend
echo Starting backend server...
start "DAILYAGI Backend" cmd /k "cd backend && python main.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend server...
start "DAILYAGI Frontend" cmd /k "npm run dev"

echo.
echo Servers started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
echo Close the command windows to stop the servers
pause


