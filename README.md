# AI Event Planner 🎉

A comprehensive event management platform powered by AI, built with React, Node.js, Express, and MongoDB.

## Features ✨

- **AI-Powered Event Planning** - Get intelligent suggestions for venues, vendors, and budgets
- **Multi-Role System** - Support for Users, Vendors, and Admins
- **Google OAuth Integration** - Secure authentication with Google Sign-In
- **Real-time Chat** - Communicate with vendors and guests using Socket.IO
- **Budget Management** - Track expenses and manage event budgets
- **Vendor Marketplace** - Browse and book vendors for your events
- **Guest Management** - Send invitations and track RSVPs
- **Task Management** - Organize event tasks with deadlines
- **Analytics Dashboard** - Comprehensive insights for admins

## Tech Stack 🛠️

### Frontend
- React 19
- Material-UI (MUI)
- React Router
- Socket.IO Client
- @react-oauth/google
- Recharts for analytics
- Framer Motion for animations

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Google OAuth 2.0
- Socket.IO for real-time features
- Google Gemini AI integration

## Prerequisites 📋

- Node.js (v16 or higher)
- MongoDB Atlas account
- Google Cloud Console account (for OAuth)
- Google Gemini API key (for AI features)

## Installation 🚀

### 1. Clone the repository

```bash
git clone https://github.com/RameshreddyDwarakacherla/AIEVENT.git
cd AIEVENT
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure environment variables

#### Backend (.env)

Copy `backend/.env.example` to `backend/.env` and fill in your credentials:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Frontend (.env)

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins and redirect URIs:
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`
6. Copy Client ID and Client Secret to your .env files

**Detailed setup guide:** See `GOOGLE_OAUTH_SETUP_NEW.md`

### 5. Seed the database (Optional)

Create test accounts:

```bash
cd backend
node seedAdmin.js
```

This creates:
- Admin: admin@ai.com / Ramesh@143
- Vendor: vendor@test.com / Vendor@123
- User: user@test.com / User@123

## Running the Application 🏃

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Test Google OAuth

Visit http://localhost:5173/test-google to verify Google OAuth is working correctly.

## Project Structure 📁

```
AIEVENT/
├── backend/
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── server.js        # Express server
│   └── seedAdmin.js     # Database seeding
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # React components
│       ├── contexts/    # React contexts
│       ├── hooks/       # Custom hooks
│       ├── pages/       # Page components
│       ├── router/      # Route configuration
│       └── lib/         # Utilities
├── .gitignore
├── README.md
└── package.json
```

## User Roles 👥

### User (Event Organizer)
- Create and manage events
- Browse and book vendors
- Manage guest lists
- Track budgets and expenses
- Get AI-powered recommendations

### Vendor
- Create vendor profile
- List services and pricing
- Manage bookings
- Communicate with clients
- View reviews and ratings

### Admin
- Manage all users and vendors
- View system analytics
- Configure system settings
- Monitor platform activity
- Access admin dashboard

## API Endpoints 🔌

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google OAuth
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Vendors
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create vendor profile
- `GET /api/vendors/:id` - Get vendor details
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

*See full API documentation in `/backend/routes/`*

## Documentation 📚

- `GOOGLE_OAUTH_SETUP_NEW.md` - Complete Google OAuth setup guide
- `QUICK_START_GOOGLE.md` - Quick reference for Google OAuth
- `TEST_ACCOUNTS.md` - Test account credentials
- `TROUBLESHOOTING.md` - Common issues and solutions
- `DEPLOYMENT_GUIDE.md` - Production deployment guide

## Testing 🧪

### Test Google OAuth
```bash
# Visit the test page
http://localhost:5173/test-google
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ai.com","password":"Ramesh@143"}'
```

## Deployment 🌐

### Frontend (Netlify/Vercel)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder
3. Set environment variables in hosting platform

### Backend (Heroku/Railway)
1. Push to your hosting platform
2. Set environment variables
3. Ensure MongoDB Atlas is accessible

**Detailed deployment guide:** See `DEPLOYMENT_GUIDE.md`

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## Troubleshooting 🔧

### Google OAuth Issues
- See `GOOGLE_OAUTH_SETUP_NEW.md` for detailed setup
- Ensure URIs are correctly configured in Google Cloud Console
- Wait 5-10 minutes after changing Google Cloud settings
- Test in incognito window to avoid cache issues

### Database Connection Issues
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Ensure IP address is whitelisted

### Common Errors
See `TROUBLESHOOTING.md` for solutions to common issues.

## License 📄

This project is licensed under the MIT License.

## Support 💬

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review troubleshooting guides

## Acknowledgments 🙏

- Google Gemini AI for intelligent recommendations
- Material-UI for beautiful components
- MongoDB Atlas for database hosting
- All contributors and testers

---

**Built with ❤️ by Ramesh Reddy Dwarakacherla**

**Repository:** https://github.com/RameshreddyDwarakacherla/AIEVENT
