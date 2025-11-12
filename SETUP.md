# DAILYAGI Setup Guide

This guide will help you set up and run DAILYAGI locally.

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**
- API keys for:
  - WalletConnect (free at https://cloud.walletconnect.com)
  - Hugging Face (optional, for Dobby)
  - Twilio (optional, for SMS)
  - Covalent (free tier available)
  - web3.storage (free tier available)
  - Exa (optional, for vision)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/Forgingalex/DailyAGI.git
cd DailyAGI

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` and add your API keys:
```bash
# Required
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional (app will work with mock data if not provided)
HF_TOKEN=your_huggingface_token
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
COVALENT_KEY=your_covalent_key
WEB3_STORAGE_TOKEN=your_web3storage_token
EXA_KEY=your_exa_key
```

## Step 3: Start the Backend

```bash
cd backend
python main.py
```

The backend will start on `http://localhost:8000`

## Step 4: Start the Frontend

In a new terminal:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 5: Connect Your Wallet

1. Open `http://localhost:3000` in your browser
2. Click "Connect Wallet"
3. Select your wallet (MetaMask, WalletConnect, etc.)
4. Approve the connection

## Testing the Agents

### Reminders Agent
1. Go to the Reminders tab
2. Click "Add Reminder"
3. Fill in the form and submit
4. The reminder will be stored on IPFS (if configured)

### Spending Agent
1. Go to the Spending tab
2. The agent will fetch your wallet transactions
3. View spending analysis and charts

### Grocery Agent
1. Go to the Grocery tab
2. Click "Upload Fridge Photo"
3. Select an image
4. The agent will generate a shopping list

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
- Make sure WalletConnect Project ID is set in `.env`
- Check browser console for errors
- Try a different wallet

### API errors
- Check backend is running on port 8000
- Verify `NEXT_PUBLIC_API_URL` in `.env` matches backend URL
- Check backend logs for errors

## Next Steps

- Deploy to Vercel (frontend) and Render (backend)
- Deploy smart contracts to Polygon Mumbai
- Configure production API keys
- Set up Google Calendar OAuth (optional)

## Support

For issues, please open a GitHub issue or check the README.md for more information.


