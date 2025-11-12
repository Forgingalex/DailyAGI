@echo off
echo Installing all required Python dependencies...

REM Navigate to backend directory
cd backend

REM Upgrade pip first
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install all requirements
echo Installing requirements from requirements.txt...
pip install -r requirements.txt

REM Verify critical packages
echo Verifying installations...
python -c "import fastapi; print('FastAPI: installed')"
python -c "import aiohttp; print('aiohttp: installed')"
python -c "import exa; print('exa-py: installed')" 2>nul || echo exa-py: not installed (optional)
python -c "import transformers; print('transformers: installed')"
python -c "import socketio; print('socketio: installed')"

echo.
echo Installation complete!
echo Don't forget to run 'python setup_env.py' to set up your .env file
pause


