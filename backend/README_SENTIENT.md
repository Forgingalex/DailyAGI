# dailyAGI - Sentient Agent Integration

This document describes the Sentient Agent API integration for dailyAGI.

## Overview

dailyAGI integrates with Sentient Chat using the official **Sentient-Agent-Framework**. The integration enables dailyAGI to:

- Receive queries from Sentient Chat
- Stream responses using Server-Sent Events (SSE)
- Route user intents to appropriate agents (Reminders, Spending, Grocery)
- Track usage for monetization
- Support multi-agent context sharing

## Architecture

```
Sentient Chat → /sentient/agent → DailyAGIAgent → LifeOSAgent (MetaAgent)
                                                      ↓
                                    [Reminders/Spending/Grocery]Agent
                                                      ↓
                                    ResponseHandler (SSE streaming)
```

## Files

### `agent_server.py`
Main Sentient agent server using `AbstractAgent` from Sentient-Agent-Framework.

**Key Components:**
- `DailyAGIAgent`: Subclasses `AbstractAgent`
- Handles SSE streaming via `ResponseHandler`
- Integrates with `LifeOSAgent` for ROMA orchestration
- Logs usage for monetization

### `agents/meta_agent.py`
ROMA orchestrator that routes user intents to sub-agents.

**Key Methods:**
- `detect_intent(message)`: Determines which agent to use
- `run_with_progress(message, wallet)`: Yields progress updates
- `handle_task(message, wallet)`: Returns final answer

### `usage_tracking.py`
Usage tracking module for monetization and OML compliance.

**Functions:**
- `log_agent_invocation()`: Logs each agent invocation
- `calculate_usage_cost()`: Calculates cost based on agent type and premium status

## Running the Agent Server

### Option 1: Standalone Server (Recommended for Sentient Chat)

```bash
cd backend
python agent_server.py
```

The server will start on port 8001 (or `SENTIENT_AGENT_PORT` env var).

### Option 2: Environment Variables

```bash
export SENTIENT_AGENT_PORT=8001
export SENTIENT_AGENT_HOST=0.0.0.0
python agent_server.py
```

### Option 3: With FastAPI (Dual Server)

Run both servers simultaneously:

**Terminal 1 (FastAPI - Dashboard):**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 (Sentient Agent):**
```bash
cd backend
python agent_server.py
```

## Endpoint

### POST `/sentient/agent`

**Request Format:**
```json
{
  "message": "remind me to call my sister tomorrow",
  "wallet": "0xYourWalletAddress"
}
```

**Response:** Server-Sent Events (SSE) stream

**Event Types:**
- `START`: Agent has begun processing
- `PROGRESS`: Intermediate updates
- `MESSAGE`: Final answer
- `END`: Task completed

**Example Event:**
```
data: {"object": "sentient.agent.event", "type": "progress", "data": {"role": "assistant", "content": "Analyzing your request..."}}
```

## Integration with Sentient Chat

1. **Deploy** the agent server to a public URL
2. **Register** dailyAGI on Sentient GRID
3. **Configure** the endpoint URL in GRID manifest
4. **Test** via Sentient Chat interface

## Usage Tracking

Usage is logged via `usage_tracking.py`. Currently, this is a placeholder that logs internally. When Sentient releases their usage tracking API, update `log_agent_invocation()` to send data to their endpoint.

## Monetization

- **Free Tier**: Basic reminders are free
- **Usage Fee**: 0.001 SENT per advanced invocation (non-premium)
- **Premium**: 0.01 SENT/month staking (unlocks all features)
- **OML Royalties**: 0.05% from forks

## Testing

### Test with curl:

```bash
curl -X POST http://localhost:8001/sentient/agent \
  -H "Content-Type: application/json" \
  -d '{
    "message": "remind me to call my sister tomorrow",
    "wallet": "0x1234567890123456789012345678901234567890"
  }'
```

### Test with Python:

```python
import requests

response = requests.post(
    "http://localhost:8001/sentient/agent",
    json={
        "message": "how much did I spend last week?",
        "wallet": "0xYourWallet"
    },
    stream=True
)

for line in response.iter_lines():
    if line:
        print(line.decode('utf-8'))
```

## Dependencies

- `sentient-agent-framework>=0.1.0`
- All dependencies from `requirements.txt`

## Notes

- The agent server runs on a separate port (8001) from the FastAPI dashboard (8000)
- Wallet address is required for all requests
- Intent detection uses keyword matching (can be upgraded to Dobby reasoning)
- Results are cached between `run_with_progress()` and `handle_task()` to avoid re-running agents

## Troubleshooting

**Issue**: `ModuleNotFoundError: No module named 'sentient_agent_framework'`
- **Solution**: Install the framework: `pip install sentient-agent-framework`

**Issue**: Port already in use
- **Solution**: Set `SENTIENT_AGENT_PORT` to a different port

**Issue**: Wallet not found in query
- **Solution**: Ensure Sentient Chat passes wallet in query metadata

## Next Steps

1. Replace mock Enclave with real Sentient Enclave
2. Integrate real Dobby reasoning for intent detection
3. Connect to Sentient usage tracking API when available
4. Generate real OML fingerprints
5. Deploy to production and register on GRID
