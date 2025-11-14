# 🚀 Production Deployment Guide for dailyAGI

Complete guide for deploying dailyAGI to production environments.

---

## 📋 Pre-Deployment Checklist

- [x] ✅ ChatModal endpoint fixed (uses `NEXT_PUBLIC_AGENT_URL`)
- [x] ✅ Environment variables configured
- [x] ✅ `render.yaml` created for Render deployment
- [x] ✅ `vercel.json` updated with agent URL
- [ ] ⏳ Test Sentient agent endpoint locally
- [ ] ⏳ Test chat modal integration
- [ ] ⏳ Deploy backend services
- [ ] ⏳ Deploy frontend
- [ ] ⏳ Test production deployment

---

## 🧪 Step 1: Local Testing

### 1.1 Test Sentient Agent Endpoint

**Start the agent server:**
```powershell
cd backend
python agent_server.py
```

**Test with PowerShell:**
```powershell
.\test_agent_endpoint.ps1
```

**Or manually:**
```powershell
$body = @{
    message = "remind me to call my sister tomorrow"
    wallet = "0x1234567890123456789012345678901234567890"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8001/sentient/agent" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

**Expected:** SSE stream with events (START, PROGRESS, MESSAGE, END)

### 1.2 Test Chat Modal Integration

1. **Start all servers:**
   ```powershell
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   python main.py
   
   # Terminal 3 - Agent Server
   cd backend
   python agent_server.py
   ```

2. **Test in browser:**
   - Open http://localhost:3000
   - Connect wallet (or use demo mode)
   - Click chat button (bottom right)
   - Send: "remind me to buy groceries tomorrow"
   - Verify SSE streaming works
   - Check browser console for errors

---

## 🌐 Step 2: Frontend Deployment (Vercel)

### 2.1 Prepare for Deployment

**Ensure code is pushed to GitHub:**
```powershell
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2.2 Deploy on Vercel

1. **Go to Vercel:** https://vercel.com
2. **Import Project:**
   - Click "Add New" → "Project"
   - Import from GitHub: `Forgingalex/DailyAGI`
   - Select repository

3. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_AGENT_URL=https://your-agent-server-url.onrender.com
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=7ac31ce4838c0f004c63712a6ed53a13
   ```
   
   **Note:** Replace URLs with your actual backend URLs after deployment

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Note your Vercel URL (e.g., `dailyagi.vercel.app`)

### 2.3 Post-Deployment

- [ ] Verify site loads at Vercel URL
- [ ] Test wallet connection
- [ ] Update backend CORS to allow Vercel domain
- [ ] Test API calls from production frontend

---

## 🖥️ Step 3: Backend Deployment (Render)

### 3.1 Deploy Main Backend

1. **Go to Render:** https://render.com
2. **New → Web Service**
3. **Connect GitHub Repository:**
   - Select `Forgingalex/DailyAGI`
   - Click "Connect"

4. **Configure Service:**
   - **Name:** `dailyagi-backend`
   - **Environment:** Python 3
   - **Region:** Choose closest to users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:socket_app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables:**
   ```
   HF_TOKEN=your_huggingface_token_here
   TWILIO_SID=your_twilio_sid_here
   TWILIO_TOKEN=your_twilio_token_here
   COVALENT_KEY=your_covalent_key_here
   EXA_KEY=your_exa_key_here
   SENTIENT_KEY=your_sentient_key_here
   WEB3_STORAGE_TOKEN=your_web3_storage_token_here
   ```

6. **Advanced Settings:**
   - **Auto-Deploy:** Yes (deploy on push to main)
   - **Health Check Path:** `/health`

7. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment
   - Note your backend URL (e.g., `dailyagi-backend.onrender.com`)

### 3.2 Deploy Agent Server

**Option A: Using render.yaml (Recommended)**

1. **In Render Dashboard:**
   - Go to "New" → "Blueprint"
   - Connect GitHub repo
   - Render will detect `render.yaml`
   - Review services and deploy

**Option B: Manual Setup**

1. **New → Web Service**
2. **Configure:**
   - **Name:** `dailyagi-agent-server`
   - **Environment:** Python 3
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python agent_server.py`

