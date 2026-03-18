# Security Setup Guide

## Environment Variables Setup

**IMPORTANT**: Never commit actual API keys or sensitive credentials to version control!

### 1. Frontend Environment Variables

Copy `frontend/.env.example` to `frontend/.env` and fill in your values:

```bash
cp frontend/.env.example frontend/.env
```

### 2. Backend Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```bash
cp backend/.env.example backend/.env
```

### 3. Required API Keys and Credentials

#### MongoDB Database
- Sign up for MongoDB Atlas: https://www.mongodb.com/atlas
- Create a cluster and get your connection string
- Replace `MONGODB_URI` in `backend/.env`

#### Google Gemini API Key
- Visit: https://makersuite.google.com/app/apikey
- Create a new API key
- Replace `GEMINI_API_KEY` in `backend/.env`

#### Google OAuth Setup
- Go to Google Cloud Console: https://console.cloud.google.com/
- Create a new project or select existing
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add authorized JavaScript origins: `http://localhost:5173`
- Add authorized redirect URIs: `http://localhost:5173`
- Replace `VITE_GOOGLE_CLIENT_ID` in `frontend/.env`
- Replace `GOOGLE_CLIENT_SECRET` in `backend/.env`

#### JWT Secret
- Generate a strong random string for production
- Replace `JWT_SECRET` in `backend/.env`

### 4. Security Best Practices

1. **Never commit .env files** - They are in .gitignore for a reason
2. **Use different keys for development and production**
3. **Rotate API keys regularly**
4. **Use environment-specific configurations**
5. **Monitor API key usage** for unusual activity

### 5. Production Deployment

For production deployment, set environment variables directly in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Railway: Project Settings → Variables
- Heroku: Settings → Config Vars

## If API Keys Were Exposed

If you accidentally committed API keys:

1. **Immediately revoke/regenerate** all exposed keys
2. **Remove sensitive data** from git history
3. **Update all services** with new keys
4. **Monitor for unauthorized usage**

## Contact

If you notice any security issues, please report them immediately.