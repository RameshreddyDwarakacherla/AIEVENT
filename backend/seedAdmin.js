import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@ai.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('Active:', existingAdmin.isActive);
      
      // Update password if needed
      existingAdmin.password = 'Ramesh@143';
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      existingAdmin.emailVerified = true;
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully');
    } else {
      // Create new admin user
      const admin = new User({
        email: 'admin@ai.com',
        password: 'Ramesh@143',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        emailVerified: true,
        isActive: true
      });

      await admin.save();
      console.log('✅ Admin user created successfully');
      console.log('Email: admin@ai.com');
      console.log('Password: Ramesh@143');
    }

    // Also create vendor test user if needed
    const existingVendor = await User.findOne({ email: 'vendor@test.com' });
    if (!existingVendor) {
      const vendor = new User({
        email: 'vendor@test.com',
        password: 'Vendor@123',
        firstName: 'Test',
        lastName: 'Vendor',
        role: 'vendor',
        emailVerified: true,
        isActive: true
      });
      await vendor.save();
      console.log('✅ Vendor user created successfully');
      console.log('Email: vendor@test.com');
      console.log('Password: Vendor@123');
    }

    // Create regular user if needed
    const existingUser = await User.findOne({ email: 'user@test.com' });
    if (!existingUser) {
      const user = new User({
        email: 'user@test.com',
        password: 'User@123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        emailVerified: true,
        isActive: true
      });
      await user.save();
      console.log('✅ Regular user created successfully');
      console.log('Email: user@test.com');
      console.log('Password: User@123');
    }

    console.log('\n📋 Summary of test accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:  admin@ai.com / Ramesh@143');
    console.log('Vendor: vendor@test.com / Vendor@123');
    console.log('User:   user@test.com / User@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
