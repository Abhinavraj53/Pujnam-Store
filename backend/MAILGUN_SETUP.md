# Mailgun Email Service Setup Guide

## ✅ Code Implementation Complete

Mailgun ab **primary email service** hai. Yeh pehle try hoga, phir Hostinger SMTP (fallback).

## 📋 Why Mailgun?

- ✅ **API-based** - No SMTP connection issues
- ✅ **Reliable on Render** - No timeout problems
- ✅ **Fast delivery** - Instant email sending
- ✅ **Free tier** - 5,000 emails/month free
- ✅ **No port configuration** - Simple API calls

## 🔧 Environment Variables Setup

### Step 1: Update `backend/.env` File

Apni `backend/.env` file mein yeh add/update karein:

```env
# Mailgun Configuration (Primary)
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_domain_here
MAILGUN_BASE_URL=https://api.mailgun.net
```

### Step 2: Render Dashboard Environment Variables

Render dashboard → Environment tab mein yeh variables add karein:

```
MAILGUN_API_KEY = your_mailgun_api_key_here
MAILGUN_DOMAIN = your_domain_here
MAILGUN_BASE_URL = https://api.mailgun.net
```

**Note:** Agar aapka domain EU region mein hai, to:
```
MAILGUN_BASE_URL = https://api.eu.mailgun.net
```

## 🧪 Testing on Localhost

### Option 1: Test Script (Recommended)

```bash
cd backend
node test-mailgun.js
```

### Option 2: Test via Registration

1. Backend start karein: `npm run dev`
2. Frontend start karein: `npm run dev`
3. Registration page par jayein
4. New account create karein
5. Email check karein (inbox aur spam folder)

## 📧 Mailgun Sandbox Domain

**Important:** Sandbox domain se sirf **verified recipients** ko email bhej sakte hain.

### Add Verified Recipients:

1. Mailgun dashboard mein login karein
2. **Sending** → **Domain Settings** → **Authorized Recipients**
3. **Add Recipient** button par click karein
4. Email address add karein (e.g., `info@pujnamstore.com`)
5. Verification email check karein aur verify karein

### Production Domain Setup (Optional):

Agar production domain use karna hai:

1. Mailgun dashboard → **Sending** → **Domains**
2. **Add New Domain** button par click karein
3. Domain add karein (e.g., `pujnamstore.com`)
4. DNS records add karein (Mailgun instructions follow karein)
5. Domain verify karein
6. `.env` file mein domain update karein:
   ```env
   MAILGUN_DOMAIN=pujnamstore.com
   ```

## 🔍 Expected Logs

### Success:
```
🔍 Environment Detection: { isRender: false, ... }
📋 Available Email Services: { hasMailgunKey: true, hasMailgunDomain: true, ... }
📧 Attempting to send email via Mailgun to user@example.com from postmaster@sandbox...
✅ Email sent via Mailgun to user@example.com abc123
```

### Failure (with fallback):
```
📧 Attempting to send email via Mailgun to user@example.com
❌ Mailgun error: Invalid API key
🔄 Falling back to Hostinger SMTP...
📧 Attempting to send email via Hostinger SMTP (port 465, secure: true) to user@example.com
✅ Email sent via Hostinger SMTP (port 465) to user@example.com abc123
```

## 🐛 Troubleshooting

### Issue 1: "Invalid API key"

**Solution:**
- Mailgun dashboard se API key verify karein
- `.env` file mein correct API key check karein
- Render dashboard mein bhi verify karein

### Issue 2: "Domain not found"

**Solution:**
- Mailgun dashboard mein domain verify karein
- `.env` file mein correct domain check karein
- Sandbox domain use kar rahe hain to format: `sandbox...mailgun.org`

### Issue 3: "Forbidden - Recipient not authorized"

**Solution:**
- Sandbox domain use kar rahe hain to recipient ko verify karna hoga
- Mailgun dashboard → **Authorized Recipients** mein add karein
- Ya production domain setup karein

### Issue 4: Email not received

**Solution:**
- Spam folder check karein
- Mailgun dashboard → **Logs** mein email status check karein
- Recipient verified hai ya nahi check karein (sandbox domain ke liye)

## 📊 Mailgun Dashboard

Mailgun dashboard se:
- Email logs dekh sakte hain
- Delivery status check kar sakte hain
- API usage monitor kar sakte hain
- Domain settings manage kar sakte hain

## 🚀 Next Steps

1. ✅ Local `.env` file update karein
2. ✅ Test script run karein: `node test-mailgun.js`
3. ✅ Registration test karein
4. ✅ Render dashboard mein environment variables add karein
5. ✅ Production domain setup karein (optional)

## 📝 Notes

- Mailgun API-based hai, isliye SMTP connection issues nahi honge
- Render par bhi reliable hai (no timeout issues)
- Sandbox domain se sirf verified recipients ko email bhej sakte hain
- Production domain setup karein for unlimited recipients
