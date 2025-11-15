# Sentient Integration

Complete guide for integrating dailyAGI with Sentient Chat and Sentient GRID.

## Overview

dailyAGI integrates with Sentient Chat using the official **Sentient-Agent-Framework**. The integration enables:

- Receiving queries from Sentient Chat
- Streaming responses via Server-Sent Events (SSE)
- ROMA-based multi-agent orchestration
- Usage tracking for monetization
- OML compliance

## Architecture

```
Sentient Chat → /sentient/agent → DailyAGIAgent → LifeOSAgent (MetaAgent)
                                                      ↓
                                    [Reminders/Spending/Grocery]Agent
                                                      ↓
                                    ResponseHandler (SSE streaming)
```

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install sentient-agent-framework
```

### 2. Start Agent Server

```bash
python agent_server.py
```

Server runs on port 8001 (or `SENTIENT_AGENT_PORT` env var).

### 3. Test Endpoint

```bash
curl -X POST http://localhost:8001/sentient/agent \
  -H "Content-Type: application/json" \
  -d '{
    "message": "remind me to call my sister tomorrow",
    "wallet": "0xYourWalletAddress"
  }'
```

## Endpoint Details

### POST `/sentient/agent`

**Request:**
```json
{
  "message": "user query",
  "wallet": "0xWalletAddress"
}
```

**Response:** SSE stream with events:
- `START`: Processing began
- `PROGRESS`: Intermediate updates
- `MESSAGE`: Final answer
- `END`: Task completed

## ROMA Orchestration

The `LifeOSAgent` (MetaAgent) handles:
- Intent detection using keyword matching + Dobby reasoning
- Routing to appropriate sub-agent
- Progress tracking for streaming
- Result caching to avoid re-running agents

## Usage Tracking

Usage is logged via `usage_tracking.py`:
- Agent invocations
- Cost calculation (premium vs free)
- OML compliance

**Note:** Currently logs internally. Will integrate with Sentient usage API when available.

## Monetization

- **Free Tier**: Basic reminders
- **Usage Fee**: 0.001 SENT per advanced invocation
- **Premium**: 0.01 SENT/month staking
- **OML Royalties**: 0.05% from forks

## GRID Registration

1. Deploy agent server to public URL
2. Update `grid_manifest.json` with deployment URL
3. Generate OML fingerprints
4. Submit to Sentient GRID

## Troubleshooting

**ModuleNotFoundError:** Install `sentient-agent-framework`

**Port in use:** Set `SENTIENT_AGENT_PORT` to different port

**Wallet not found:** Ensure Sentient Chat passes wallet in query metadata

See `backend/README_SENTIENT.md` for detailed technical documentation.

