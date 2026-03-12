
# 🎉 AI Event Planner - Full Stack Application

A comprehensive event planning platform with AI-powered features, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🌟 Features

### For Event Organizers
- **Event Management**: Create, manage, and monitor events with real-time updates
- **Vendor Booking**: Search, compare, and book verified vendors
- **Guest Management**: Send invitations, track RSVPs, and manage guest lists
- **Budget Tracking**: Smart budget tools with expense tracking
- **AI Assistance**: Get intelligent recommendations for venues, vendors, and timelines

### For Vendors
- **Service Management**: List and manage your services
- **Booking Management**: Track and manag
e bookings from event organizers
- **Reviews & Ratings**: Build your reputation with customer reviews
- **AI Lead Suggestions**: Get matched with relevant events

### For Administrators
- **User Management**: Manage users, vendors, and events
- **Analytics Dashboard**: Real-time insights and system monitoring
- **System Settings**: Configure platform settings and permissions
- **Real-time Actions**: Audit trails, backups, security checks, and more

## 🎨 Design

- **Professional Green Theme**: Consistent, modern color scheme throughout
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for delightful user interactions
- **Material-UI Components**: Clean, accessible interface

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Socket.io** - Real-time notifications
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time updates

## 📁 Project Structure

```
AIEVENT/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # MongoDB models
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Vendor.js
│   │   ├── Booking.js
│   │   ├── Budget.js
│   │   ├── Guest.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Review.js
│   │   └── Task.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── events.js
│   │   ├── vendors.js
│   │   ├── bookings.js
│   │   ├── budget.js
│   │   ├── guests.js
│   │   ├── messages.js
│   │   ├── notifications.js
│   │   ├── reviews.js
│   │   ├── tasks.js
│   │   └── admin.js
│   ├── server.js                # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Admin-specific components
│   │   │   ├── analytics/       # Analytics components
│   │   │   ├── common/          # Reusable components
│   │   │   ├── event/           # Event-related components
│   │   │   ├── layout/          # Layout components (Header, Footer, etc.)
│   │   │   └── vendor/          # Vendor-specific components
│   │   ├── contexts/            # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── AppContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page components
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── events/
│   │   │   ├── messages/
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   ├── user/
│   │   │   ├── vendor/
│   │   │   └── vendors/
│   │   ├── router/              # React Router configuration
│   │   ├── services/            # API services
│   │   ├── utils/               # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── dev.js                       # Development server launcher
├── setup.js                     # Project setup script
└── package.json                 # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RameshreddyDwarakacherla/AIEVENT.git
   cd AIEVENT
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**

   Create `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aieventplanner
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**

   **Option 1: Run both servers concurrently (Recommended)**
   ```bash
   # From root directory
   npm run dev
   ```

   **Option 2: Run servers separately**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:5000

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `PUT /api/vendors/:id` - Update vendor profile

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status

### Admin
- `GET /api/admin/stats` - Get system statistics
- `POST /api/admin/audit-trail` - View audit trail
- `POST /api/admin/backup` - Trigger database backup
- `POST /api/admin/clear-cache` - Clear system cache
- `POST /api/admin/broadcast` - Send broadcast message
- `POST /api/admin/security-check` - Run security check
- `POST /api/admin/generate-reports` - Generate reports

## 🎨 Color Scheme

The application uses a professional green theme:
- Primary: `#2E7D32` (Forest Green)
- Secondary: `#43A047` (Medium Green)
- Dark: `#1B5E20` (Dark Forest Green)
- Light: `#81C784` (Light Green)
- Background: `linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)`

## 🔐 User Roles

1. **User/Organizer**: Create events, book vendors, manage guests
2. **Vendor**: List services, manage bookings, receive reviews
3. **Admin**: Full system access, user management, analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ramesh Reddy Dwarakacherla**
- GitHub: [@RameshreddyDwarakacherla](https://github.com/RameshreddyDwarakacherla)

## 🙏 Acknowledgments

- Material-UI for the component library
- Framer Motion for animations
- MongoDB for the database
- React team for the amazing framework

---

Made with ❤️ by Ramesh Reddy Dwarakacherla
         # JWT authentication middleware
│   ├── models/         