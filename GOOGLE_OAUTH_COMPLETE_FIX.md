# Complete Google OAuth Fix Guide

## The Problem

You're getting "Error 400: redirect_uri_mismatch" because the redirect URI in your Google Cloud Console doesn't match what the OAuth library is sending.

## Root Cause

The `@react-oauth/google` library with implicit flow still uses redirect URIs internally, even though it's a popup-based flow. The library constructs specific redirect URIs that must be whitelisted.

## Complete Solution

### Step 1: Go to Google Cloud Console

1. Open https://console.cloud.google.com/
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID in the credentials list
5. Click the **edit icon** (pencil)

### Step 2: Add ALL These URIs

#### Authorized JavaScript origins:
```
http://localhost:5173
http://127.0.0.1:5173
http://localhost:3000
http://127.0.0.1:3000
```

#### Authorized redirect URIs:
```
http://localhost:5173
http://localhost:5173/
http://localhost:5173/login
http://localhost:5173/register
http://127.0.0.1:5173
http://127.0.0.1:5173/
http://localhost:3000
http://localhost:3000/
```

### Step 3: Save and Wait

1. Click **SAVE** at the bottom
2. **Wait 5-10 minutes** for changes to propagate (this is important!)
3. Google's OAuth servers need time to update

### Step 4: Clear Everything

1. **Close all browser windows**
2. **Open a new incognito/private window**
3. Or clear browser data:
   - Press F12 (DevTools)
   - Application tab → Storage → Clear site data
   - Close and reopen browser

### Step 5: Test

1. Go to http://localhost:5173/login
2. Click "Continue with Google"
3. Should work now!

## Alternative Solution: Use Google One Tap

If the above doesn't work, we can switch to Google One Tap which is more reliable:

### Install Google One Tap Package
```bash
cd frontend
npm install @react-oauth/google
```

### Update the Implementation

I'll create a new hook that uses Google One Tap instead of the popup flow.

## Verification Checklist

Before testing, verify:

- [ ] Google Cloud Console changes saved
- [ ] Waited 5-10 minutes after saving
- [ ] Browser cache cleared or using incognito
- [ ] Frontend running on http://localhost:5173
- [ ] Backend running on http://localhost:5000
- [ ] No other tabs with localhost:5173 open

## Common Issues

### Issue: Still getting redirect_uri_mismatch after adding URIs

**Solution:**
1. Wait longer (up to 15 minutes)
2. Try these exact URIs in Google Cloud Console:
   ```
   http://localhost:5173
   http://localhost:5173/
   ```
3. Make sure there are NO trailing slashes in JavaScript origins
4. Make sure you clicked SAVE

### Issue: "Access blocked: This app's request is invalid"

**Solution:**
This means the OAuth consent screen is not configured:
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in:
   - App name: "AI Event Planner"
   - User support email: your email
   - Developer contact: your email
4. Click **Save and Continue**
5. Skip scopes (click Save and Continue)
6. Add test users (your Gmail address)
7. Click **Save and Continue**

### Issue: "This app isn't verified"

**Solution:**
1. This is normal for development
2. Click "Advanced" → "Go to AI Event Planner (unsafe)"
3. This only appears for external users
4. For production, you'll need to verify the app

## Testing Different Approaches

If the standard approach doesn't work, try these alternatives:

### Approach 1: Use Popup Mode (Current)
```javascript
flow: 'implicit',
ux_mode: 'popup',
```

### Approach 2: Use Redirect Mode
```javascript
flow: 'implicit',
ux_mode: 'redirect',
redirect_uri: window.location.origin,
```

### Approach 3: Use Authorization Code Flow
```javascript
flow: 'auth-code',
ux_mode: 'popup',
```

## Debug Information

To see what redirect URI is being used:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Continue with Google"
4. Look for requests to `accounts.google.com`
5. Check the `redirect_uri` parameter in the URL
6. Add that exact URI to Google Cloud Console

## Production Setup

When deploying to production:

1. Add your production domain to both:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com`

2. Update environment variables:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id
   ```

3. Make sure HTTPS is enabled (required for production)

## Support Resources

- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
- @react-oauth/google Docs: https://www.npmjs.com/package/@react-oauth/google
- Google Cloud Console: https://console.cloud.google.com/

## Quick Fix Script

If nothing works, try this complete reset:

```bash
# 1. Stop all servers
# Press Ctrl+C in both terminals

# 2. Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# 3. Restart servers
cd ../backend
npm start

# In another terminal:
cd frontend
npm run dev

# 4. Test in incognito window
# Go to http://localhost:5173/login
```

## Final Notes

- The redirect_uri_mismatch error is the most common OAuth error
- It's almost always a configuration issue in Google Cloud Console
- The fix is simple but requires patience (waiting for propagation)
- Always test in incognito to avoid cache issues
