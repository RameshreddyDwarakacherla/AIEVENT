# 🚀 Quick Start - Google OAuth (New Credentials)

## ✅ Done
- New Google Client ID configured
- New Google Client Secret configured
- Code is ready to use

## 🎯 What You Need to Do (5 Minutes)

### 1. Add URIs to Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

Find your OAuth Client ID in the credentials list.

Add these URIs:

**Authorized JavaScript origins:**
```
http://localhost:5173
```

**Authorized redirect URIs:**
```
http://localhost:5173
http://localhost:5173/
```

Click **SAVE** and **wait 5-10 minutes**.

### 2. Restart Your Servers

```bash
# Stop both servers (Ctrl+C in each terminal)

# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 3. Test It

**Option A: Test Page**
- Open incognito: http://localhost:5173/test-google
- Click "Test Google Login"

**Option B: Real Login**
- Open incognito: http://localhost:5173/login
- Click "Continue with Google"

## 🎉 That's It!

Once you:
1. ✅ Add URIs to Google Cloud Console
2. ✅ Wait 5-10 minutes
3. ✅ Restart servers
4. ✅ Test in incognito

Google OAuth will work perfectly!

## 📝 New Credentials

**Client ID:** `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
**Client Secret:** `YOUR_GOOGLE_CLIENT_SECRET`

(Replace with your actual credentials from Google Cloud Console)

## ⚠️ Important

- **Restart servers** after .env changes (required!)
- **Wait 5-10 minutes** after adding URIs (required!)
- **Use incognito** to avoid cache issues (recommended!)

---

**Need help?** Check `GOOGLE_OAUTH_SETUP_NEW.md` for detailed instructions.
