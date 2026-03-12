import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Standard auth middleware — verifies JWT, checks account is active,
 * and attaches req.userId + req.userRole to the request.
 */
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user to verify account is still active
    const user = await User.findById(decoded.userId).select('_id role isActive');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // ── Blocked / suspended account check ────────────────────────
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support for assistance.',
        code: 'ACCOUNT_SUSPENDED',
      });
    }

    req.userId = user._id.toString();
    req.userRole = user.role;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Admin-only middleware — must be used AFTER auth
 */
export const adminOnly = async (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

/**
 * Role check middleware — must be used AFTER auth
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.userRole)) {
    return res.status(403).json({
      success: false,
      message: `Access restricted to: ${roles.join(', ')}`,
    });
  }
  next();
};

export default auth;
