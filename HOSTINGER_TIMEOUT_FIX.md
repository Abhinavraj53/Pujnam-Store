# Hostinger SMTP Connection Timeout Fix - Render

## ❌ Current Issue

**Error:** Connection timeout on both ports 587 and 465
```
❌ Hostinger SMTP error (port 465): Connection timeout
Error code: CONN
🔄 All Hostinger ports failed
```

## 🔍 Root Cause Analysis

### Why This Happens:

1. **Render Network Restrictions:**
   - Render par kuch SMTP ports block ho sakte hain
   - Outbound SMTP connections restrict ho sakti hain
   - Firewall rules SMTP traffic ko block kar sakte hain

2. **Hostinger SMTP Server Access:**
   - Hostinger SMTP server (`smtp.hostinger.com`) tak connection nahi ho pa raha
   - Network latency issues
   - Server-side firewall restrictions

3. **Port-Specific Issues:**
   - Port 587 (TLS): TLS handshake timeout
   - Port 465 (SSL): SSL connection timeout
   - Dono ports par connection establish nahi ho pa raha

## ✅ Fixes Applied

### 1. **Automatic Port Fallback**
- Ab code **dono ports automatically try karega**
- Configured port pehle try hoga
- Agar fail ho, automatically fallback port try hoga
- Example: Agar 587 set hai, to 587 → 465 try hoga

### 2. **Increased Timeouts**
- Connection timeout: **40 seconds** (pehle 30s)
- Greeting timeout: **20 seconds** (pehle 15s)
- Socket timeout: **40 seconds** (pehle 30s)
- SendMail timeout: **45 seconds** (pehle 35s)

### 3. **Better Error Handling**
- Detailed port attempt logging
- Better troubleshooting messages
- Clear indication of which ports were tried

## 📋 Code Changes

### Before:
```javascript
// Only tried configured port, no fallback
portsToTry = process.env.HOSTINGER_SMTP_PORT ? [parseInt(process.env.HOSTINGER_SMTP_PORT)] : [587, 465];
```

### After:
```javascript
// Try configured port first, then automatically try fallback
if (envPort) {
    portsToTry = envPort === 587 ? [587, 465] : [465, 587];
} else {
    portsToTry = [587, 465]; // Default for Render
}
```

## 🚀 Expected Behavior After Fix

### Logs Will Show:
```
🌐 [Render] Using Hostinger SMTP with optimized settings
📌 Configured port: 465, will try ports: 465 → 587
📧 Attempting to send email via Hostinger SMTP (port 465, secure: true) to user@example.com
❌ Hostinger SMTP error (port 465): Connection timeout
🔄 Port 465 failed, trying next port (587)...
📧 Attempting to send email via Hostinger SMTP (port 587, secure: false) to user@example.com
✅ Email sent via Hostinger SMTP (port 587) to user@example.com abc123
```

## 🔧 Render Dashboard Actions

### Step 1: Verify Environment Variables

Render dashboard → Environment tab mein check karein:

```
HOSTINGER_EMAIL_USER = info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD = your_password
HOSTINGER_SMTP_PORT = 465
```

### Step 2: Try Different Port

Agar 465 fail ho raha hai, 587 try karein:

```
HOSTINGER_SMTP_PORT = 587
```

Ya phir port variable remove karein (dono ports automatically try honge):

```
(Remove HOSTINGER_SMTP_PORT variable)
```

### Step 3: Verify Email Credentials

1. Hostinger control panel mein email account check karein
2. Password correct hai verify karein
3. Email account active hai check karein

## 🐛 If Still Failing

### Option 1: Contact Hostinger Support

1. Support ticket create karein
2. Render IP ranges share karein (Render support se puchhein)
3. SMTP access verify karein
4. Alternative SMTP settings puchhein

### Option 2: Check Hostinger Control Panel

1. Email account settings check karein
2. SMTP access enabled hai verify karein
3. Any IP restrictions check karein
4. Firewall rules check karein

### Option 3: Alternative Email Service

Agar Hostinger consistently fail ho raha hai:

1. **Resend** (Recommended):
   - Free tier: 3,000 emails/month
   - No connection timeouts
   - API-based (more reliable)

2. **SendGrid**:
   - Free tier: 100 emails/day
   - Reliable on Render

3. **Mailgun**:
   - Free tier: 5,000 emails/month
   - Good for transactional emails

## 📊 Current Code Behavior

### Port Selection Logic:

**Render:**
- If `HOSTINGER_SMTP_PORT=587`: Try 587 → 465
- If `HOSTINGER_SMTP_PORT=465`: Try 465 → 587
- If not set: Try 587 → 465 (default)

**Localhost:**
- If `HOSTINGER_SMTP_PORT=465`: Try 465 → 587
- If `HOSTINGER_SMTP_PORT=587`: Try 587 → 465
- If not set: Try 465 → 587 (default)

## ✅ Testing After Fix

1. **Deploy updated code** to Render
2. **Test registration** - try creating a new account
3. **Check logs** - should see both ports being tried
4. **Verify email** - check if email is received

## 📝 Important Notes

1. **Both ports will be tried automatically** - no need to change env variable
2. **Timeouts increased** - gives more time for connection
3. **Better logging** - easier to debug issues
4. **If both ports fail** - likely a network/firewall issue, not code issue

## 🎯 Quick Fix Checklist

- [x] Code updated with fallback port logic
- [x] Timeouts increased for Render
- [x] Better error messages
- [ ] Render dashboard mein environment variables verify karein
- [ ] Service restart karein
- [ ] Test registration
- [ ] Check logs for port attempts
- [ ] If still failing, contact Hostinger support

Code ab automatically dono ports try karega! 🚀
