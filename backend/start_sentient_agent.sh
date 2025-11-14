#!/bin/bash
# Start script for Sentient Agent Server

echo "Starting dailyAGI Sentient Agent Server..."

# Set default port if not set
export SENTIENT_AGENT_PORT=${SENTIENT_AGENT_PORT:-8001}
export SENTIENT_AGENT_HOST=${SENTIENT_AGENT_HOST:-0.0.0.0}

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the agent server
python agent_server.py

