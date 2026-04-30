import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// 🔴 Validate ENV
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in environment variables");
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// 🔍 Debug (remove later if needed)
console.log("ENV CHECK:", process.env.MONGODB_URI ? "Loaded ✅" : "Missing ❌");

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import vendorRoutes from './routes/vendors.js';
import guestRoutes from './routes/guests.js';
import budgetRoutes from './routes/budget.js';
import taskRoutes from './routes/tasks.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import chatbotRoutes from './routes/chatbot.js';

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'https://accounts.google.com',
  'https://oauth2.googleapis.com'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
      return callback(null, true);
    }

    return callback(null, true); // allow all (you can restrict later)
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true
  }
});

app.set('io', io);

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('join', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      onlineUsers.set(userId, socket.id);
      io.emit('user_online', { userId, online: true });
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('user_online', { userId, online: false });
        break;
      }
    }
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

export { io };

// ✅ MongoDB Atlas Connection (FIXED)
console.log("🔍 Connecting to MongoDB...");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI Event Planner API is running',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
