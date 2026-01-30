# Render Root Directory Error Fix

## ❌ Error: "Could not read package.json: /opt/render/project/src/package.json"

Yeh error tab aata hai jab Render **Root Directory** sahi set nahi hai.

## ✅ Solution: Render Dashboard Settings

### Method 1: Using Render Dashboard (Recommended)

1. **Render Dashboard** → Your Service → **Settings** → **General**

2. **Root Directory** field mein yeh set karein:
   ```
   backend
   ```
   (NOT empty, NOT `/backend`, just `backend`)

3. **Build Command:**
   ```
   npm install
   ```

4. **Start Command:**
   ```
   npm start
   ```

5. **Save** karein aur **Manual Deploy** karein.

### Method 2: Using Build Commands with cd

Agar Root Directory set nahi kar sakte, to commands mein `cd backend` add karein:

1. **Build Command:**
   ```
   cd backend && npm install
   ```

2. **Start Command:**
   ```
   cd backend && npm start
   ```

## 🔍 How to Verify Root Directory

### Check 1: Render Dashboard
- Go to: **Settings** → **General**
- Look for: **Root Directory**
- Should be: `backend` (exactly this, no slashes)

### Check 2: Build Logs
**Wrong (Error):**
```
==> Running build command 'npm install'...
npm error path /opt/render/project/src/package.json
```

**Correct (Success):**
```
==> Running build command 'npm install'...
> Installing dependencies...
> Found package.json in backend/
```

## 📝 Step-by-Step Fix

### Step 1: Go to Render Dashboard
1. Login to [Render Dashboard](https://dashboard.render.com/)
2. Select your service: `pujnam-store-backend`

### Step 2: Update Settings
1. Click **Settings** tab
2. Scroll to **General** section
3. Find **Root Directory** field
4. Enter: `backend`
5. Click **Save Changes**

### Step 3: Update Build Commands
1. Still in **Settings** tab
2. Scroll to **Build & Deploy** section
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Click **Save Changes**

### Step 4: Manual Deploy
1. Go to **Manual Deploy** section
2. Click **Clear build cache & deploy**
3. Wait for deployment

## 🎯 Correct Configuration

**Render Dashboard Settings:**

```
┌─────────────────────────────────────┐
│ General Settings:                   │
│                                     │
│ Name: pujnam-store-backend         │
│ Root Directory: backend  ← YEH!   │
│ Runtime: Node                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Build & Deploy:                     │
│                                     │
│ Build Command: npm install         │
│ Start Command: npm start            │
└─────────────────────────────────────┘
```

## ⚠️ Common Mistakes

### Mistake 1: Root Directory Empty
❌ **Wrong:** Root Directory = (empty)
✅ **Correct:** Root Directory = `backend`

### Mistake 2: Root Directory with Slash
❌ **Wrong:** Root Directory = `/backend` or `backend/`
✅ **Correct:** Root Directory = `backend`

### Mistake 3: Wrong Build Command Location
❌ **Wrong:** Build Command runs in root (can't find package.json)
✅ **Correct:** Root Directory set to `backend`, then `npm install` runs there

## 🔧 Alternative: If Root Directory Not Working

Agar Root Directory set nahi ho raha, to commands update karein:

**Build Command:**
```bash
cd backend && npm install
```

**Start Command:**
```bash
cd backend && npm start
```

## ✅ Verification

After fixing, build logs should show:
```
==> Running build command 'npm install'...
npm WARN deprecated...
added 123 packages in 5s
==> Build successful 🎉
```

## 📞 Still Having Issues?

1. **Delete and Recreate Service:**
   - Delete current service
   - Create new Web Service
   - Set Root Directory = `backend` from start

2. **Check Repository Structure:**
   - Verify `backend/package.json` exists in GitHub
   - Check: `https://github.com/Abhinavraj53/Pujnam-Store/tree/main/backend`

3. **Use render.yaml:**
   - Make sure `render.yaml` is in root of repository
   - Render will auto-detect it

## 🎯 Quick Fix Checklist

- [ ] Root Directory = `backend` (in Settings → General)
- [ ] Build Command = `npm install` (will run in backend folder)
- [ ] Start Command = `npm start` (will run in backend folder)
- [ ] Manual Deploy with "Clear build cache"
- [ ] Check build logs for success

Yeh fix karne ke baad deployment successful hoga!
