# Setup Guide

Complete guide for setting up and running dailyAGI locally.

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**
- API keys (see [Environment Variables](#environment-variables))

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Forgingalex/DailyAGI.git
cd DailyAGI
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp env.example .env
```

### Required Variables

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Get from [WalletConnect Cloud](https://cloud.walletconnect.com)
- `NEXT_PUBLIC_API_URL` - `http://localhost:8000` (for local dev)
- `NEXT_PUBLIC_AGENT_URL` - `http://localhost:8001` (for local dev)

### Optional Variables (app works with mock data if not provided)

- `HF_TOKEN` - Hugging Face token for Dobby reasoning
- `TWILIO_SID` / `TWILIO_TOKEN` - Twilio credentials for SMS notifications
- `COVALENT_KEY` - Covalent API key for on-chain transaction analysis
- `WEB3_STORAGE_TOKEN` - web3.storage token for IPFS storage
- `EXA_KEY` - Exa Vision API key for grocery image analysis
- `SENTIENT_KEY` - Sentient API key (for future features)

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
python main.py
```

Backend runs on `http://localhost:8000`

### Start Agent Server (Terminal 2)

```bash
cd backend
python agent_server.py
```

Agent server runs on `http://localhost:8001`

### Start Frontend (Terminal 3)

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Testing

1. Open `http://localhost:3000` in your browser
2. Click "Connect Wallet" or use "Try Demo" mode
3. Test each agent:
   - **Reminders**: Create reminders and view calendar integration
   - **Spending**: View on-chain transaction analysis
   - **Grocery**: Upload fridge photos to generate shopping lists

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (should be 3.10+)
- Install dependencies: `pip install -r backend/requirements.txt`
- Check port 8000 is not in use

### Frontend won't start
- Check Node version: `node --version` (should be 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check port 3000 is not in use

### Wallet won't connect
- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set in `.env`
- Check browser console for errors
- Try a different wallet

### API errors
- Ensure backend is running on port 8000
- Verify `NEXT_PUBLIC_API_URL` matches backend URL
- Check backend logs for errors

## Next Steps

- See [Deployment Guide](./DEPLOYMENT.md) for production deployment
- See [Architecture](./ARCHITECTURE.md) for system design details
- See [Sentient Integration](./SENTIENT_INTEGRATION.md) for Sentient-specific setup

