# How to Add EXA_KEY

## Step 1: Get Your Exa API Key

1. **Sign up for Exa** (if you haven't already):
   - Visit: https://exa.ai
   - Click "Sign Up" or "Get Started"
   - Create an account

2. **Get your API key**:
   - Log in to your Exa dashboard
   - Navigate to "API Keys" or "Settings"
   - Copy your API key (it will look something like: `exa-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## Step 2: Add EXA_KEY to Your .env File

1. **Create or edit your `.env` file** in the project root:
   ```bash
   # If .env doesn't exist, copy from example
   cp env.example .env
   ```

2. **Open `.env` in a text editor** and find the line:
   ```
   EXA_KEY=your_exa_api_key
   ```

3. **Replace `your_exa_api_key` with your actual key**:
   ```
   EXA_KEY=exa-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   **Example:**
   ```
   EXA_KEY=exa-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
   ```

## Step 3: Restart Your Backend

After adding the key, restart your backend server:

```bash
# Stop the current backend (Ctrl+C)
# Then restart it
cd backend
python main.py
```

## Step 4: Verify It's Working

1. **Check the backend logs** when you upload an image:
   - If you see "Exa Vision API error" → the key might be invalid
   - If it works, you'll see detected items in the response

2. **Test in the app**:
   - Go to the Grocery tab
   - Upload a fridge photo
   - If EXA_KEY is working, you'll get real detected items
   - If not configured, you'll get mock items (milk, eggs, cheese, etc.)

## Troubleshooting

### Key not working?
- ✅ Make sure there are no extra spaces: `EXA_KEY=your_key` (not `EXA_KEY = your_key`)
- ✅ Make sure the key starts with `exa-`
- ✅ Check that you copied the entire key
- ✅ Verify the key is active in your Exa dashboard

### Still getting mock data?
- Check backend logs for error messages
- Verify `.env` file is in the project root (same folder as `package.json`)
- Make sure you restarted the backend after adding the key
- The backend reads `.env` on startup, so changes require a restart

### Don't have an Exa account?
- The app will work fine with mock data
- You can test all features without the API key
- Mock data returns: milk, eggs, cheese, yogurt, butter, orange juice

## Alternative: Using Exa SDK

If you prefer using the `exa-py` SDK (already in requirements.txt), you can also use:

```python
from exa import Exa

exa = Exa(api_key="your-exa-key")
```

But the current implementation handles both SDK and direct API calls automatically.


