# 🚀 How to Start DAILYAGI

## ✅ **Backend Status: RUNNING!**
Your backend is **already running** on `http://localhost:8000` ✅

Test it: Open `http://localhost:8000/health` in your browser

## ⚠️ **Frontend Issue: npm not found**

You need to install **Node.js** to run the frontend.

### **Option 1: Install Node.js (Recommended)**

1. **Download Node.js**: https://nodejs.org/
   - Download the LTS version (recommended)
   - Run the installer
   - Make sure to check "Add to PATH" during installation

2. **After installation, restart your terminal/PowerShell**

3. **Verify installation**:
   ```powershell
   node --version
   npm --version
   ```

4. **Install frontend dependencies**:
   ```powershell
   npm install
   ```

5. **Start frontend**:
   ```powershell
   npm run dev
   ```

### **Option 2: Use Existing Node.js**

If Node.js is already installed but not in PATH:

1. Find where Node.js is installed (usually `C:\Program Files\nodejs\`)
2. Add it to your PATH, OR
3. Use full path:
   ```powershell
   "C:\Program Files\nodejs\npm.cmd" install
   "C:\Program Files\nodejs\npm.cmd" run dev
   ```

## 📋 **Quick Start (After Node.js is installed)**

**Terminal 1 - Backend (Already Running!):**
```powershell
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```powershell
npm install
npm run dev
```

## 🌐 **Access the App**

- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000 (after starting)

## ✅ **Current Status**

- ✅ Backend: **RUNNING** on port 8000
- ⏳ Frontend: **Waiting for Node.js/npm**

---

**Next Step**: Install Node.js from https://nodejs.org/ then run `npm install` and `npm run dev`

