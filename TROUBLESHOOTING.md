# Troubleshooting Guide

## Current Status

✅ **Backend:** Working correctly
✅ **Database:** Admin user created successfully  
✅ **API:** Login endpoint responding correctly
✅ **Google OAuth:** Fixed (using implicit flow)

## Issues and Solutions

### Issue 1: "Invalid email or password" for Admin Login

**Status:** ✅ FIXED

**Solution:**
The admin user has been created in the database with these credentials:
- Email: `admin@ai.com`
- Password: `Ramesh@143`

**Steps to fix if still not working:**

1. **Clear browser cache and localStorage:**
   ```javascript
   // Open browser console (F12) and run:
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Or use Incognito/Private window:**
   - Press `Ctrl+Shift+N` (Chrome) or `Ctrl+Shift+P` (Firefox)
   - Go to http://localhost:5173/login
   - Try logging in

3. **Restart frontend server:**
   ```bash
   # Stop the server (Ctrl+C)
   cd frontend
   npm run dev
   ```

4. **Verify backend is running:**
   ```bash
   cd backend
   npm start
   # Should see: ✅ Connected to MongoDB Atlas
   ```

### Issue 2: Google OAuth "redirect_uri_mismatch"

**Status:** ✅ FIXED

**What was changed:**
- Changed from `flow: 'auth-code'` to `flow: 'implicit'` in `useGoogleAuth.js`
- Implicit flow works directly in browser without server-side redirects

**Steps to test:**
1. Clear browser cache or use incognito
2. Go to http://localhost:5173/login
3. Click "Continue with Google"
4. Select your Google account
5. Should successfully log in

**If still not working:**
1. Wait 2-3 minutes (Google Cloud Console changes take time)
2. Verify in Google Cloud Console:
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`
3. Try in incognito window

### Issue 3: Only Vendor Login Works

**Status:** ✅ FIXED

**Root cause:** Admin user didn't exist in database

**Solution:** Ran seed script to create all test users:
```bash
cd backend
node seedAdmin.js
```

**Test accounts created:**
- Admin: admin@ai.com / Ramesh@143
- Vendor: vendor@test.com / Vendor@123
- User: user@test.com / User@123

## Quick Test Commands

### Test Backend API Directly
```powershell
# Test admin login
$body = @{email='admin@ai.com';password='Ramesh@143'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method Post -Body $body -ContentType 'application/json'

# Test vendor login
$body = @{email='vendor@test.com';password='Vendor@123'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method Post -Body $body -ContentType 'application/json'

# Test user login
$body = @{email='user@test.com';password='User@123'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method Post -Body $body -ContentType 'application/json'
```

### Check if Servers are Running
```bash
# Check backend
curl http://localhost:5000/api/health

# Check frontend
# Open browser: http://localhost:5173
```

## Complete Reset Procedure

If nothing works, follow these steps:

1. **Stop all servers**
   ```bash
   # Press Ctrl+C in both terminal windows
   ```

2. **Clear browser data**
   - Open DevTools (F12)
   - Application tab → Clear storage → Clear site data
   - Or use incognito window

3. **Restart backend**
   ```bash
   cd backend
   npm start
   ```

4. **Restart frontend**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Test login**
   - Go to http://localhost:5173/login
   - Try admin login: admin@ai.com / Ramesh@143
   - Or click "Admin Portal Access" button

## Common Errors and Fixes

### Error: "Cannot connect to backend"
- **Check:** Is backend running on port 5000?
- **Fix:** `cd backend && npm start`

### Error: "MongoDB connection failed"
- **Check:** Is MONGODB_URI correct in backend/.env?
- **Fix:** Verify connection string and credentials

### Error: "CORS error"
- **Check:** Is FRONTEND_URL set correctly in backend/.env?
- **Fix:** Should be `http://localhost:5173`

### Error: "Token expired"
- **Fix:** Clear localStorage and login again
  ```javascript
  localStorage.clear();
  location.reload();
  ```

## Files Modified

1. ✅ `frontend/src/hooks/useGoogleAuth.js` - Fixed OAuth flow
2. ✅ `backend/seedAdmin.js` - Created admin seeding script
3. ✅ `TEST_ACCOUNTS.md` - Documentation of test accounts
4. ✅ `GOOGLE_OAUTH_FIX.md` - Google OAuth fix documentation
5. ✅ `TROUBLESHOOTING.md` - This file

## Next Steps

1. Clear browser cache/localStorage
2. Restart both servers
3. Test admin login
4. Test Google OAuth
5. Verify all three roles work (admin, vendor, user)

## Support

If issues persist:
1. Check browser console for errors (F12)
2. Check backend terminal for error logs
3. Verify all environment variables are set correctly
4. Try the "Complete Reset Procedure" above
