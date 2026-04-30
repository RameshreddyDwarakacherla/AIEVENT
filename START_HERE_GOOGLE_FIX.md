# 🚀 START HERE - Google OAuth Fix

## ✅ Your Configuration is CORRECT!

I've checked everything and your code is properly configured:
- ✅ Frontend has correct Google Client ID
- ✅ Backend has correct Google Client Secret  
- ✅ @react-oauth/google library is installed
- ✅ All code is properly implemented

## ⚠️ THE ONLY ISSUE: Google Cloud Console URIs

The `redirect_uri_mismatch` error means you need to add URIs in Google Cloud Console.

## 🎯 DO THIS NOW (Takes 2 Minutes)

### 1. Open Google Cloud Console
Go to: https://console.cloud.google.com/apis/credentials

### 2. Find Your OAuth Client
Look for your OAuth 2.0 Client ID in the credentials list

### 3. Click the Edit Icon (Pencil)

### 4. Add These URIs

**In "Authorized JavaScript origins" section, add:**
```
http://localhost:5173
```

**In "Authorized redirect URIs" section, add:**
```
http://localhost:5173
```

### 5. Click SAVE

### 6. WAIT 5-10 MINUTES ⏰
Google needs time to update their servers. This is IMPORTANT!

## 🧪 Test It

### Option 1: Use Test Page (Recommended)
1. Open incognito window: `Ctrl+Shift+N` (Chrome) or `Ctrl+Shift+P` (Firefox)
2. Go to: http://localhost:5173/test-google
3. Click "Test Google Login"
4. You should see your Google account info

### Option 2: Use Real Login Page
1. Go to: http://localhost:5173/login
2. Click "Continue with Google"
3. Select your Google account
4. Should redirect to dashboard

## 📸 What It Should Look Like

In Google Cloud Console, after adding URIs:

```
┌─────────────────────────────────────────────────┐
│ Authorized JavaScript origins                   │
├─────────────────────────────────────────────────┤
│ http://localhost:5173                      [X]  │
│ [+ ADD URI]                                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Authorized redirect URIs                        │
├─────────────────────────────────────────────────┤
│ http://localhost:5173                      [X]  │
│ [+ ADD URI]                                     │
└─────────────────────────────────────────────────┘

                    [CANCEL]  [SAVE] ← Click this!
```

## ❓ Still Not Working?

### If you get "redirect_uri_mismatch" after 10 minutes:

Try adding these additional URIs:
```
http://localhost:5173/
http://127.0.0.1:5173
http://127.0.0.1:5173/
```

### If popup doesn't open:

1. Check if popup blocker is enabled
2. Try in incognito window
3. Clear browser cache (F12 → Application → Clear storage)

### If you get "This app isn't verified":

1. This is normal for development
2. Click "Advanced"
3. Click "Go to AI Event Planner (unsafe)"
4. This only appears once per Google account

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Google popup opens
- ✅ You can select your account
- ✅ Popup closes automatically
- ✅ You see "Successfully logged in with Google!" message
- ✅ You're redirected to dashboard

## 🔧 Quick Commands

```bash
# Make sure servers are running:

# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev

# Then test at: http://localhost:5173/test-google
```

## 📊 Test Accounts (Alternative Login)

While waiting for Google OAuth, you can use these:
- **Admin:** admin@ai.com / Ramesh@143
- **Vendor:** vendor@test.com / Vendor@123
- **User:** user@test.com / User@123

## ⏱️ Timeline

- Adding URIs: 2 minutes
- Waiting for Google: 5-10 minutes
- Testing: 1 minute
- **Total: ~15 minutes**

## 🆘 Need Help?

1. Run diagnostic: `node check-google-oauth.js`
2. Check test page: http://localhost:5173/test-google
3. Look at browser console (F12) for errors
4. Verify both servers are running

## 📝 Summary

**The Problem:** Google Cloud Console doesn't have the redirect URIs
**The Solution:** Add `http://localhost:5173` to both sections
**The Wait:** 5-10 minutes for changes to propagate
**The Test:** http://localhost:5173/test-google

That's it! Once you add the URIs and wait, it will work perfectly. 🎯
