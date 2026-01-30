# Backend Deployment Checklist - Render

## ✅ Pre-Deployment Checklist

### 1. GitHub Repository
- [x] Backend code pushed to GitHub
- [x] Repository: `https://github.com/Abhinavraj53/Pujnam-Store`
- [x] Branch: `main`
- [x] `render.yaml` file included
- [x] Only backend files (no frontend)

### 2. Code Verification
- [x] Server binds to `0.0.0.0` (for Render)
- [x] Uses `process.env.PORT` (Render's port)
- [x] `package.json` has `start` script
- [x] All dependencies listed in `package.json`

## 🚀 Render Deployment Steps

### Step 1: Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository: `Abhinavraj53/Pujnam-Store`
4. Click **"Connect"**

### Step 2: Configure Service Settings

**Basic Settings:**
```
Name: pujnam-store-backend
Region: Choose closest to your users
Branch: main
Root Directory: backend          ← CRITICAL!
Runtime: Node
```

**Build & Deploy:**
```
Build Command: cd backend && npm install
Start Command: cd backend && npm start
```

**OR (if Root Directory is set to `backend`):**
```
Build Command: npm install
Start Command: npm start
```

### Step 3: Add Environment Variables

Go to **Environment** tab and add:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/pujnam_store
JWT_SECRET = your-long-random-secret-key-here
EMAIL_USER = your-email@gmail.com (optional)
EMAIL_PASSWORD = your-gmail-app-password (optional)
FREE_ASTROLOGY_API_KEY = your-key (optional)
```

**Important:**
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Long random string for security
- For Gmail: Enable 2FA and use App Password

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. Check logs for success

## ✅ Post-Deployment Verification

### 1. Check Build Logs

**Success looks like:**
```
==> Running build command 'cd backend && npm install'...
added 123 packages in 5s
==> Build successful 🎉
```

### 2. Check Server Logs

**Success looks like:**
```
📦 Environment: production
🔌 PORT from Render: 10000
🌐 Binding to: 0.0.0.0:10000
✅ Server successfully started on http://0.0.0.0:10000
🚀 Backend API is ready at: http://0.0.0.0:10000/api
```

### 3. Test API Endpoints

**Health Check:**
```
https://your-backend-url.onrender.com/api/health
```
Expected: `{"status":"ok","message":"Pujnam Store API is running"}`

**Products:**
```
https://your-backend-url.onrender.com/api/products
```

## 🔧 Troubleshooting

### Error: "Could not read package.json"
**Fix:** Set Root Directory = `backend` in Render settings

### Error: "No open ports detected"
**Fix:** 
- Verify Start Command = `cd backend && npm start`
- Check server binds to `0.0.0.0`

### Error: "Database connection failed"
**Fix:**
- Check `MONGODB_URI` is correct
- MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Error: "Build failed"
**Fix:**
- Check Build Command = `cd backend && npm install`
- Verify `backend/package.json` exists in GitHub

## 📝 Render Dashboard Settings Summary

```
Service Name: pujnam-store-backend
Root Directory: backend
Build Command: cd backend && npm install
Start Command: cd backend && npm start
Runtime: Node
Plan: Free
```

## 🎯 Your Backend URL

After deployment, your backend will be at:
```
https://pujnam-store-backend.onrender.com
```

Use this URL in your frontend:
```env
VITE_API_URL=https://pujnam-store-backend.onrender.com/api
```

## ✅ Final Checklist

- [ ] Service created on Render
- [ ] Root Directory = `backend`
- [ ] Build Command = `cd backend && npm install`
- [ ] Start Command = `cd backend && npm start`
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Health check endpoint working
- [ ] Backend URL noted for frontend

## 🎉 Success!

If all checks pass, your backend is live on Render!
