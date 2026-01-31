# Hostinger SMTP Setup Guide

## ✅ Code Implementation Complete

Hostinger SMTP support add kar diya gaya hai. Ab aap Resend, Hostinger, ya Gmail SMTP use kar sakte hain.

## 📋 Email Service Priority

1. **Resend** (Primary) - Agar `RESEND_API_KEY` set hai
2. **Hostinger SMTP** (Secondary) - Agar `HOSTINGER_EMAIL_USER` set hai
3. **Gmail SMTP** (Fallback) - Agar dono nahi hain

## 🔧 Environment Variables Setup

### Local `.env` File

Apni `backend/.env` file mein yeh add karein:

```env
# Resend Configuration (Optional - Primary)
RESEND_API_KEY=re_AUpTzVaS_6ApwDaTbMJcBnPXZoAcy5246
RESEND_FROM_EMAIL=info@pujnamstore.com

# Hostinger SMTP Configuration (Optional - Secondary)
HOSTINGER_EMAIL_USER=info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD=your_hostinger_email_password
HOSTINGER_SMTP_PORT=465  # 465 for SSL (default) or 587 for TLS

# Gmail SMTP Configuration (Optional - Fallback)
EMAIL_USER=pujnamstore@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

### Render Dashboard Environment Variables

Render dashboard mein bhi same variables add karein:

1. Render dashboard → Your Service → **Environment** tab
2. **Add Environment Variable** button par click karein
3. Ye variables add karein:

```
HOSTINGER_EMAIL_USER = info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD = your_hostinger_email_password
HOSTINGER_SMTP_PORT = 465
```

## 🏗️ Hostinger Email Account Setup

### Step 1: Create Email Account in Hostinger

1. Hostinger control panel mein login karein
2. **Email** section mein jayein
3. **Email Accounts** par click karein
4. **Create Email Account** button par click karein
5. Email address: `info@pujnamstore.com`
6. Strong password set karein
7. Account create karein

### Step 2: Get SMTP Settings

Hostinger SMTP settings:
- **SMTP Server:** `smtp.hostinger.com`
- **Port:** `465` (SSL) ya `587` (TLS)
- **Security:** SSL/TLS
- **Username:** Full email address (`info@pujnamstore.com`)
- **Password:** Email account password

### Step 3: Test SMTP Connection

Local test karne ke liye:
```bash
cd backend
npm run dev
```

Registration try karein aur logs check karein:
- `✅ Email sent via Hostinger SMTP to ...` - Success
- `❌ Hostinger SMTP error: ...` - Error (check password/credentials)

## ⚙️ Configuration Options

### Port Selection

**Port 465 (SSL) - Recommended:**
```env
HOSTINGER_SMTP_PORT=465
```
- More secure
- Better for production
- Default option

**Port 587 (TLS) - Alternative:**
```env
HOSTINGER_SMTP_PORT=587
```
- Use if port 465 blocked
- Also secure
- May work better on some networks

### Which Service to Use?

**Resend (Recommended):**
- ✅ Most reliable on Render
- ✅ No connection timeouts
- ✅ Fast delivery
- ✅ Free tier: 3,000 emails/month
- ✅ Already configured

**Hostinger SMTP:**
- ✅ Use your own domain email
- ✅ Professional email address
- ⚠️ May have timeout issues on Render (like Gmail)
- ⚠️ Daily sending limits
- ⚠️ Less optimized for transactional emails

**Gmail SMTP:**
- ✅ Free
- ❌ Blocked on Render (timeout issues)
- ❌ Not recommended for production

## 🧪 Testing

1. **Local Test:**
   ```bash
   cd backend
   npm run dev
   ```
   Registration try karein aur email check karein

2. **Render Test:**
   - Deploy ke baad registration try karein
   - Logs check karein for email sending status

3. **Check Logs:**
   - `✅ Email sent via Hostinger SMTP` - Success
   - `❌ Hostinger SMTP error` - Check credentials

## 🔒 Security Notes

- ✅ `.env` file `.gitignore` mein hai (GitHub par push nahi hogi)
- ⚠️ Render dashboard mein manually add karna hoga
- 🔐 Email password ko share mat karein
- 🔐 API keys ko secure rakhein

## 📝 Troubleshooting

### Issue: Connection Timeout
- **Solution:** Port 587 try karein instead of 465
- **Solution:** Check if Hostinger SMTP allowed on Render

### Issue: Authentication Failed
- **Solution:** Verify email password correct hai
- **Solution:** Check email account active hai

### Issue: Emails Not Sending
- **Solution:** Check logs for specific error
- **Solution:** Try Resend instead (more reliable)

## ✅ Next Steps

1. ✅ Code implementation complete
2. ⏳ Hostinger email account create karein
3. ⏳ `.env` file mein credentials add karein
4. ⏳ Render dashboard mein environment variables add karein
5. ⏳ Test karein (local aur Render par)

## 💡 Recommendation

**Resend use karein** kyunki:
- Already configured hai
- Render par reliable hai
- Transactional emails ke liye optimized hai

Hostinger use karein agar:
- Apna domain email use karna hai
- Resend fail ho raha hai
- Professional email address chahiye
