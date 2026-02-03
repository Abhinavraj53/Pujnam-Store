# Resend Email Service Setup

## ✅ Configuration Added

Resend API key aur email address `.env` file mein add kar diya gaya hai:

```
RESEND_API_KEY=re_AUpTzVaS_6ApwDaTbMJcBnPXZoAcy5246
RESEND_FROM_EMAIL=info@pujnamstore.com
```

## 📋 Render Deployment Steps

### 1. Render Dashboard mein Environment Variables add karein:

1. Render dashboard mein apni service par jayein
2. **Environment** tab par click karein
3. **Add Environment Variable** button par click karein
4. Ye variables add karein:

```
RESEND_API_KEY = re_AUpTzVaS_6ApwDaTbMJcBnPXZoAcy5246
RESEND_FROM_EMAIL = info@pujnamstore.com
```

### 2. Domain Verification (Optional but Recommended)

Agar `info@pujnamstore.com` domain verify karna hai:

1. Resend dashboard mein jayein: https://resend.com/domains
2. Apna domain add karein: `pujnamstore.com`
3. DNS records add karein (Resend instructions follow karein)
4. Domain verify hone ke baad, emails `info@pujnamstore.com` se send hongi

### 3. Test Email Sending

Deploy ke baad:
1. Registration try karein
2. OTP email check karein
3. Logs mein dekhein: `✅ Email sent via Resend to ...`

## 🔒 Security Notes

- ✅ `.env` file `.gitignore` mein hai (GitHub par push nahi hogi)
- ⚠️ Render dashboard mein manually add karna hoga
- 🔐 API key ko share mat karein

## 📧 Email Service Priority

1. **Resend** (Primary) - Agar `RESEND_API_KEY` set hai
2. **Gmail SMTP** (Fallback) - Agar Resend fail ho ya API key nahi ho

## ✅ Benefits

- ✅ No connection timeouts
- ✅ Fast email delivery
- ✅ Free tier: 3,000 emails/month
- ✅ Reliable on Render
