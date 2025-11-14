# DAILYAGI - Decentralized AI Life Assistant

A full-stack decentralized web application built with **Sentient's AGI tools** (Dobby, ROMA, Enclaves, OML) that helps users manage reminders, analyze spending, and organize groceries, all with encrypted data stored on IPFS and owned by the user.

![DAILYAGI](https://img.shields.io/badge/DAILYAGI-v1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

### 1. **Reminders Agent**
- Google Calendar OAuth integration
- Twilio SMS notifications
- IPFS storage for reminder data
- Dobby-powered reasoning

### 2. **Spending Agent**
- On-chain transaction analysis via Covalent API
- Automatic spending categorization
- Spending nudges and alerts
- Interactive charts and visualizations

### 3. **Grocery Agent**
- Vision AI (Exa) for fridge photo analysis
- Automatic shopping list generation
- IPFS storage for lists
- Dobby reasoning for item recommendations

### 4. **Premium Features**
- ERC-20 staking contract (SENT token)
- 0.01 SENT/month for premium access
- Deployed on Polygon Mumbai testnet

## 🏗️ Architecture

```
DAILYAGI/
├── app/                    # Next.js frontend
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   └── utils/            # Utilities
├── backend/              # FastAPI backend
│   ├── agent_server.py   # Sentient Agent API server
│   ├── agents/           # AI agents
│   │   ├── meta_agent.py # ROMA orchestrator
│   │   ├── reminders.py
│   │   ├── spending.py
│   │   └── grocery.py
│   ├── usage_tracking.py # Usage logging
│   └── utils/            # Helper utilities
├── contracts/            # Smart contracts
│   └── SENTStaking.sol
└── grid_manifest.json    # Sentient GRID metadata
```

## 🔗 Sentient Chat Integration

dailyAGI is fully integrated with **Sentient Chat** via the official Sentient-Agent-Framework.

### Features:
- ✅ SSE streaming endpoint (`/sentient/agent`)
- ✅ ROMA-based multi-agent orchestration
- ✅ Intent detection and routing
- ✅ Usage tracking for monetization
- ✅ OML compliance ready

### Running the Sentient Agent Server:

```bash
cd backend
python agent_server.py
```

See `backend/README_SENTIENT.md` for detailed integration documentation.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- WalletConnect Project ID
- API keys (see `.env.example`)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Forgingalex/DailyAGI.git
cd DailyAGI
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys
```

5. **Start the development servers**

**Backend (Terminal 1):**
```bash
cd backend
python main.py
# Or: uvicorn main:socket_app --reload --host 0.0.0.0 --port 8000
```

**Frontend (Terminal 2):**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 📦 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Backend (Render)

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:socket_app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy

### Smart Contracts

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
```

## 🔑 Environment Variables

See `.env.example` for all required variables:

- `HF_TOKEN` - Hugging Face token for Dobby
- `SENTIENT_KEY` - Sentient API key
- `TWILIO_SID` / `TWILIO_TOKEN` - Twilio credentials
- `COVALENT_KEY` - Covalent API key
- `WEB3_STORAGE_TOKEN` - web3.storage token
- `EXA_KEY` - Exa Vision API key
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID

## 🧪 Testing

### Frontend
```bash
npm run lint
npm run build
```

### Backend
```bash
cd backend
pytest tests/  # If tests are added
```

### Smart Contracts
```bash
cd contracts
npx hardhat test
```

## 📚 API Documentation

### Agent Endpoints

- `POST /agent/run` - ROMA orchestration endpoint
- `GET /agent/reminders` - Get reminders
- `POST /agent/reminders` - Create reminder
- `POST /agent/spending` - Analyze spending
- `POST /agent/grocery` - Process grocery image
- `GET /health` - Health check

See `backend/main.py` for full API documentation.

## 🔐 Security

- All user data is encrypted and stored on IPFS
- Private inference via Sentient Enclaves (mock implementation)
- Wallet-based authentication
- Premium features protected by smart contract

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Sentient.xyz** for AGI tools (Dobby, ROMA, Enclaves, OML)
- **OpenZeppelin** for smart contract libraries
- **WalletConnect** for wallet integration
- **Covalent** for blockchain data
- **web3.storage** for IPFS storage

## 📞 Support

For issues and questions:
- GitHub Issues: [https://github.com/Forgingalex/DailyAGI/issues](https://github.com/Forgingalex/DailyAGI/issues)
- Email: [olaiyaalexander97@gmail.com]

## 🗺️ Roadmap

- [ ] Full Sentient Enclave integration
- [ ] Multi-chain support
- [ ] Advanced AI reasoning
- [ ] Mobile app
- [ ] More agent types
- [ ] NFT rewards for power users

---

Built with ❤️ using Sentient's AGI tools


