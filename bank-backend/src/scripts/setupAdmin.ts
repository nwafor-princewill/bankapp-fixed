// bank-backend/src/scripts/setupAdmin.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      // Update existing user to be admin
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log(`Updated existing user ${adminEmail} to admin`);
    } else {
      // Create new admin user
      // Note: We don't hash here because the User model has a pre-save hook that hashes it
      
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: adminPassword, // The pre-save hook in User.ts will hash this
        isAdmin: true,
        rewardPoints: 1000,
        // Provide a valid account object to satisfy validation and avoid unique null index error
        accounts: [{
            accountNumber: 'ADMIN-INTERNAL-001',
            accountName: 'Admin Main Account',
            balance: 0,
            currency: 'USD',
            openedAt: new Date()
        }],
        cryptoWallets: [],
        cards: []
      });

      await adminUser.save();
      console.log(`Created admin user: ${adminEmail}`);
    }

    console.log('Admin setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setupAdmin();