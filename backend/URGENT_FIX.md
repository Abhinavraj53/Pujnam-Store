# 🚨 URGENT FIX - Render Running Frontend Instead of Backend

## ❌ Current Error

Render is running **frontend (Vite)** instead of **backend**:
```
> vite-react-typescript-starter@0.0.0 start
> vite preview
```

## ✅ IMMEDIATE FIX - Render Dashboard

### Step 1: Go to Render Dashboard

1. Login to [Render Dashboard](https://dashboard.render.com/)
2. Click on your service: `pujnam-store-backend`
3. Go to **Settings** tab

### Step 2: Fix Root Directory

**Settings → General → Root Directory**

**Current (WRONG):** Probably empty or root
**Change to:** `backend`

**Exactly type:** `backend` (no slashes, no quotes)

### Step 3: Fix Start Command

**Settings → Build & Deploy → Start Command**

**Current (WRONG):** `npm start` (runs root package.json - frontend)
**Change to:** `cd backend && npm start`

**OR if Root Directory is set to `backend`:**
**Change to:** `npm start`

### Step 4: Fix Build Command

**Settings → Build & Deploy → Build Command**

**Change to:** `cd backend && npm install`

**OR if Root Directory is set to `backend`:**
**Change to:** `npm install`

### Step 5: Save and Redeploy

1. Click **"Save Changes"**
2. Go to **Manual Deploy**
3. Select **"Clear build cache & deploy"**
4. Click **"Deploy latest commit"**

## 🔍 How to Verify Settings

### Correct Configuration:

```
┌─────────────────────────────────────┐
│ General Settings:                   │
│ Root Directory: backend  ← MUST BE! │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Build & Deploy:                     │
│ Build Command: cd backend && npm install │
│ Start Command: cd backend && npm start  │
└─────────────────────────────────────┘
```

### Wrong Configuration (Current Error):

```
┌─────────────────────────────────────┐
│ General Settings:                   │
│ Root Directory: (empty)  ← WRONG!   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Build & Deploy:                     │
│ Start Command: npm start  ← Runs root package.json (frontend) │
└─────────────────────────────────────┘
```

## ✅ Expected Logs After Fix

**Correct Backend Logs:**
```
==> Running 'cd backend && npm start'
> pujnam-store-backend@1.0.0 start
> node server.js
📦 Environment: production
🔌 PORT from Render: 10000
🌐 Binding to: 0.0.0.0:10000
✅ Server successfully started on http://0.0.0.0:10000
🚀 Backend API is ready at: http://0.0.0.0:10000/api
```

**Wrong Frontend Logs (Current Error):**
```
==> Running 'npm start'
> vite-react-typescript-starter@0.0.0 start
> vite preview
➜  Local:   http://localhost:4173/
```

## 🎯 Quick Fix Checklist

- [ ] **Root Directory** = `backend` (Settings → General)
- [ ] **Build Command** = `cd backend && npm install`
- [ ] **Start Command** = `cd backend && npm start`
- [ ] **Save Changes**
- [ ] **Manual Deploy** with "Clear build cache"
- [ ] **Check Logs** - should show "node server.js" not "vite"

## 💡 Why This Happens

Render is reading the **root `package.json`** which has:
```json
{
  "name": "vite-react-typescript-starter",  ← Frontend!
  "scripts": {
    "start": "vite preview"  ← Frontend command!
  }
}
```

Instead of **`backend/package.json`** which has:
```json
{
  "name": "pujnam-store-backend",  ← Backend!
  "scripts": {
    "start": "node server.js"  ← Backend command!
  }
}
```

## 🔧 Alternative: Delete and Recreate Service

If settings don't work:

1. **Delete** current service
2. **Create new** Web Service
3. **Set Root Directory = `backend`** from the start
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Deploy

## ✅ After Fix

Your backend should be running and accessible at:
```
https://your-service-name.onrender.com/api/health
```

Test it - should return:
```json
{"status":"ok","message":"Pujnam Store API is running"}
```
