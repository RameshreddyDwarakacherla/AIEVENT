# Google OAuth Setup - Updated Credentials

## ✅ Credentials Updated

Your new Google OAuth credentials have been configured:

**Client ID:** `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
**Client Secret:** `YOUR_GOOGLE_CLIENT_SECRET`

## 🎯 IMPORTANT: Configure Google Cloud Console

You MUST add these URIs to your NEW OAuth Client in Google Cloud Console:

### Step 1: Go to Google Cloud Console
https://console.cloud.google.com/apis/credentials

### Step 2: Find Your OAuth Client
Look for your OAuth 2.0 Client ID in the credentials list

### Step 3: Add These URIs

**Authorized JavaScript origins:**
```
http://localhost:5173
http://127.0.0.1:5173
```

**Authorized redirect URIs:**
```
http://localhost:5173
http://localhost:5173/
http://127.0.0.1:5173
http://127.0.0.1:5173/
```

### Step 4: Save and Wait
1. Click **SAVE**
2. **Wait 5-10 minutes** for Google to propagate changes

## 🧪 Test the Setup

### Method 1: Test Page
1. Restart your servers (important after .env changes!)
   ```bash
   # Stop both servers (Ctrl+C)
   
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. Open incognito window
3. Go to: http://localhost:5173/test-google
4. Click "Test Google Login"
5. Should show your Google account info

### Method 2: Real Login
1. Go to: http://localhost:5173/login
2. Click "Continue with Google"
3. Select your Google account
4. Should redirect to dashboard

## 📋 Verification Checklist

- [ ] Updated frontend/.env with new Client ID
- [ ] Updated backend/.env with new Client ID and Secret
- [ ] Added URIs to Google Cloud Console
- [ ] Clicked SAVE in Google Cloud Console
- [ ] Waited 5-10 minutes
- [ ] Restarted backend server
- [ ] Restarted frontend server
- [ ] Tested in incognito window
- [ ] Google login works!

## 🔧 Files Updated

1. ✅ `backend/.env` - New Client ID and Secret
2. ✅ `frontend/.env` - New Client ID

## ⚠️ Important Notes

1. **Restart Servers:** You MUST restart both servers after changing .env files
2. **Wait Time:** Google needs 5-10 minutes to update their servers
3. **Incognito:** Always test in incognito window to avoid cache issues
4. **URIs:** Make sure you add URIs to the CORRECT OAuth client (the new one)

## 🎉 Success Indicators

When it works, you'll see:
- ✅ Google popup opens
- ✅ You can select your account
- ✅ Popup closes automatically
- ✅ "Successfully logged in with Google!" toast message
- ✅ Redirected to dashboard

## 🆘 Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure you added URIs to your OAuth client in Google Cloud Console
- Wait longer (up to 15 minutes)
- Try adding more URI variations

### Error: "Invalid client"
- Restart both servers
- Clear browser cache
- Check that Client ID matches in both .env files

### Popup doesn't open
- Check popup blocker
- Try incognito window
- Check browser console (F12) for errors

## 🚀 Quick Start Commands

```bash
# Verify configuration
node check-google-oauth.js

# Restart backend
cd backend
npm start

# Restart frontend (new terminal)
cd frontend
npm run dev

# Test
# Open: http://localhost:5173/test-google
```

## 📞 Next Steps

1. ✅ Credentials updated in code
2. ⏳ Add URIs to Google Cloud Console
3. ⏳ Wait 5-10 minutes
4. ⏳ Restart servers
5. ⏳ Test at /test-google
6. ⏳ Use real login page

**You're almost there! Just add the URIs and wait!** 🎯
