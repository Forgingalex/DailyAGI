# Complete Testing Guide for dailyAGI

## 🚀 Quick Start - Start All Servers

### Terminal 1 - Backend (FastAPI)
```powershell
cd backend
python main.py
```
**Expected:** Server starts on `http://localhost:8000`

### Terminal 2 - Sentient Agent Server
```powershell
cd backend
python agent_server.py
```
**Expected:** Server starts on `http://localhost:8001`

### Terminal 3 - Frontend
```powershell
npm run dev
```
**Expected:** Server starts on `http://localhost:3000`

---

## ✅ Test 1: Connect Wallet → Show Real Data

### Steps:
1. Open `http://localhost:3000`
2. Click **"Connect Wallet"** button
3. Select your wallet (OKX, MetaMask, etc.)
4. Approve connection in wallet
5. Verify dashboard appears

### Expected Results:
- ✅ Wallet address shows in navbar (truncated)
- ✅ "Demo Mode Active" banner disappears
- ✅ Dashboard shows real stats (if backend connected)
- ✅ Stats cards show actual data from backend

### Backend Endpoints Called:
- `GET /agent/reminders?address={wallet}` - Load reminders
- `POST /agent/spending` - Load spending data
- `GET /agent/grocery` - Load grocery lists

### Troubleshooting:
- If wallet doesn't connect: Check browser console for errors
- If demo data shows: Backend might not be running or address not passed correctly
- Check Network tab in DevTools to see API calls

---

## ✅ Test 2: Chat Modal → SSE Streaming

### Steps:
1. Connect wallet OR click "Try Demo"
2. Click **chat button** (bottom right, circular with message icon)
3. Type: `"remind me to buy groceries tomorrow"`
4. Press Enter or click Send
5. Watch for streaming responses

### Expected Results:
- ✅ Chat modal opens smoothly
- ✅ Your message appears immediately
- ✅ Progress updates stream in: "Analyzing...", "Detected intent...", etc.
- ✅ Final response appears: "✅ Reminder set: ..."
- ✅ No "connect wallet" error

### Backend Endpoint:
- `POST http://localhost:8001/sentient/agent`
- **Request:**
  ```json
  {
    "message": "remind me to buy groceries tomorrow",
    "wallet": "0xYourWalletAddress"
  }
  ```
- **Response:** SSE stream with events:
  - `START`: "dailyAGI is processing your request…"
  - `PROGRESS`: "Analyzing your request...", "Detected intent: reminders..."
  - `MESSAGE`: Final answer
  - `END`: Stream complete

### Troubleshooting:
- If "connect wallet" error: Chat modal now fixed to work with demo mode
- If no response: Check agent server is running on port 8001
- Check browser Network tab for SSE events
- Check backend terminal for logs

---

## ✅ Test 3: Reminders Page → Create Reminder

### Steps:
1. Navigate to `/reminders` or click **Reminders** tab
2. Click **"Add Reminder"** button
3. Fill in form:
   - **Title:** "Call Mom"
   - **Description:** "Weekly check-in"
   - **Date/Time:** Select tomorrow, 2:00 PM
4. Click **"Create"**
5. Verify reminder appears in list

### Expected Results:
- ✅ Form opens smoothly
- ✅ Reminder saves to backend
- ✅ New reminder appears in list immediately
- ✅ Shows correct date/time
- ✅ Can delete reminder (if wallet connected)

### Backend Endpoints:
- `GET /agent/reminders?address={wallet}` - Load existing reminders
- `POST /agent/reminders` - Create new reminder
  ```json
  {
    "address": "0x...",
    "title": "Call Mom",
    "description": "Weekly check-in",
    "datetime": "2025-01-XXT14:00:00"
  }
  ```
- `DELETE /agent/reminders/{id}?address={wallet}` - Delete reminder

### Troubleshooting:
- If reminder doesn't save: Check backend is running
- Check browser console for API errors
- Verify wallet is connected (or demo mode active)
- Check Network tab for failed POST request

---

## ✅ Test 4: Spending Page → Charts Load

### Steps:
1. Navigate to `/spending` or click **Spending** tab
2. Wait for charts to load
3. Try different time ranges: "Last 7 days", "Last 30 days", "Last 90 days"
4. Interact with charts (hover, click)

