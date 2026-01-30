# Deploying Backend to Render

## Prerequisites
- GitHub repository with backend code
- MongoDB Atlas account (or MongoDB connection string)
- Gmail account for email functionality (optional)

## Step-by-Step Deployment

### 1. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository: `Pujnam-Store`

### 2. Configure the Service

**Basic Settings:**
- **Name:** `pujnam-store-backend` (or any name you prefer)
- **Region:** Choose closest to your users
- **Branch:** `main` (or your main branch)
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Environment Variables:**
Add these in the Render dashboard under "Environment":

```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key-here-make-it-long-and-random
PORT=10000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FREE_ASTROLOGY_API_KEY=your-astrology-api-key (optional)
```

**Important Notes:**
- `PORT` is automatically set by Render, but you can set it explicitly
- `MONGODB_URI` should be your MongoDB Atlas connection string
- `JWT_SECRET` should be a long, random string for security
- For Gmail, enable 2FA and create an App Password

### 3. MongoDB Atlas Configuration

1. Go to MongoDB Atlas Dashboard
2. Click **"Network Access"**
3. Add IP Address: `0.0.0.0/0` (allows all IPs - required for Render)
4. Or add Render's IP ranges if you prefer

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start your server
3. Wait for deployment to complete (usually 2-5 minutes)

### 5. Get Your Backend URL

After deployment, Render will provide a URL like:
- `https://pujnam-store-backend.onrender.com`

This is your backend API URL. Use it in your frontend:
```
VITE_API_URL=https://pujnam-store-backend.onrender.com/api
```

## Testing the Deployment

1. **Health Check:**
   ```
   https://your-backend-url.onrender.com/api/health
   ```
   Should return: `{"status":"ok","message":"Pujnam Store API is running"}`

2. **Test Products Endpoint:**
   ```
   https://your-backend-url.onrender.com/api/products
   ```

## Troubleshooting

### Port Binding Error
✅ **Fixed!** The server now binds to `0.0.0.0` automatically.

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check `MONGODB_URI` environment variable is correct
- Ensure MongoDB Atlas cluster is running

### CORS Issues
- Backend CORS is configured to allow:
  - `https://*.onrender.com`
  - `https://*.vercel.app`
  - `https://*.netlify.app`
  - Localhost for development

### Email Not Working
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set
- For Gmail: Enable 2FA and use App Password (not regular password)
- Check Render logs for email errors

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens |
| `PORT` | Auto | Port number (set by Render) |
| `EMAIL_USER` | Optional | Gmail address for emails |
| `EMAIL_PASSWORD` | Optional | Gmail app password |
| `FREE_ASTROLOGY_API_KEY` | Optional | API key for Panchang feature |

## Render Service Settings Summary

```
Name: pujnam-store-backend
Root Directory: backend
Build Command: npm install
Start Command: npm start
Plan: Free (or paid)
```

## Next Steps

After backend is deployed:
1. Update frontend `.env` with backend URL
2. Rebuild frontend
3. Deploy frontend to Render/Vercel/Netlify
4. Test the full application
