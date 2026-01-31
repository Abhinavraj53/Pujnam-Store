# Hostinger SMTP - Primary Email Service Setup

## ✅ Code Updated

Hostinger SMTP ab **primary email service** hai. Yeh pehle try hoga, phir Resend, phir Gmail.

## 📋 Step-by-Step Setup

### Step 1: Hostinger Email Account Create Karein

1. **Hostinger Control Panel** mein login karein
2. **Email** section mein jayein
3. **Email Accounts** par click karein
4. **Create Email Account** button par click karein
5. Email details:
   - **Email Address:** `info@pujnamstore.com`
   - **Password:** Strong password set karein (note karein)
   - **Mailbox Quota:** Default (ya apne hisab se)
6. **Create** button par click karein

### Step 2: SMTP Settings Note Karein

Hostinger SMTP settings:
- **SMTP Server:** `smtp.hostinger.com`
- **Port:** `465` (SSL) ya `587` (TLS)
- **Security:** SSL/TLS
- **Username:** Full email address (`info@pujnamstore.com`)
- **Password:** Email account password

### Step 3: Local `.env` File Update

Apni `backend/.env` file mein yeh add/update karein:

```env
# Hostinger SMTP Configuration (Primary)
HOSTINGER_EMAIL_USER=info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD=your_hostinger_email_password_here
HOSTINGER_SMTP_PORT=465

# Resend (Optional - Fallback)
# RESEND_API_KEY=re_AUpTzVaS_6ApwDaTbMJcBnPXZoAcy5246
# RESEND_FROM_EMAIL=info@pujnamstore.com

# Gmail (Optional - Fallback)
# EMAIL_USER=pujnamstore@gmail.com
# EMAIL_PASSWORD=your_gmail_app_password
```

### Step 4: Render Dashboard Environment Variables

**Important:** Render dashboard mein bhi add karna hoga:

1. Render dashboard → Your Service → **Environment** tab
2. **Add Environment Variable** button par click karein
3. Ye variables add karein:

```
HOSTINGER_EMAIL_USER = info@pujnamstore.com
HOSTINGER_EMAIL_PASSWORD = your_hostinger_email_password
HOSTINGER_SMTP_PORT = 465
```

4. **Save Changes** button par click karein
5. Service automatically restart hogi

### Step 5: Port Selection

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
- Use if port 465 blocked ho
- Also secure
- May work better on some networks

### Step 6: Test Email Sending

#### Local Test:
```bash
cd backend
npm run dev
```

Registration try karein aur logs check karein:
- `✅ Email sent via Hostinger SMTP to ...` - Success
- `❌ Hostinger SMTP error: ...` - Error (check password/credentials)

#### Render Test:
1. Deploy ke baad registration try karein
2. Render logs check karein
3. Email inbox check karein

## 🔍 Expected Logs (Success)

```
📧 Sending verification email to user@example.com
📧 Attempting to send email via Hostinger SMTP (port 465) to user@example.com
✅ Email sent via Hostinger SMTP to user@example.com abc123
✅ Verification email sent successfully to user@example.com
```

## ❌ Common Errors & Solutions

### Error 1: Connection Timeout
**Log:**
```
❌ Hostinger SMTP error: Connection timeout
```

**Solutions:**
1. Port 587 try karein:
   ```env
   HOSTINGER_SMTP_PORT=587
   ```
2. Check if Hostinger SMTP allowed on Render
3. Hostinger support se contact karein

### Error 2: Authentication Failed
**Log:**
```
❌ Hostinger SMTP error: Invalid login
❌ Hostinger SMTP error: Authentication failed
```

**Solutions:**
1. Email password verify karein
2. Full email address use karein (`info@pujnamstore.com`)
3. Check if email account active hai
4. Hostinger control panel mein password reset karein

### Error 3: Email Account Not Found
**Log:**
```
❌ Hostinger SMTP error: User not found
```

**Solutions:**
1. Email account create karein Hostinger mein
2. Email address correct hai verify karein
3. Account active hai check karein

## 🔒 Security Notes

- ✅ `.env` file `.gitignore` mein hai (GitHub par push nahi hogi)
- ⚠️ Render dashboard mein manually add karna hoga
- 🔐 Email password ko share mat karein
- 🔐 Password ko strong rakhein

## 📊 Email Service Priority (Updated)

1. **Hostinger SMTP** (Primary) - Agar `HOSTINGER_EMAIL_USER` set hai
2. **Resend** (Secondary) - Agar `RESEND_API_KEY` set hai
3. **Gmail SMTP** (Fallback) - Agar dono nahi hain

## ✅ Checklist

- [ ] Hostinger email account create (`info@pujnamstore.com`)
- [ ] Email password note karein
- [ ] Local `.env` file mein variables add karein
- [ ] Render dashboard mein environment variables add karein
- [ ] `HOSTINGER_SMTP_PORT` set karein (465 ya 587)
- [ ] Service restart karein (Render automatic restart karega)
- [ ] Test karein (local aur Render par)
- [ ] Logs check karein for success/errors

## 💡 Tips

1. **Port 465 pehle try karein** (most reliable)
2. **Agar timeout aaye**, port 587 try karein
3. **Password strong rakhein** (at least 12 characters)
4. **Logs regularly check karein** for any issues
5. **Hostinger support se contact karein** agar connection issues hain

## 🚀 Quick Start

1. Hostinger email account create karein
2. `.env` file mein credentials add karein
3. Render dashboard mein environment variables add karein
4. Test karein!

Ab Hostinger SMTP primary email service hai! 🎉
