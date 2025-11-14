@echo off
REM Start script for Sentient Agent Server (Windows)

echo Starting dailyAGI Sentient Agent Server...

REM Set default port if not set
if "%SENTIENT_AGENT_PORT%"=="" set SENTIENT_AGENT_PORT=8001
if "%SENTIENT_AGENT_HOST%"=="" set SENTIENT_AGENT_HOST=0.0.0.0

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM Run the agent server
python agent_server.py

