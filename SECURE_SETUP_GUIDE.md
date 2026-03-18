# 🔒 Secure Setup Guide

## ⚠️ IMPORTANT: Manual Setup Required

The `.env` files contain placeholder values for security. You must manually add your actual credentials.

## Step-by-Step Setup

### 1. Backend Environment Setup

Edit `backend/.env` and replace these placeholders:

```bash
# Replace this with your actual MongoDB connection string
MONGODB_URI=your_mongodb_connection_string_here

# Replace with a strong JWT secret (generate a random string)
JWT_SECRET=your_strong_jwt_secret_here

# Replace with your actual Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here

# Replace with your actual Google OAuth client secret
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2. Get Your API Keys

#### MongoDB Connection String
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a cluster (if you don't have one)
3. Get your connection string
4. Replace `MONGODB_URI` in `backend/.env`

#### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Replace `GEMINI_API_KEY` in `backend/.env`

#### Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized origins: `http://localhost:5173`
4. Replace `GOOGLE_CLIENT_SECRET` in `backend/.env`
5. The Client ID is already set in `frontend/.env`

#### JWT Secret
Generate a strong random string (32+ characters) for `JWT_SECRET`

### 3. Verify Setup

After updating the credentials:

```bash
# Start the application
npm run dev

# Check if everything works:
# - Frontend loads at http://localhost:5173
# - Backend API responds at http://localhost:5000
# - Database connection works
# - Google OAuth works
# - AI chatbot works
```

## 🔐 Security Reminders

- ✅ `.env` files are in `.gitignore` - they won't be committed
- ✅ Never share your actual API keys
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly
- ✅ Monitor API usage for unusual activity

## 🚨 If You See Security Warnings

If Google Console shows API key warnings:
1. The keys might be exposed somewhere
2. Check that `.env` files are not committed to git
3. Revoke and regenerate the exposed keys immediately

---

**Remember: Security is your responsibility. Keep your credentials safe!**