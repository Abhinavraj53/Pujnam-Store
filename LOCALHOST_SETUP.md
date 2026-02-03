# 🚀 Run Backend and Frontend on Localhost - Complete Guide

## 📋 Prerequisites

- Node.js installed (v16 or higher)
- npm or yarn installed
- MongoDB Atlas account (or local MongoDB)

## 🎯 Quick Start

### Option 1: Run Both in Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```
Backend will run on: `http://localhost:5001`

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Option 2: Run Both in Background

**Backend:**
```bash
cd backend
npm run dev &
```

**Frontend:**
```bash
npm run dev &
```

## 📂 Project Structure

```
Pujnam Store/
├── backend/          # Backend API (Node.js/Express)
│   ├── .env         # Backend environment variables
│   ├── server.js     # Backend server entry point
│   └── ...
├── src/              # Frontend (React/TypeScript)
│   ├── components/
│   └── ...
├── .env              # Frontend environment variables
└── package.json      # Frontend dependencies
```

## ⚙️ Environment Setup

### Step 1: Backend Environment Variables

Create/Update `backend/.env` file:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pujnam_store

# JWT Secret
JWT_SECRET=your_long_random_secret_key_here

# Hostinger Email Configuration
HOSTINGER_EMAIL_USER=info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD=your_hostinger_email_password
HOSTINGER_SMTP_PORT=465
```

### Step 2: Frontend Environment Variables

Create/Update `.env` file in root directory:

```env
# Frontend API URL - Localhost
VITE_API_URL=http://localhost:5001/api
```

## 🚀 Step-by-Step Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
# Go back to root directory
cd ..
npm install
```

### Step 3: Configure Environment Variables

1. **Backend `.env`:**
   - Copy `backend/.env.example` to `backend/.env` (if exists)
   - Add MongoDB connection string
   - Add JWT secret
   - Add Hostinger email credentials

2. **Frontend `.env`:**
   - Create `.env` in root directory
   - Add `VITE_API_URL=http://localhost:5001/api`

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Connected to MongoDB Atlas
📦 Environment: development
🔌 PORT from Render: Not set (using default 5001)
🌐 Binding to: 0.0.0.0:5001
✅ Server successfully started on http://0.0.0.0:5001
🚀 Backend API is ready at: http://0.0.0.0:5001/api
```

### Step 5: Start Frontend Server

Open a **new terminal** and run:

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.4.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## ✅ Verification

### Check Backend:
```bash
curl http://localhost:5001/api/health
```

**Expected Response:**
```json
{"status":"ok","message":"Pujnam Store API is running"}
```

### Check Frontend:
Open browser: `http://localhost:5173`

You should see the Pujnam Store homepage.

### Check API Connection:
Open browser console (F12) and look for:
```
🔗 API Base URL: http://localhost:5001/api
```

## 📊 Server URLs

- **Backend API:** `http://localhost:5001`
- **Backend Health Check:** `http://localhost:5001/api/health`
- **Frontend:** `http://localhost:5173`
- **API Endpoint:** `http://localhost:5001/api`

## 🛑 Stop Servers

### Stop Backend:
```bash
# Find process
lsof -ti:5001

# Kill process
kill $(lsof -ti:5001)
```

### Stop Frontend:
```bash
# Find process
lsof -ti:5173

# Kill process
kill $(lsof -ti:5173)
```

### Stop Both:
```bash
kill $(lsof -ti:5001,5173)
```

Or simply press `Ctrl+C` in the terminal where the server is running.

## 🔧 Troubleshooting

### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5001
```

**Solution:**
```bash
# Kill process on port 5001
kill $(lsof -ti:5001)

# Kill process on port 5173
kill $(lsof -ti:5173)
```

### Issue 2: Backend Not Starting

**Check:**
1. MongoDB connection string correct hai?
2. `.env` file `backend/` folder mein hai?
3. Dependencies installed hain? (`npm install` in backend folder)

**Solution:**
```bash
cd backend
npm install
npm run dev
```

### Issue 3: Frontend Not Starting

**Check:**
1. Dependencies installed hain? (`npm install` in root)
2. `.env` file root directory mein hai?
3. `VITE_API_URL` correctly set hai?

**Solution:**
```bash
npm install
npm run dev
```

### Issue 4: API Connection Failed

**Error:**
```
Failed to fetch
CORS error
```

**Solution:**
1. Backend running hai verify karein: `curl http://localhost:5001/api/health`
2. Frontend `.env` mein `VITE_API_URL=http://localhost:5001/api` check karein
3. Browser console mein API URL check karein

### Issue 5: MongoDB Connection Failed

**Error:**
```
❌ MongoDB connection error
```

**Solution:**
1. MongoDB Atlas mein IP whitelist check karein (`0.0.0.0/0` for all)
2. Connection string correct hai verify karein
3. MongoDB cluster running hai check karein

## 📝 Development Workflow

### 1. Start Development Session

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### 2. Make Changes

- **Backend changes:** Server auto-reloads (nodemon)
- **Frontend changes:** Browser auto-refreshes (Vite HMR)

### 3. Test Changes

- Open `http://localhost:5173`
- Check browser console for errors
- Check backend terminal for logs

### 4. Stop Development Session

Press `Ctrl+C` in both terminals.

## 🎯 Common Commands

### Backend:
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start development server
npm start            # Start production server
npm run seed         # Seed database (if available)
```

### Frontend:
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔍 Debugging Tips

### Backend Logs:
- Check terminal where `npm run dev` is running
- Look for MongoDB connection messages
- Check for API request logs

### Frontend Logs:
- Open browser console (F12)
- Check Network tab for API calls
- Look for console.log messages

### API Testing:
```bash
# Health check
curl http://localhost:5001/api/health

# Test products endpoint
curl http://localhost:5001/api/products
```

## 📚 Additional Resources

- **Backend API Docs:** Check `backend/` folder for route documentation
- **Frontend Components:** Check `src/components/` folder
- **Environment Variables:** See `.env` files in respective folders

## ✅ Quick Checklist

- [ ] Node.js installed
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend `.env` file configured
- [ ] Frontend `.env` file configured
- [ ] MongoDB connection working
- [ ] Backend server running on port 5001
- [ ] Frontend server running on port 5173
- [ ] Browser opens `http://localhost:5173`
- [ ] API calls working (check browser console)

## 🎉 Success!

Agar sab kuch sahi se setup hai, to:
- Backend: `http://localhost:5001/api/health` se response aayega
- Frontend: `http://localhost:5173` par homepage dikhega
- API calls: Browser console mein successful requests dikhenge

Happy Coding! 🚀
