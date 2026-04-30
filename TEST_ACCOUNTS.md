# Test Accounts for AI Event Planner

## Created Test Accounts

All accounts have been successfully created in the database.

### Admin Account
- **Email:** `admin@ai.com`
- **Password:** `Ramesh@143`
- **Role:** Admin
- **Access:** Full system access, admin dashboard

### Vendor Account
- **Email:** `vendor@test.com`
- **Password:** `Vendor@123`
- **Role:** Vendor
- **Access:** Vendor dashboard, manage services

### Regular User Account
- **Email:** `user@test.com`
- **Password:** `User@123`
- **Role:** User
- **Access:** User dashboard, create events

## Google OAuth Login

You can also sign in using "Continue with Google" button with any Google account. The system will:
1. Verify your Google account
2. Create a new user account if you don't have one
3. Automatically verify your email
4. Log you in and redirect to the appropriate dashboard

## Testing Instructions

### 1. Test Regular Login
1. Go to http://localhost:5173/login
2. Enter email and password from above
3. Click "Sign In"
4. Should redirect to appropriate dashboard

### 2. Test Google OAuth
1. Go to http://localhost:5173/login
2. Click "Continue with Google"
3. Select your Google account
4. Grant permissions
5. Should create account and redirect to dashboard

### 3. Test Admin Portal Access
1. Go to http://localhost:5173/login
2. Click "Admin Portal Access" button
3. Credentials will auto-fill
4. Click "Sign In"
5. Should redirect to admin dashboard

## Troubleshooting

### "Invalid email or password" Error
- Make sure you ran the seed script: `node backend/seedAdmin.js`
- Check that backend server is running on port 5000
- Verify MongoDB connection is active

### Google OAuth "redirect_uri_mismatch" Error
- Verify Google Cloud Console has `http://localhost:5173` in:
  - Authorized JavaScript origins
  - Authorized redirect URIs
- Clear browser cache or use incognito window
- Wait 2-3 minutes after changing Google Cloud Console settings

### Backend Not Responding
```bash
# Check if backend is running
cd backend
npm start

# Should see:
# ✅ Connected to MongoDB Atlas
# 🚀 Server running on port 5000
```

### Frontend Not Loading
```bash
# Check if frontend is running
cd frontend
npm run dev

# Should see:
# VITE ready in XXX ms
# ➜ Local: http://localhost:5173/
```

## Password Requirements

When creating new accounts manually:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

Example valid passwords:
- `Ramesh@143`
- `Vendor@123`
- `User@123`
- `MyPass@2024`

## Next Steps

1. ✅ Admin user created
2. ✅ Test accounts created
3. ✅ Google OAuth configured
4. 🔄 Test all login methods
5. 🔄 Verify dashboard access for each role
