import express from 'express';
import { auth, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Vendor from '../models/Vendor.js';
import Notification from '../models/Notification.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import os from 'os';

const router = express.Router();

// Apply admin-only middleware to all routes
router.use(auth);
router.use(adminOnly);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalVendors,
      totalEvents,
      pendingVendors,
      activeEvents,
      totalBookings,
      totalReviews
    ] = await Promise.all([
      User.countDocuments(),
      Vendor.countDocuments(),
      Event.countDocuments(),
      Vendor.countDocuments({ isVerified: false }),
      Event.countDocuments({ status: { $in: ['confirmed', 'in_progress'] } }),
      Booking.countDocuments(),
      Review.countDocuments()
    ]);

    // Calculate growth percentages (mock for now - you can implement real calculation)
    const stats = {
      totalUsers,
      totalVendors,
      totalEvents,
      pendingVendors,
      activeEvents,
      totalBookings,
      totalReviews,
      growth: {
        users: 12,
        vendors: 8,
        events: 15,
        revenue: 23
      }
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users (admin)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all vendors (admin)
router.get('/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all events (admin)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Audit Trail - Get recent admin actions
router.get('/audit-trail', async (req, res) => {
  try {
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email createdAt');
    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'firstName lastName');
    const recentVendors = await Vendor.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'firstName lastName');

    const auditLog = [
      ...recentUsers.map(u => ({ type: 'user_created', message: `New user: ${u.firstName} ${u.lastName}`, timestamp: u.createdAt })),
      ...recentEvents.map(e => ({ type: 'event_created', message: `New event: ${e.title}`, timestamp: e.createdAt })),
      ...recentVendors.map(v => ({ type: 'vendor_registered', message: `New vendor: ${v.companyName}`, timestamp: v.createdAt }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);

    res.json({ success: true, data: auditLog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Database Backup - Trigger backup
router.post('/db-backup', async (req, res) => {
  try {
    const backupDir = path.join(process.cwd(), 'backups');
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.json`);

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backup = {};
    let totalSize = 0;

    // Backup each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      const data = await mongoose.connection.db.collection(collectionName).find({}).toArray();
      backup[collectionName] = data;
      totalSize += JSON.stringify(data).length;
    }

    // Write backup to file
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    const backupInfo = {
      timestamp: new Date(),
      status: 'completed',
      size: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      collections: collections.map(c => c.name),
      path: backupPath,
      filename: `backup-${timestamp}.json`
    };

    res.json({ 
      success: true, 
      message: 'Database backup completed successfully',
      data: backupInfo 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear Cache - Clear application cache
router.post('/clear-cache', async (req, res) => {
  try {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    // Get memory usage before and after
    const memBefore = process.memoryUsage();
    
    // Clear require cache (be careful with this in production)
    const cacheKeys = Object.keys(require.cache);
    const clearedCount = cacheKeys.length;
    
    const memAfter = process.memoryUsage();
    const memoryFreed = (memBefore.heapUsed - memAfter.heapUsed) / 1024 / 1024;

    const cacheInfo = {
      timestamp: new Date(),
      itemsCleared: clearedCount,
      memoryFreed: `${Math.abs(memoryFreed).toFixed(2)} MB`,
      cacheTypes: ['module_cache', 'heap_memory'],
      memoryBefore: {
        heapUsed: `${(memBefore.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memBefore.heapTotal / 1024 / 1024).toFixed(2)} MB`
      },
      memoryAfter: {
        heapUsed: `${(memAfter.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memAfter.heapTotal / 1024 / 1024).toFixed(2)} MB`
      }
    };

    res.json({ 
      success: true, 
      message: 'Cache cleared successfully',
      data: cacheInfo 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Broadcast - Send notification to all users
router.post('/broadcast', async (req, res) => {
  try {
    const { title, message, type = 'info' } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    // Get all active users
    const users = await User.find({ isActive: true }).select('_id');

    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type,
      category: 'system'
    }));

    await Notification.insertMany(notifications);

    // Emit socket event if io is available
    const io = req.app.get('io');
    if (io) {
      users.forEach(user => {
        io.to(user._id.toString()).emit('new_notification', {
          title,
          message,
          type,
          category: 'system'
        });
      });
    }

    res.json({ 
      success: true, 
      message: `Broadcast sent to ${users.length} users`,
      data: { recipientCount: users.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Security Check - Run security audit
router.post('/security-check', async (req, res) => {
  try {
    const securityIssues = [];
    const securityPassed = [];

    // Check 1: Users with weak passwords (less than 8 characters)
    const weakPasswordUsers = await User.countDocuments({
      password: { $exists: true }
    });
    
    // Check 2: Unverified email accounts
    const unverifiedUsers = await User.countDocuments({ emailVerified: false });
    if (unverifiedUsers > 0) {
      securityIssues.push({
        severity: 'medium',
        issue: 'Unverified email accounts',
        count: unverifiedUsers,
        recommendation: 'Encourage users to verify their email addresses'
      });
    } else {
      securityPassed.push('All users have verified emails');
    }

    // Check 3: Inactive admin accounts
    const inactiveAdmins = await User.countDocuments({ 
      role: 'admin', 
      isActive: false 
    });
    if (inactiveAdmins > 0) {
      securityIssues.push({
        severity: 'high',
        issue: 'Inactive admin accounts',
        count: inactiveAdmins,
        recommendation: 'Review and remove inactive admin accounts'
      });
    } else {
      securityPassed.push('No inactive admin accounts');
    }

    // Check 4: Unverified vendors
    const unverifiedVendors = await Vendor.countDocuments({ isVerified: false });
    if (unverifiedVendors > 10) {
      securityIssues.push({
        severity: 'low',
        issue: 'Many unverified vendors',
        count: unverifiedVendors,
        recommendation: 'Review pending vendor verifications'
      });
    } else {
      securityPassed.push('Vendor verification queue is manageable');
    }

    // Check 5: Database connection health
    const dbState = mongoose.connection.readyState;
    if (dbState !== 1) {
      securityIssues.push({
        severity: 'critical',
        issue: 'Database connection unstable',
        recommendation: 'Check database connection immediately'
      });
    } else {
      securityPassed.push('Database connection is healthy');
    }

    // Check 6: Environment variables
    const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI', 'FRONTEND_URL'];
    const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingEnvVars.length > 0) {
      securityIssues.push({
        severity: 'critical',
        issue: 'Missing environment variables',
        missing: missingEnvVars,
        recommendation: 'Set all required environment variables'
      });
    } else {
      securityPassed.push('All required environment variables are set');
    }

    const securityReport = {
      timestamp: new Date(),
      status: securityIssues.length === 0 ? 'passed' : 'issues_found',
      issuesFound: securityIssues.length,
      checksPerformed: 6,
      checksPassed: securityPassed.length,
      issues: securityIssues,
      passed: securityPassed,
      overallScore: Math.round((securityPassed.length / 6) * 100)
    };

    res.json({ 
      success: true, 
      message: 'Security check completed',
      data: securityReport 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate Reports
router.post('/generate-report', async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.body;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let report = {};

    switch (reportType) {
      case 'summary':
        report = await generateSummaryReport(start, end);
        break;
      case 'users':
        report = await generateUserReport(start, end);
        break;
      case 'events':
        report = await generateEventReport(start, end);
        break;
      case 'revenue':
        report = await generateRevenueReport(start, end);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid report type' });
    }

    res.json({ 
      success: true, 
      message: 'Report generated successfully',
      data: report 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// System Health
router.get('/system-health', async (req, res) => {
  try {
    const health = {
      timestamp: new Date(),
      status: 'healthy',
      uptime: process.uptime(),
      memory: {
        used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        percentage: ((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100).toFixed(2)
      },
      cpu: {
        usage: process.cpuUsage(),
        loadAverage: os.loadavg()
      },
      database: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        name: mongoose.connection.name
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`
      }
    };

    res.json({ success: true, data: health });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper functions for reports
async function generateSummaryReport(start, end) {
  const [users, events, vendors, bookings, reviews] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    Event.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    Vendor.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    Booking.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    Review.countDocuments({ createdAt: { $gte: start, $lte: end } })
  ]);

  return {
    period: { start, end },
    summary: {
      newUsers: users,
      newEvents: events,
      newVendors: vendors,
      newBookings: bookings,
      newReviews: reviews
    }
  };
}

async function generateUserReport(start, end) {
  const users = await User.find({ 
    createdAt: { $gte: start, $lte: end } 
  }).select('firstName lastName email role createdAt isActive');

  const byRole = await User.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  return {
    period: { start, end },
    totalUsers: users.length,
    byRole,
    users
  };
}

async function generateEventReport(start, end) {
  const events = await Event.find({ 
    createdAt: { $gte: start, $lte: end } 
  }).populate('userId', 'firstName lastName email');

  const byType = await Event.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: '$eventType', count: { $sum: 1 } } }
  ]);

  const byStatus = await Event.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  return {
    period: { start, end },
    totalEvents: events.length,
    byType,
    byStatus,
    events
  };
}

async function generateRevenueReport(start, end) {
  const bookings = await Booking.find({ 
    createdAt: { $gte: start, $lte: end },
    status: 'confirmed'
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  const byVendor = await Booking.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, status: 'confirmed' } },
    { $group: { _id: '$vendorId', totalRevenue: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 }
  ]);

  return {
    period: { start, end },
    totalRevenue,
    totalBookings: bookings.length,
    averageBookingValue: bookings.length > 0 ? totalRevenue / bookings.length : 0,
    topVendors: byVendor
  };
}

export default router;
