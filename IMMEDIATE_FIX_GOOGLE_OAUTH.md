# IMMEDIATE FIX: Google OAuth redirect_uri_mismatch

## The Issue
The error `redirect_uri_mismatch` means Google Cloud Console doesn't have the correct redirect URI configured.

## IMMEDIATE SOLUTION (Do This Now)

### Step 1: Add These EXACT URIs to Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

Find your OAuth Client ID and add these URIs:

#### In "Authorized JavaScript origins" section:
```
http://localhost:5173
```

#### In "Authorized redirect URIs" section:
```
http://localhost:5173
http://localhost:5173/
http://localhost:5173/login
http://localhost:5173/register  
https://localhost:5173
https://localhost:5173/
```

**IMPORTANT:** 
- Add them EXACTLY as shown (with and without trailing slashes)
- Click SAVE
- Wait 5 minutes

### Step 2: Clear Browser Cache

**Option A: Use Incognito Window (Easiest)**
- Press `Ctrl+Shift+N` (Chrome) or `Ctrl+Shift+P` (Firefox)
- Go to http://localhost:5173/login
- Try Google login

**Option B: Clear Cache**
1. Press F12 to open DevTools
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or go to Application → Storage → Clear site data

### Step 3: Restart Frontend

```bash
# Stop frontend (Ctrl+C)
cd frontend
npm run dev
```

### Step 4: Test

1. Go to http://localhost:5173/login (in incognito)
2. Click "Continue with Google"
3. Should work!

## If Still Not Working

### Check Your Google Cloud Console Settings

1. **OAuth Consent Screen:**
   - Go to APIs & Services → OAuth consent screen
   - Make sure it's configured (External type)
   - Add your email as a test user

2. **Verify Client ID:**
   - Make sure the Client ID in `frontend/.env` matches Google Cloud Console
   - Get your Client ID from Google Cloud Console OAuth 2.0 credentials

3. **Check Application Type:**
   - In Credentials, your OAuth client should be type "Web application"
   - NOT "Desktop app" or "Mobile app"

## Alternative: Switch to Google One Tap (More Reliable)

If the above doesn't work after 10 minutes, we can switch to Google One Tap which doesn't have redirect URI issues.

### Quick Test Command

To see what redirect URI is being sent:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Continue with Google"
4. Look for request to `accounts.google.com/o/oauth2`
5. Check the `redirect_uri` parameter
6. Add that EXACT URI to Google Cloud Console

## Screenshot Guide

When you're in Google Cloud Console editing your OAuth client, it should look like this:

```
Authorized JavaScript origins
┌─────────────────────────────────────┐
│ http://localhost:5173               │ [X]
└─────────────────────────────────────┘
[+ ADD URI]

Authorized redirect URIs
┌─────────────────────────────────────┐
│ http://localhost:5173               │ [X]
│ http://localhost:5173/              │ [X]
│ http://localhost:5173/login         │ [X]
│ http://localhost:5173/register      │ [X]
└─────────────────────────────────────┘
[+ ADD URI]

[CANCEL]  [SAVE]  ← Click this!
```

## Common Mistakes

❌ **Wrong:** Adding `http://localhost:5173/api/auth/google`
✅ **Right:** Adding `http://localhost:5173`

❌ **Wrong:** Adding only JavaScript origins
✅ **Right:** Adding BOTH JavaScript origins AND redirect URIs

❌ **Wrong:** Testing immediately after saving
✅ **Right:** Waiting 5-10 minutes after saving

❌ **Wrong:** Testing in same browser tab
✅ **Right:** Testing in incognito window

## Verification

After adding URIs and waiting, verify:

```bash
# Check frontend is running
curl http://localhost:5173

# Check backend is running  
curl http://localhost:5000/api/health

# Should return: {"status":"OK",...}
```

## Need More Help?

If this still doesn't work:

1. Take a screenshot of your Google Cloud Console OAuth client configuration
2. Check browser console for the exact error
3. Look at the Network tab to see the actual redirect_uri being sent
4. We can then add that specific URI

## Time Estimate

- Adding URIs: 2 minutes
- Waiting for propagation: 5-10 minutes
- Testing: 1 minute
- **Total: ~15 minutes**

## Success Indicators

You'll know it's working when:
- ✅ Google login popup opens
- ✅ You can select your Google account
- ✅ You're redirected back to the app
- ✅ You see "Successfully logged in with Google!" toast
- ✅ You're redirected to the dashboard
