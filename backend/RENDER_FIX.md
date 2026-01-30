# Render Port Error Fix - Complete Guide

## ❌ Problem: "No open ports detected on 0.0.0.0"

Yeh error tab aata hai jab Render **frontend (Vite)** chala raha ho instead of **backend**.

## ✅ Solution: Render Dashboard Settings

### Step 1: Service Settings Check Karein

Render Dashboard → Your Service → Settings → General

**YEH SETTINGS ZAROOR HONI CHAHIYE:**

```
Name: pujnam-store-backend
Root Directory: backend          ← YEH BOHOT IMPORTANT!
Runtime: Node
```

### Step 2: Build & Deploy Settings

Render Dashboard → Your Service → Settings → Build & Deploy

```
Build Command: npm install
Start Command: npm start
```

**❌ WRONG Commands (yeh mat use karein):**
- `npm run dev` (frontend command)
- `vite` (frontend command)
- `npm run build` (frontend command)

**✅ CORRECT Commands:**
- `npm install` (backend dependencies install)
- `npm start` (backend server start)

### Step 3: Verify Package.json

Backend ka `package.json` mein yeh hona chahiye:

```json
{
  "scripts": {
    "start": "node server.js"    ← YEH Render use karega
  }
}
```

## 🔍 How to Verify

### Check 1: Render Logs

Render Dashboard → Your Service → Logs

**Agar backend sahi chal raha hai, aapko yeh dikhega:**
```
✅ Server successfully started on http://0.0.0.0:10000
🚀 Backend API is ready at: http://0.0.0.0:10000/api
```

**Agar frontend chal raha hai, aapko yeh dikhega:**
```
➜  Local:   http://localhost:5173/
VITE v5.4.8  ready
```
← YEH GALAT HAI! Backend nahi chal raha.

### Check 2: Root Directory

Settings → General → Root Directory

**Must be:** `backend` (NOT empty, NOT root)

### Check 3: Start Command

Settings → Build & Deploy → Start Command

**Must be:** `npm start` (NOT `npm run dev`, NOT `vite`)

## 🚀 PORT Configuration

**Good News:** Aapko PORT manually set karne ki zarurat nahi hai!

- Render **automatically** `PORT` environment variable set karta hai
- Backend code already `process.env.PORT` use karta hai
- Server automatically `0.0.0.0` pe bind hota hai

**Code mein:**
```javascript
const PORT = process.env.PORT || 5001;  // Render ka PORT use hoga
const HOST = '0.0.0.0';                 // Always 0.0.0.0 for Render
app.listen(PORT, HOST, ...);
```

## 📝 Quick Fix Checklist

Agar abhi bhi error aaye, yeh steps follow karein:

1. ✅ **Root Directory = `backend`** (Settings → General)
2. ✅ **Start Command = `npm start`** (Settings → Build & Deploy)
3. ✅ **Build Command = `npm install`** (Settings → Build & Deploy)
4. ✅ **Manual Deploy** karein (Clear build cache ke saath)
5. ✅ **Logs check** karein - backend messages dikhne chahiye

## 🎯 Expected Behavior

**Correct Logs (Backend):**
```
📦 Environment: production
🔌 PORT from Render: 10000
🌐 Binding to: 0.0.0.0:10000
✅ Server successfully started on http://0.0.0.0:10000
🚀 Backend API is ready at: http://0.0.0.0:10000/api
```

**Wrong Logs (Frontend - ERROR):**
```
➜  Local:   http://localhost:5173/
VITE v5.4.8  ready
==> No open ports detected on 0.0.0.0
```

## 💡 Key Points

1. **Render automatically PORT set karta hai** - aapko manually set karne ki zarurat nahi
2. **Root Directory = `backend`** - yeh sabse important setting hai
3. **Start Command = `npm start`** - backend ka start command
4. **Server already `0.0.0.0` pe bind hai** - code sahi hai

Agar sab kuch sahi set hai phir bhi error aaye, to Render logs share karein.
