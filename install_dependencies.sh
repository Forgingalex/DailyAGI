#!/bin/bash

echo "🔧 Installing all required Python dependencies..."

# Navigate to backend directory
cd backend

# Upgrade pip first
echo "📦 Upgrading pip..."
python -m pip install --upgrade pip

# Install all requirements
echo "📦 Installing requirements from requirements.txt..."
pip install -r requirements.txt

# Verify critical packages
echo "✅ Verifying installations..."
python -c "import fastapi; print(f'FastAPI: {fastapi.__version__}')"
python -c "import aiohttp; print(f'aiohttp: installed')"
python -c "import exa; print(f'exa-py: installed')" 2>/dev/null || echo "⚠️  exa-py: not installed (optional)"
python -c "import transformers; print(f'transformers: {transformers.__version__}')"
python -c "import socketio; print(f'socketio: installed')"

echo ""
echo "✅ Installation complete!"
echo "📝 Don't forget to run 'python ../setup_env.py' to set up your .env file"


