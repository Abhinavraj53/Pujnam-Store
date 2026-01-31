# Email Sending Troubleshooting Guide

## ❌ Error: "Failed to send verification email. Please try again."

Agar yeh error aa raha hai, to yeh steps follow karein:

### Step 1: Check Server Logs

Render dashboard mein logs check karein. Aapko dikhna chahiye:

```
📧 Attempting to send email via Resend to user@example.com
❌ Resend error: ...
🔄 Falling back to Hostinger SMTP...
```

Ya phir:

```
⚠️ RESEND_API_KEY not set, skipping Resend
⚠️ HOSTINGER_EMAIL_USER not set, skipping Hostinger SMTP
❌ All email services failed...
```

### Step 2: Verify Environment Variables

Render dashboard → Environment tab mein check karein:

#### Option A: Resend (Recommended)
```
RESEND_API_KEY = re_AUpTzVaS_6ApwDaTbMJcBnPXZoAcy5246
RESEND_FROM_EMAIL = info@pujnamstore.com
```

#### Option B: Hostinger SMTP
```
HOSTINGER_EMAIL_USER = info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD = your_password
HOSTINGER_SMTP_PORT = 465
```

#### Option C: Gmail SMTP (Fallback)
```
EMAIL_USER = pujnamstore@gmail.com
EMAIL_PASSWORD = your_app_password
```

### Step 3: Common Issues & Solutions

#### Issue 1: RESEND_API_KEY Invalid
**Symptoms:**
- `❌ Resend error: Invalid API key`
- `❌ Resend error: Unauthorized`

**Solution:**
1. Resend dashboard mein jayein: https://resend.com/api-keys
2. API key verify karein
3. Render dashboard mein correct API key set karein
4. Service restart karein

#### Issue 2: Resend Domain Not Verified
**Symptoms:**
- `❌ Resend error: Domain not verified`
- `❌ Resend error: Invalid from address`

**Solution:**
1. Resend dashboard → Domains
2. `pujnamstore.com` domain add karein
3. DNS records add karein (Resend instructions follow karein)
4. Domain verify hone tak `onboarding@resend.dev` use karein

#### Issue 3: Hostinger SMTP Connection Failed
**Symptoms:**
- `❌ Hostinger SMTP error: Connection timeout`
- `❌ Hostinger SMTP error: Authentication failed`

**Solution:**
1. Hostinger email account password verify karein
2. Port 587 try karein (agar 465 fail ho):
   ```
   HOSTINGER_SMTP_PORT = 587
   ```
3. Check if email account active hai
4. Hostinger support se contact karein

#### Issue 4: All Services Failed
**Symptoms:**
- `❌ All email services failed`
- No email service configured

**Solution:**
1. At least ek email service configure karein:
   - Resend (recommended)
   - Hostinger SMTP
   - Gmail SMTP
2. Environment variables properly set karein
3. Service restart karein

### Step 4: Test Email Service

Local test karne ke liye:

```bash
cd backend
node -e "
const { sendEmail } = require('./utils/emailService');
sendEmail({
  to: 'your-email@example.com',
  subject: 'Test Email',
  html: '<h1>Test</h1>'
}).then(() => console.log('✅ Success')).catch(err => console.error('❌ Error:', err));
"
```

### Step 5: Check Render Logs

Render dashboard → Logs section mein dekhein:

1. **Email service attempt logs:**
   - `📧 Attempting to send email via Resend...`
   - `✅ Email sent via Resend...`
   - `❌ Resend error: ...`

2. **Environment variables check:**
   - `Available env vars: { hasResendKey: true, ... }`

3. **Error details:**
   - Full error stack trace
   - Which service failed and why

### Step 6: Quick Fixes

#### Fix 1: Use Resend (Easiest)
```env
RESEND_API_KEY=re_AUpTzVaS_6ApwDaTbMJcBnPXZoAcy5246
RESEND_FROM_EMAIL=onboarding@resend.dev
```
(Pehle domain verify karein, phir `info@pujnamstore.com` use karein)

#### Fix 2: Use Hostinger
```env
HOSTINGER_EMAIL_USER=info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD=your_password
HOSTINGER_SMTP_PORT=465
```

#### Fix 3: Verify Resend API Key
1. Resend dashboard → API Keys
2. API key verify karein
3. Render mein correct key set karein
4. Service restart karein

### Step 7: Debug Mode

Agar detailed logs chahiye, temporarily add karein:

```javascript
// In emailService.js, add at the top:
console.log('Email Service Config:', {
  hasResend: !!process.env.RESEND_API_KEY,
  hasHostinger: !!process.env.HOSTINGER_EMAIL_USER,
  hasGmail: !!process.env.EMAIL_USER,
  resendKey: process.env.RESEND_API_KEY ? 'Set' : 'Not set'
});
```

## ✅ Expected Logs (Success)

```
📧 Sending verification email to user@example.com
📧 Attempting to send email via Resend to user@example.com from info@pujnamstore.com
✅ Email sent via Resend to user@example.com abc123
✅ Verification email sent successfully to user@example.com
```

## ❌ Error Logs (Failure)

```
📧 Sending verification email to user@example.com
📧 Attempting to send email via Resend to user@example.com
❌ Resend error: Invalid API key
🔄 Falling back to Hostinger SMTP...
⚠️ HOSTINGER_EMAIL_USER not set, skipping Hostinger SMTP
⚠️ EMAIL_USER not set, skipping Gmail SMTP
❌ All email services failed. Check RESEND_API_KEY, HOSTINGER_EMAIL_USER, or EMAIL_USER/EMAIL_PASSWORD
❌ Failed to send verification email to user@example.com: All email services failed...
```

## 🔧 Quick Checklist

- [ ] At least ek email service configured hai
- [ ] Environment variables Render dashboard mein set hain
- [ ] API keys/credentials correct hain
- [ ] Service restart kiya hai
- [ ] Logs check kiye hain
- [ ] Domain verified hai (Resend ke liye)

## 💡 Recommendation

**Resend use karein** kyunki:
- ✅ Most reliable on Render
- ✅ No connection timeouts
- ✅ Fast delivery
- ✅ Already configured with your API key

Agar Resend fail ho raha hai:
1. API key verify karein
2. Domain verify karein (optional)
3. `onboarding@resend.dev` use karein temporarily