3. **Add Environment Variables:**
   ```
   SENTIENT_AGENT_PORT=$PORT
   SENTIENT_AGENT_HOST=0.0.0.0
   HF_TOKEN=your_huggingface_token_here
   TWILIO_SID=your_twilio_sid_here
   TWILIO_TOKEN=your_twilio_token_here
   COVALENT_KEY=your_covalent_key_here
   EXA_KEY=your_exa_key_here
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Note your agent server URL

### 3.3 Update CORS Settings

**In `backend/main.py`, ensure CORS allows your frontend domain:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local dev
        "https://your-vercel-url.vercel.app",  # Production
        "https://*.vercel.app",  # All Vercel previews
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Do the same for `backend/agent_server.py` if needed.**

---

## 🔄 Step 4: Update Frontend Environment Variables

After backend services are deployed:

1. **Go to Vercel Dashboard**
2. **Project Settings → Environment Variables**
3. **Update:**
   ```
   NEXT_PUBLIC_API_URL=https://dailyagi-backend.onrender.com
   NEXT_PUBLIC_AGENT_URL=https://dailyagi-agent-server.onrender.com
   ```
4. **Redeploy** (or wait for auto-deploy)

---

## ✅ Step 5: Production Testing

### 5.1 Test Checklist

- [ ] **Frontend loads:** https://your-vercel-url.vercel.app
- [ ] **Backend health:** https://your-backend-url.onrender.com/health
- [ ] **Agent endpoint:** Test with curl/PowerShell
- [ ] **Wallet connection:** Connect wallet on production site
- [ ] **Chat modal:** Send message, verify SSE streaming
- [ ] **Reminders:** Create reminder, verify it saves
- [ ] **Spending:** View charts, verify data loads
- [ ] **Grocery:** Upload image, verify processing

### 5.2 Test Agent Endpoint (Production)

```powershell
$body = @{
    message = "remind me to call my sister tomorrow"
    wallet = "0x1234567890123456789012345678901234567890"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://your-agent-server-url.onrender.com/sentient/agent" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

## 🚨 Troubleshooting

### Frontend Issues

**Problem:** API calls fail with CORS error
**Solution:** Update backend CORS to include Vercel domain

**Problem:** Environment variables not loading
**Solution:** 
- Check Vercel environment variables are set
- Redeploy after adding variables
- Verify variable names match code (NEXT_PUBLIC_*)

### Backend Issues

**Problem:** Backend won't start
**Solution:**
- Check build logs for missing dependencies
- Verify Python version (3.10+)
- Check environment variables are set

**Problem:** Health check fails
**Solution:**
- Verify `/health` endpoint exists
- Check server logs for errors
- Ensure port is set correctly ($PORT)

### Agent Server Issues

**Problem:** Agent server not responding
**Solution:**
- Check if `sentient-agent-framework` is installed
- Verify `SENTIENT_AGENT_PORT` is set
- Check logs for import errors

**Problem:** SSE streaming not working
**Solution:**
- Verify Content-Type headers
- Check CORS settings
- Test endpoint directly with curl

---

## 📝 Deployment Checklist Summary

### Before Deployment
- [x] Code pushed to GitHub
- [x] Environment variables documented
- [x] Local testing completed
- [x] Deployment configs created

### Frontend (Vercel)
- [ ] Repository connected
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Production URL working

### Backend (Render)
- [ ] Main backend deployed
- [ ] Agent server deployed
- [ ] Environment variables set
- [ ] Health checks passing
- [ ] CORS configured

### Post-Deployment
- [ ] Frontend URLs updated in Vercel
- [ ] All features tested
- [ ] Monitoring set up
- [ ] Documentation updated

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **GitHub Repository:** https://github.com/Forgingalex/DailyAGI

---

## 📞 Support

If you encounter issues:
1. Check server logs in Vercel/Render dashboards
2. Test endpoints directly with curl/PowerShell
3. Verify environment variables are set correctly
4. Check browser console for frontend errors

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd")

