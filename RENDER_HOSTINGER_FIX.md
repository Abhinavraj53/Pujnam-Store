# Hostinger SMTP Render Fix Guide

## 🔧 Issue: Hostinger Works on Localhost but Not on Render

Yeh common issue hai kyunki Render par network restrictions aur firewall settings different hote hain.

## ✅ Fixes Applied

### 1. Automatic Render Detection
Code ab automatically detect karta hai ki Render par run ho raha hai ya localhost par.

### 2. Optimized Port Selection
- **Render:** Port 587 (TLS) pehle try karta hai, phir 465 (SSL)
- **Localhost:** Port 465 (SSL) pehle try karta hai, phir 587 (TLS)

### 3. Increased Timeouts for Render
- Connection timeout: 30 seconds (Render), 20 seconds (localhost)
- Greeting timeout: 15 seconds (Render), 10 seconds (localhost)
- Socket timeout: 30 seconds (Render), 20 seconds (localhost)
- SendMail timeout: 35 seconds (Render), 25 seconds (localhost)

### 4. Better TLS Configuration
- TLS 1.2+ use karta hai (better compatibility)
- Different cipher support
- Pool disabled on Render (better reliability)

## 📋 Render Dashboard Setup

### Step 1: Environment Variables

Render dashboard → Environment tab mein yeh variables set karein:

```
HOSTINGER_EMAIL_USER = info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD = Abhinav@1234$
HOSTINGER_SMTP_PORT = 587
```

**Important:** Port 587 (TLS) use karein Render par - yeh zyada reliable hai.

### Step 2: Resend Backup (Recommended)

Agar Hostinger fail ho, Resend automatically use hoga:

```
RESEND_API_KEY = re_AUpTzVaS_6ApwDaTbMJcBnPXZoAcy5246
RESEND_FROM_EMAIL = onboarding@resend.dev
```

**Note:** `onboarding@resend.dev` use karein agar domain verify nahi hai.

### Step 3: Save and Deploy

1. Environment variables save karein
2. Service automatically restart hogi
3. Test karein

## 🔍 Troubleshooting

### Issue 1: Still Getting Connection Timeout

**Solution 1:** Port 587 verify karein
```env
HOSTINGER_SMTP_PORT = 587
```

**Solution 2:** Hostinger support se contact karein
- SMTP server access verify karein
- Firewall restrictions check karein
- Alternative SMTP settings puchhein

**Solution 3:** Resend use karein (temporary)
- Resend API key add karein
- Yeh automatically backup ke taur par use hoga

### Issue 2: Authentication Failed

**Check:**
1. Email password correct hai?
2. Full email address use ho raha hai? (`info@pujnamstore.com`)
3. Email account active hai?

**Solution:**
- Hostinger control panel mein password reset karein
- New password set karein
- Render dashboard mein update karein

### Issue 3: Port 587 Also Fails

**Solution:**
1. Hostinger support se contact karein
2. Alternative SMTP server puchhein
3. Resend use karein as primary (temporary)

## 📊 Expected Logs on Render

### Success:
```
🌐 Running on Render - using optimized SMTP settings
📧 Attempting to send email via Hostinger SMTP (port 587, secure: false) to user@example.com
✅ Email sent via Hostinger SMTP (port 587) to user@example.com abc123
```

### Failure (with fallback):
```
🌐 Running on Render - using optimized SMTP settings
📧 Attempting to send email via Hostinger SMTP (port 587, secure: false) to user@example.com
❌ Hostinger SMTP error (port 587): Connection timeout
🔄 Trying next port...
📧 Attempting to send email via Hostinger SMTP (port 465, secure: true) to user@example.com
❌ Hostinger SMTP error (port 465): Connection timeout
🔄 All Hostinger ports failed, falling back to Resend...
📧 Attempting to send email via Resend to user@example.com from onboarding@resend.dev
✅ Email sent via Resend to user@example.com abc123
```

## 💡 Recommendations

### Option 1: Use Resend as Primary (Recommended for Render)
Render par Resend zyada reliable hai. Agar Hostinger consistently fail ho raha hai:

1. Resend API key add karein
2. Resend ko primary bana dein (code change)
3. Hostinger ko backup rakhein

### Option 2: Contact Hostinger Support
Agar Hostinger use karna hai:
1. Support ticket create karein
2. Render IP ranges share karein
3. SMTP access verify karein
4. Alternative SMTP settings puchhein

### Option 3: Use Different Email Service
Alternatives:
- **SendGrid** - Free tier: 100 emails/day
- **Mailgun** - Free tier: 5,000 emails/month
- **AWS SES** - Pay as you go

## ✅ Quick Fix Checklist

- [ ] Render dashboard mein `HOSTINGER_SMTP_PORT = 587` set karein
- [ ] Resend API key add karein (backup ke liye)
- [ ] Service restart karein
- [ ] Test karein
- [ ] Logs check karein
- [ ] Agar phir bhi fail ho, Resend use karein

## 🚀 Current Status

- ✅ Code updated with Render optimizations
- ✅ Automatic Render detection
- ✅ Better timeout settings
- ✅ Multiple port retry logic
- ⏳ Render dashboard mein environment variables set karein
- ⏳ Test karein

Code ab Render par better kaam karega! 🎉
