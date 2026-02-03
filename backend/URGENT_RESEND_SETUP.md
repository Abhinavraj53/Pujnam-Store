# 🚨 URGENT: Resend API Key Setup for Render

## ❌ Current Issue

All email services are failing on Render because:
- ❌ `RESEND_API_KEY` is **NOT SET** in Render dashboard
- ❌ Hostinger SMTP is timing out
- ❌ Gmail SMTP is timing out

## ✅ IMMEDIATE FIX

### Step 1: Go to Render Dashboard

1. Login to [Render Dashboard](https://dashboard.render.com/)
2. Click on your service: `pujnam-store-backend`
3. Go to **Environment** tab

### Step 2: Add Resend Environment Variables

Click **"Add Environment Variable"** and add these **TWO** variables:

#### Variable 1: RESEND_API_KEY
```
Key: RESEND_API_KEY
Value: re_AUpTzVaS_6ApwDaTbMJcBnPXZoAcy5246
```

#### Variable 2: RESEND_FROM_EMAIL
```
Key: RESEND_FROM_EMAIL
Value: onboarding@resend.dev
```

### Step 3: Save and Wait

1. Click **"Save Changes"**
2. Service will automatically restart (wait 1-2 minutes)
3. Test registration again

## ✅ Expected Result

After adding Resend API key, logs should show:

```
🔍 Environment Detection: { isRender: true, ... }
📋 Available Email Services: { hasResendKey: true, ... }
📧 [Render] Attempting to send email via Resend to user@example.com from onboarding@resend.dev
✅ [Render] Email sent via Resend to user@example.com abc123
```

## 📋 Complete Environment Variables Checklist

Make sure these are set in Render dashboard:

### Required for Email:
- [x] `RESEND_API_KEY` = `re_AUpTzVaS_6ApwDaTbMJcBnPXZoAcy5246`
- [x] `RESEND_FROM_EMAIL` = `onboarding@resend.dev`

### Optional (Backup):
- [ ] `HOSTINGER_EMAIL_USER` = `info@pujnamstore.com`
- [ ] `HOSTINGER_EMAIL_PASSWORD` = `your_password`
- [ ] `HOSTINGER_SMTP_PORT` = `587`

### Other Required:
- [x] `MONGODB_URI` = `your_mongodb_connection_string`
- [x] `JWT_SECRET` = `your_jwt_secret`

## 🔍 Verification

### Check Diagnostic Endpoint:
```
GET https://pujnam-store.onrender.com/api/diagnostics/email
```

Should show:
```json
{
  "emailServices": {
    "resend": {
      "configured": true,
      "hasApiKey": true,
      "hasFromEmail": true,
      "fromEmail": "onboarding@resend.dev"
    }
  }
}
```

## ⚠️ Important Notes

1. **No Spaces:** `RESEND_API_KEY=re_ABC123` (not `RESEND_API_KEY = re_ABC123`)
2. **Case Sensitive:** `RESEND_API_KEY` (not `resend_api_key`)
3. **Service Restart:** Wait 1-2 minutes after adding variables
4. **Test:** Try registration after restart

## 🎯 Why Resend?

- ✅ **Most Reliable** on Render (no timeouts)
- ✅ **Fast Delivery** (API-based, not SMTP)
- ✅ **Free Tier:** 3,000 emails/month
- ✅ **No Connection Issues** (unlike SMTP)

## 📞 Still Having Issues?

1. Check Render logs for detailed error messages
2. Verify API key is correct (no extra spaces)
3. Check diagnostic endpoint: `/api/diagnostics/email`
4. Make sure service restarted after adding variables

## ✅ Quick Copy-Paste

Render Dashboard → Environment → Add these:

```
RESEND_API_KEY
re_AUpTzVaS_6ApwDaTbMJcBnPXZoAcy5246

RESEND_FROM_EMAIL
onboarding@resend.dev
```

**That's it!** Save and test. 🚀
