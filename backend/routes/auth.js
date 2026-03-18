import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import RefreshToken from '../models/RefreshToken.js';
import EmailVerification from '../models/EmailVerification.js';
import PasswordReset from '../models/PasswordReset.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Access Token (short-lived)
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Generate Refresh Token (long-lived)
const generateRefreshToken = async (userId, ipAddress) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const refreshToken = new RefreshToken({
    userId,
    token,
    expiresAt,
    createdByIp: ipAddress
  });

  await refreshToken.save();
  return token;
};

// Send verification email (mock - integrate with email service)
const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  console.log(`📧 Verification email for ${user.email}: ${verificationUrl}`);
  // TODO: Integrate with SendGrid/Mailgun
  // await emailService.send({
  //   to: user.email,
  //   subject: 'Verify Your Email',
  //   html: `Click here to verify: <a href="${verificationUrl}">${verificationUrl}</a>`
  // });
};

// Send password reset email (mock - integrate with email service)
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  console.log(`📧 Password reset email for ${user.email}: ${resetUrl}`);
  // TODO: Integrate with SendGrid/Mailgun
};

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'),
  body('firstName').trim().notEmpty().isLength({ min: 1, max: 50 }),
  body('lastName').trim().notEmpty().isLength({ min: 1, max: 50 }),
  body('role').optional().isIn(['user', 'vendor', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, firstName, lastName, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'user',
      phone
    });

    await user.save();

    // If vendor, create vendor profile
    if (role === 'vendor') {
      const vendor = new Vendor({
        userId: user._id,
        companyName: `${firstName}'s Company`,
        vendorType: 'General',
        isVerified: false
      });
      await vendor.save();
    }

    // Create email verification token
    const verificationToken = EmailVerification.generateToken();
    const emailVerification = new EmailVerification({
      userId: user._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      ipAddress: req.ip
    });
    await emailVerification.save();

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id, req.ip);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
        code: 'ACCOUNT_SUSPENDED'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id, req.ip);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
          avatarUrl: user.avatarUrl
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    // Find refresh token
    const refreshToken = await RefreshToken.findOne({ token });
    if (!refreshToken || !refreshToken.isValid) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    // Verify user still exists and is active
    const user = await User.findById(refreshToken.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = await generateRefreshToken(user._id, req.ip);

    // Revoke old refresh token
    refreshToken.revokedAt = new Date();
    refreshToken.revokedByIp = req.ip;
    refreshToken.replacedByToken = newRefreshToken;
    refreshToken.isActive = false;
    await refreshToken.save();

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      // Revoke refresh token
      const refreshToken = await RefreshToken.findOne({ token, userId: req.userId });
      if (refreshToken) {
        refreshToken.revokedAt = new Date();
        refreshToken.revokedByIp = req.ip;
        refreshToken.isActive = false;
        await refreshToken.save();
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Logout from all devices
router.post('/logout-all', auth, async (req, res) => {
  try {
    // Revoke all refresh tokens for user
    await RefreshToken.updateMany(
      { userId: req.userId, isActive: true },
      { 
        $set: { 
          revokedAt: new Date(),
          revokedByIp: req.ip,
          isActive: false
        }
      }
    );

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify Email
router.post('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const verification = await EmailVerification.findOne({ token });
    if (!verification) {
      return res.status(404).json({ success: false, message: 'Invalid verification token' });
    }

    if (!verification.isValid()) {
      return res.status(400).json({ success: false, message: 'Verification token has expired' });
    }

    // Update user
    const user = await User.findById(verification.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.emailVerified = true;
    await user.save();

    // Mark verification as used
    verification.verified = true;
    verification.verifiedAt = new Date();
    await verification.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Resend Verification Email
router.post('/resend-verification', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    // Invalidate old tokens
    await EmailVerification.updateMany(
      { userId: user._id, verified: false },
      { $set: { expiresAt: new Date() } }
    );

    // Create new verification token
    const verificationToken = EmailVerification.generateToken();
    const emailVerification = new EmailVerification({
      userId: user._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ipAddress: req.ip
    });
    await emailVerification.save();

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Request Password Reset
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    // Invalidate old reset tokens
    await PasswordReset.updateMany(
      { userId: user._id, used: false },
      { $set: { expiresAt: new Date() } }
    );

    // Create password reset token
    const resetToken = PasswordReset.generateToken();
    const passwordReset = new PasswordReset({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      ipAddress: req.ip
    });
    await passwordReset.save();

    // Send reset email
    await sendPasswordResetEmail(user, resetToken);

    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset Password
router.post('/reset-password/:token', [
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { token } = req.params;
    const { password } = req.body;

    const passwordReset = await PasswordReset.findOne({ token });
    if (!passwordReset) {
      return res.status(404).json({ success: false, message: 'Invalid reset token' });
    }

    if (!passwordReset.isValid()) {
      return res.status(400).json({ success: false, message: 'Reset token has expired' });
    }

    // Update user password
    const user = await User.findById(passwordReset.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = password;
    await user.save();

    // Mark reset token as used
    passwordReset.used = true;
    passwordReset.usedAt = new Date();
    await passwordReset.save();

    // Revoke all refresh tokens for security
    await RefreshToken.updateMany(
      { userId: user._id, isActive: true },
      { 
        $set: { 
          revokedAt: new Date(),
          isActive: false
        }
      }
    );

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Google OAuth preflight
router.options('/google', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    console.log('Google OAuth request received:', { body: req.body, headers: req.headers });
    const { access_token, role } = req.body;

    if (!access_token) {
      console.log('No access token provided');
      return res.status(400).json({ 
        success: false, 
        message: 'Google access token is required' 
      });
    }

    console.log('Verifying Google token...');
    // Verify Google token and get user info
    let googleUser;
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
      if (!response.ok) {
        console.log('Google token verification failed:', response.status, response.statusText);
        throw new Error('Failed to verify Google token');
      }
      googleUser = await response.json();
      console.log('Google user info:', googleUser);
    } catch (error) {
      console.error('Google token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google access token'
      });
    }

    const { email, given_name: firstName, family_name: lastName, sub: googleId, picture: avatarUrl } = googleUser;

    if (!email || !googleId) {
      console.log('Missing email or Google ID:', { email, googleId });
      return res.status(400).json({ 
        success: false, 
        message: 'Email and Google ID are required' 
      });
    }

    console.log('Finding or creating user...');
    // Find or create user
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      console.log('Existing user found:', user._id);
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
      }
      // Update avatar if provided
      if (avatarUrl && !user.avatarUrl) {
        user.avatarUrl = avatarUrl;
      }
      // Mark email as verified for Google users
      if (!user.emailVerified) {
        user.emailVerified = true;
      }
      user.lastLogin = new Date();
      await user.save();
    } else {
      console.log('Creating new user...');
      // Create new user
      user = new User({
        email,
        firstName: firstName || email.split('@')[0],
        lastName: lastName || '',
        googleId,
        avatarUrl,
        emailVerified: true, // Google emails are pre-verified
        password: crypto.randomBytes(32).toString('hex'), // Random password for Google users
        role: role || 'user'
      });
      await user.save();
      console.log('New user created:', user._id);
    }

    // Check if account is active
    if (!user.isActive) {
      console.log('User account is suspended:', user._id);
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
        code: 'ACCOUNT_SUSPENDED'
      });
    }

    console.log('Generating tokens...');
    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id, req.ip);

    console.log('Google OAuth successful for user:', user._id);
    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
          avatarUrl: user.avatarUrl
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        user: user
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
