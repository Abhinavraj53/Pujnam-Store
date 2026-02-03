# Hostinger SMTP Only Setup Guide

## ✅ Configuration: Hostinger SMTP Only

Ab aap **sirf Hostinger SMTP** use kar rahe hain. Resend completely remove kar diya gaya hai.

## 📋 Render Dashboard Setup

### Step 1: Environment Variables

Render dashboard → Environment tab mein yeh variables **zaroor** add karein:

```
HOSTINGER_EMAIL_USER = info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD = your_hostinger_email_password
HOSTINGER_SMTP_PORT = 587
```

### Step 2: Port Selection

**Port 587 (TLS) - Recommended for Render:**
```env
HOSTINGER_SMTP_PORT = 587
```
- Better compatibility on Render
- TLS encryption
- Recommended for production

**Port 465 (SSL) - Alternative:**
```env
HOSTINGER_SMTP_PORT = 465
```
- Use if port 587 doesn't work
- SSL encryption
- May have timeout issues on Render

### Step 3: Save and Deploy

1. Environment variables save karein
2. Service automatically restart hogi (wait 1-2 minutes)
3. Test registration

## 🔍 Expected Logs

### Success:
```
🔍 Environment Detection: { isRender: true, ... }
📋 Available Email Services: { hasHostingerUser: true, hasHostingerPass: true, ... }
🌐 [Render] Using Hostinger SMTP with optimized settings
📧 Attempting to send email via Hostinger SMTP (port 587, secure: false) to user@example.com
✅ Email sent via Hostinger SMTP (port 587) to user@example.com abc123
```

### Failure (with fallback):
```
📧 Attempting to send email via Hostinger SMTP (port 587, secure: false) to user@example.com
❌ Hostinger SMTP error (port 587): Connection timeout
🔄 Trying next port...
📧 Attempting to send email via Hostinger SMTP (port 465, secure: true) to user@example.com
❌ Hostinger SMTP error (port 465): Connection timeout
🔄 All Hostinger ports failed, falling back to Gmail SMTP...
📧 [Render] Attempting to send email via Gmail SMTP to user@example.com
✅ Email sent via Gmail SMTP to user@example.com abc123
```

## 🐛 Troubleshooting

### Issue 1: Connection Timeout

**Symptoms:**
- `❌ Hostinger SMTP error: Connection timeout`
- `❌ Hostinger SMTP error: ETIMEDOUT`

**Solutions:**

1. **Port 587 try karein:**
   ```env
   HOSTINGER_SMTP_PORT = 587
   ```

2. **Port 465 try karein:**
   ```env
   HOSTINGER_SMTP_PORT = 465
   ```

3. **Hostinger support se contact:**
   - SMTP server access verify karein
   - Firewall restrictions check karein
   - Alternative SMTP settings puchhein

4. **Gmail as temporary backup:**
   ```env
   EMAIL_USER = your_gmail@gmail.com
   EMAIL_PASSWORD = your_gmail_app_password
   ```

### Issue 2: Authentication Failed

**Symptoms:**
- `❌ Hostinger SMTP error: Invalid login`
- `❌ Hostinger SMTP error: Authentication failed`

**Solutions:**

1. Email password verify karein
2. Full email address use karein (`info@pujnamstore.com`)
3. Check if email account active hai
4. Hostinger control panel mein password reset karein

### Issue 3: Port Blocked

**Symptoms:**
- Both ports 587 and 465 fail
- Connection refused errors

**Solutions:**

1. Hostinger support se contact karein
2. Alternative SMTP ports puchhein
3. Gmail SMTP use karein as backup

## 📊 Email Service Priority

1. **Hostinger SMTP** (Primary) - Port 587 (TLS) or 465 (SSL)
2. **Gmail SMTP** (Fallback) - Only if Hostinger fails

## ✅ Verification

### Check Diagnostic Endpoint:
```
GET https://pujnam-store.onrender.com/api/diagnostics/email
```

Should show:
```json
{
  "emailServices": {
    "hostinger": {
      "configured": true,
      "hasUser": true,
      "hasPassword": true,
      "port": "587"
    },
    "gmail": {
      "configured": true,
      "hasUser": true,
      "hasPassword": true
    }
  },
  "recommendedService": "Hostinger SMTP (Primary)"
}
```

## 🔒 Security Notes

- ✅ `.env` file `.gitignore` mein hai
- ⚠️ Render dashboard mein manually add karna hoga
- 🔐 Email password ko share mat karein
- 🔐 Password ko strong rakhein

## 📝 Complete Environment Variables

### Required:
```
HOSTINGER_EMAIL_USER = info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD = your_password
HOSTINGER_SMTP_PORT = 587
```

### Optional (Backup):
```
EMAIL_USER = your_gmail@gmail.com
EMAIL_PASSWORD = your_gmail_app_password
```

### Other Required:
```
MONGODB_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret
```

## 🎯 Quick Setup Checklist

- [ ] Render dashboard → Environment tab
- [ ] `HOSTINGER_EMAIL_USER` add karein
- [ ] `HOSTINGER_EMAIL_PASSWORD` add karein
- [ ] `HOSTINGER_SMTP_PORT = 587` set karein
- [ ] Save changes
- [ ] Service restart wait karein (1-2 minutes)
- [ ] Diagnostic endpoint check karein: `/api/diagnostics/email`
- [ ] Registration test karein
- [ ] Logs verify karein

## 💡 Tips for Render

1. **Port 587 (TLS) is better** on Render than 465 (SSL)
2. **Timeouts are increased** for Render (30s connection, 15s greeting)
3. **Multiple ports tried automatically** if one fails
4. **Gmail backup** available if Hostinger completely fails

## 🚀 Current Status

- ✅ Resend completely removed
- ✅ Hostinger SMTP is primary (only) service
- ✅ Gmail SMTP as fallback
- ✅ Better error messages
- ✅ Render-optimized settings
- ⏳ Render dashboard mein environment variables set karein
- ⏳ Test karein

Code ab **sirf Hostinger** use karega! 🎉