### Expected Results:
- ✅ Line chart shows weekly spending trend
- ✅ Pie chart shows category breakdown
- ✅ Stats cards show: Total Spent, Top Category, Number of Categories
- ✅ Charts are interactive (hover shows tooltips)
- ✅ Time range selector works

### Backend Endpoint:
- `POST /agent/spending`
  ```json
  {
    "address": "0x...",
    "timeRange": "7d" // or "30d", "90d"
  }
  ```
- **Response:**
  ```json
  {
    "totalSpent": 847.32,
    "categories": {
      "food": 245.50,
      "coffee": 89.20,
      ...
    },
    "chartData": [...],
    "pieData": [...],
    "nudge": "You spent 22% more..."
  }
  ```

### Troubleshooting:
- If charts don't load: Check backend response
- If demo data shows: Backend might not be running
- Check browser console for Recharts errors
- Verify data format matches expected structure

---

## ✅ Test 5: Grocery Page → Upload Image

### Steps:
1. Navigate to `/grocery` or click **Grocery** tab
2. **Option A:** Drag & drop an image onto the upload area
3. **Option B:** Click **"Scan Fridge"** and select image
4. Wait for processing (loading indicator)
5. Verify missing items list appears

### Expected Results:
- ✅ Upload area accepts drag & drop
- ✅ File picker opens on click
- ✅ Loading indicator shows during processing
- ✅ Missing items list appears
- ✅ IPFS CID displayed (if available)
- ✅ Items can be checked off

### Backend Endpoint:
- `POST /agent/grocery` (multipart/form-data)
  - `image`: File (image/jpeg, image/png)
  - `address`: Wallet address
- **Response:**
  ```json
  {
    "missing_items": ["Milk", "Eggs", "Lettuce"],
    "list_cid": "bafybei...",
    "timestamp": "2025-01-XX..."
  }
  ```

### Troubleshooting:
- If upload fails: Check file size/format
- If processing fails: Check backend logs
- Verify wallet is connected
- Check Network tab for failed POST request
- Ensure backend has EXA_KEY configured

---

## 🔍 Debugging Tools

### Browser DevTools
1. **Console Tab:** Check for JavaScript errors
2. **Network Tab:** 
   - Filter by "Fetch/XHR" to see API calls
   - Check request/response details
   - Look for failed requests (red)
3. **Application Tab:** 
   - Check localStorage for `wallet_address`
   - Verify session storage

### Backend Logs
- FastAPI shows request logs in terminal
- Agent server shows SSE events
- Check for Python errors/exceptions

### Test Endpoints Directly

**Backend Health:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/health"
```

**Get Reminders:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/agent/reminders?address=0x123"
```

**Create Reminder:**
```powershell
$body = @{
    address = "0x123"
    title = "Test"
    datetime = "2025-01-20T14:00:00"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/agent/reminders" -Method POST -ContentType "application/json" -Body $body
```

**Sentient Agent:**
```powershell
$body = @{
    message = "test"
    wallet = "0x123"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8001/sentient/agent" -Method POST -ContentType "application/json" -Body $body
```

---

## 📋 Test Checklist

- [ ] Backend server running (port 8000)
- [ ] Agent server running (port 8001)
- [ ] Frontend running (port 3000)
- [ ] Wallet connects successfully
- [ ] Demo mode works
- [ ] Chat modal opens and sends messages
- [ ] SSE streaming works in chat
- [ ] Reminders page loads
- [ ] Can create reminder
- [ ] Reminder saves and appears
- [ ] Spending page loads
- [ ] Charts display correctly
- [ ] Time range selector works
- [ ] Grocery page loads
- [ ] Image upload works
- [ ] Missing items list appears

---

## 🎯 Success Criteria

All tests pass when:
1. ✅ Wallet connection shows real data
2. ✅ Chat modal streams responses via SSE
3. ✅ Reminders can be created and saved
4. ✅ Spending charts load and display data
5. ✅ Grocery image upload processes successfully

---

## 📝 Notes

- Chat modal now works with both wallet and demo mode
- All endpoints require wallet address (or demo address)
- Backend must be running for real data
- Demo mode shows hardcoded data if backend unavailable
- Check environment variables if API calls fail



