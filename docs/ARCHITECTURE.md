# Architecture

System architecture and design decisions for dailyAGI.

## Overview

dailyAGI is a decentralized AI life assistant built on Sentient's AGI stack, consisting of:

- **Frontend**: Next.js with TypeScript and TailwindCSS
- **Backend API**: FastAPI with Python
- **Agent Server**: Sentient-Agent-Framework integration
- **Smart Contracts**: Solidity on Polygon/Base
- **Storage**: IPFS via web3.storage

## System Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port 3000     │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐ ┌──────▼──────────┐
│  Backend API    │ │  Agent Server   │
│  (FastAPI)      │ │  (Sentient)     │
│  Port 8000      │ │  Port 8001      │
└────────┬────────┘ └────────┬────────┘
         │                   │
         ├───────────────────┤
         │                   │
    ┌────▼────┐        ┌────▼────┐
    │  Agents │        │  ROMA   │
    │  Layer  │        │  Meta   │
    └────┬────┘        └────┬────┘
         │                   │
    ┌────▼───────────────────▼────┐
    │  External APIs & Services    │
    │  - Covalent (on-chain)       │
    │  - Exa Vision (images)       │
    │  - Twilio (SMS)              │
    │  - Google Calendar           │
    │  - IPFS (web3.storage)       │
    └─────────────────────────────┘
```

## Agent Architecture

### LifeOSAgent (MetaAgent)

ROMA orchestrator that:
- Detects user intent from natural language
- Routes to appropriate sub-agent
- Coordinates multi-agent workflows
- Tracks progress for streaming

### Sub-Agents

1. **RemindersAgent**
   - Google Calendar integration
   - Twilio SMS notifications
   - IPFS storage
   - Dobby reasoning

2. **SpendingAgent**
   - Covalent API for on-chain data
   - Automatic categorization
   - Spending analysis and charts
   - Dobby-powered insights

3. **GroceryAgent**
   - Exa Vision API for image analysis
   - Shopping list generation
   - IPFS storage
   - Dobby recommendations

## Data Flow

1. User sends message via frontend or Sentient Chat
2. Request routed to appropriate agent via MetaAgent
3. Agent processes using external APIs and Dobby reasoning
4. Results stored on IPFS (encrypted, user-owned)
5. Response streamed back via SSE
6. Usage logged for monetization

## Security

- **Data Storage**: All data encrypted and stored on IPFS
- **Authentication**: Wallet-based (Web3)
- **Inference**: Private via Sentient Enclaves (planned)
- **Premium**: Protected by smart contract staking

## Technology Stack

**Frontend:**
- Next.js 15
- TypeScript
- TailwindCSS
- Framer Motion
- WalletConnect v2

**Backend:**
- FastAPI
- Python 3.10+
- Sentient-Agent-Framework
- Socket.IO

**Blockchain:**
- Solidity
- Hardhat
- Polygon/Base

**Storage:**
- IPFS (web3.storage)

## Scalability

- Stateless backend design
- IPFS for decentralized storage
- Multi-agent architecture for extensibility
- ROMA orchestration for complex workflows

## Future Enhancements

- Full Sentient Enclave integration
- Multi-chain support
- Advanced Dobby reasoning
- Mobile app
- Additional agent types

