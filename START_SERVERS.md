# 🚀 Starting DAILYAGI Servers

## Theme Updated ✅
The application theme has been updated to match Sentient's brand colors:
- **Primary Purple**: `#a855f7` (sentient-500)
- **Accent Colors**: Purple, Violet, Indigo, Pink gradients
- All components now use the Sentient color palette

## Starting the Servers

### Option 1: Manual Start (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Option 2: Using the Scripts

**Windows:**
```bash
# Backend
start "DAILYAGI Backend" cmd /k "cd backend && python main.py"

# Frontend  
start "DAILYAGI Frontend" cmd /k "npm run dev"
```

**Linux/Mac:**
```bash
./start-dev.sh
```

## Testing EXA_KEY

### 1. Verify EXA_KEY is loaded:
```bash
python test_exa_key.py
```

### 2. Test in the App:
1. Open `http://localhost:3000` in your browser
2. Connect your wallet
3. Go to **Grocery** tab
4. Click **"Upload Fridge Photo"**
5. Select an image
6. The Exa Vision API should process it with your key!

### 3. Check Backend Logs:
Look for messages like:
- ✅ "Exa Vision API processing image..."
- ❌ "Exa Vision API error: ..." (if there's an issue)

## Expected Behavior

**With EXA_KEY configured:**
- Real image analysis from Exa Vision API
- Detected items from your fridge photo
- Shopping list generated based on detected items

**Without EXA_KEY (fallback):**
- Mock detected items: milk, eggs, cheese, yogurt, butter, orange juice
- Still functional for testing

## Troubleshooting

### Backend won't start:
- Check Python version: `python --version` (should be 3.10+)
- Install dependencies: `pip install -r backend/requirements.txt`
- Check port 8000 is available

### Frontend won't start:
- Install dependencies: `npm install`
- Check port 3000 is available
- Clear `.next` folder: `rm -rf .next` (then `npm run dev`)

### EXA_KEY not working:
- Verify `.env` file exists in project root
- Check `EXA_KEY=d6b1af81-badf-43d3-835e-ca4728a0ea26` is in `.env`
- Restart backend after changing `.env`
- Run `python test_exa_key.py` to verify

---

**Your EXA_KEY:** `d6b1af81-badf-43d3-835e-ca4728a0ea26` ✅


