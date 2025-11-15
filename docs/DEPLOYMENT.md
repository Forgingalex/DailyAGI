# Deployment Guide

Complete guide for deploying dailyAGI to production.

## Overview

dailyAGI consists of:
- **Frontend**: Next.js app (deploy to Netlify/Vercel)
- **Backend API**: FastAPI server (deploy to Render)
- **Agent Server**: Sentient agent server (deploy to Render)

## Prerequisites

- GitHub repository pushed
- Accounts on Netlify/Vercel and Render
- Environment variables ready

## Frontend Deployment (Netlify/Vercel)

### Netlify

1. Go to [Netlify](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub → Select `Forgingalex/DailyAGI`
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: (leave empty)
5. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_AGENT_URL=http://localhost:8001
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=7ac31ce4838c0f004c63712a6ed53a13
   ```
6. Click "Deploy site"

### Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import `Forgingalex/DailyAGI`
4. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
5. Add environment variables (same as Netlify)
6. Click "Deploy"

## Backend Deployment (Render)

### Option 1: Using Blueprint (Recommended)

1. Go to [Render](https://render.com)
2. Click "New" → "Blueprint"
3. Connect GitHub → Select repository
4. Render detects `render.yaml` automatically
5. Add environment variables for both services:
   ```
   HF_TOKEN=your_token
   TWILIO_SID=your_sid
   TWILIO_TOKEN=your_token
   COVALENT_KEY=your_key
   EXA_KEY=your_key
   SENTIENT_KEY=your_key
   WEB3_STORAGE_TOKEN=your_token
   ```
6. Click "Apply" and wait for deployment

### Option 2: Manual Setup

**Backend Service:**
- Name: `dailyagi-backend`
- Environment: Python 3
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:socket_app --host 0.0.0.0 --port $PORT`

**Agent Server:**
- Name: `dailyagi-agent-server`
- Environment: Python 3
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `python agent_server.py`
- Environment Variables:
  ```
  SENTIENT_AGENT_PORT=$PORT
  SENTIENT_AGENT_HOST=0.0.0.0
  ```

## Post-Deployment

1. **Update Frontend Environment Variables:**
   - Replace `localhost` URLs with production URLs
   - Redeploy frontend

2. **Update CORS:**
   - Add frontend domain to backend CORS settings
   - Update `backend/main.py` and `backend/agent_server.py`

3. **Test Production:**
   - Frontend loads correctly
   - Wallet connection works
   - API calls succeed
   - Agent server responds

## Troubleshooting

**CORS Errors:** Update backend CORS to include frontend domain

**Build Failures:** Check logs, verify environment variables, ensure dependencies are installed

**Agent Server Not Responding:** Verify `SENTIENT_AGENT_PORT` is set, check logs for errors

See [Setup Guide](./SETUP.md) for local testing and troubleshooting.

