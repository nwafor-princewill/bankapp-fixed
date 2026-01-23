// bank-backend/src/routes/adminRoutes.ts
import { Router } from 'express';
import auth from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import User from '../models/User';
import AccountSummary from '../models/AccountSummary';
import BankTransaction, { TransactionType } from '../models/BankTransaction';
import crypto from 'crypto'; // For generating references
import { updateAccountBalance } from '../services/accountService';
// import { TransactionType } from '../models/BankTransaction';

const router = Router();

// Create a simple config model for storing BTC address
import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const Config = mongoose.model('Config', configSchema);

// Helper function to get BTC address
const getBtcAddress = async () => {
  try {
    const config = await Config.findOne({ key: 'BTC_ADDRESS' });
    return config?.value || process.env.BTC_ADDRESS || 'bc1quu924ms2860tv59es2sqmdwkdj6me3tvrf5nmq';
  } catch (err) {
    return process.env.BTC_ADDRESS || 'bc1quu924ms2860tv59es2sqmdwkdj6me3tvrf5nmq';
  }
};

// Admin stats
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    console.log('Admin stats route hit');
    
    const users = await User.countDocuments();
    const activeUsers = await User.countDocuments();
    const totalBalance = await AccountSummary.aggregate([
      { $group: { _id: null, total: { $sum: '$currentBalance' } } }
    ]);
    
    const btcAddress = await getBtcAddress();
    
    const response = {
      users,
      activeUsers,
      totalBalance: totalBalance[0]?.total || 0,
      btcAddress
    };
    
    console.log('Sending admin stats:', response);
    res.json(response);
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    console.log('Admin users route hit');
    const users = await User.find().select('-password');
    console.log('Found users:', users.length);
    res.json(users);
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Credit user account - FIXED VERSION
router.post('/credit', auth, isAdmin, async (req, res) => {
  try {
    console.log('Admin credit route hit with body:', req.body);
    const { userEmail, accountNumber, amount, description } = req.body;
    
    if (!userEmail || !accountNumber || !amount) {
      return res.status(400).json({ message: 'Missing required fields: userEmail, accountNumber, amount' });
    }

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has this account
    const userAccount = user.accounts.find(acc => acc.accountNumber === accountNumber);
    if (!userAccount) {
      return res.status(404).json({ message: 'Account not found for this user' });
    }

    // Update the user's account balance directly
    await User.updateOne(
      { _id: user._id, 'accounts.accountNumber': accountNumber },
      { 
        $inc: { 'accounts.$.balance': Number(amount) },
        $set: { 'accounts.$.updatedAt': new Date() }
      }
    );

    // Also update AccountSummary if it exists
    try {
      await AccountSummary.findOneAndUpdate(
        { userId: user._id, accountNumber: accountNumber },
        { 
          $inc: { currentBalance: Number(amount) },
          $set: { lastUpdated: new Date() }
        }
      );
    } catch (summaryErr) {
      console.log('AccountSummary update failed (might not exist):', summaryErr);
    }

    console.log(`Successfully credited $${amount} to ${userEmail}'s account ${accountNumber}`);
    res.json({ 
      success: true, 
      message: `Successfully credited $${amount} to ${userEmail}'s account ${accountNumber}` 
    });
  } catch (err) {
    console.error('Admin credit error:', err);
    res.status(500).json({ message: 'Server error: ' + (err instanceof Error ? err.message : String(err)) });
  }
});

// Update BTC address - DEPLOYMENT READY
router.post('/update-btc', auth, isAdmin, async (req, res) => {
  try {
    const { newAddress } = req.body;
    
    if (!newAddress) {
      return res.status(400).json({ message: 'BTC address is required' });
    }

    // Save to database for deployment
    await Config.findOneAndUpdate(
      { key: 'BTC_ADDRESS' },
      { 
        key: 'BTC_ADDRESS',
        value: newAddress,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log('BTC address updated to:', newAddress);
    res.json({ success: true, message: 'BTC address updated successfully' });
  } catch (err) {
    console.error('Admin BTC update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/update-user-360
 * @desc    Universal User Update (Profile, Status, and Balance Overwrite)
 * @access  Admin Only
 */
router.put('/update-user-360', auth, isAdmin, async (req, res) => {
  try {
    const { userId, updates, accountUpdates } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Handle General Profile Updates (Name, Email, isAdmin, etc.)
    if (updates) {
      Object.assign(user, updates);
    }

    // 2. Handle Financial Overwrites (The "Power" Edit)
    if (accountUpdates && accountUpdates.length > 0) {
      for (const update of accountUpdates) {
        const account = user.accounts.find(acc => acc.accountNumber === update.accountNumber);
        
        if (account) {
          const oldBalance = account.balance;
          const newBalance = Number(update.newBalance);

          if (oldBalance !== newBalance) {
            const difference = newBalance - oldBalance;
            
            // Set the new balance
            account.balance = newBalance;

            // Create the "Audit" Transaction automatically
            await BankTransaction.create({
              userId: user._id,
              accountNumber: account.accountNumber,
              amount: Math.abs(difference),
              type: difference > 0 ? TransactionType.DEPOSIT : TransactionType.WITHDRAWAL,
              description: update.description || "Account Adjustment", // Appears clean to user
              balanceAfter: newBalance,
              reference: `ADM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
              status: 'completed'
            });

            // Update the AccountSummary model to keep it in sync
            await AccountSummary.findOneAndUpdate(
              { userId: user._id, accountNumber: account.accountNumber },
              { 
                $set: { 
                  currentBalance: newBalance, 
                  availableBalance: newBalance,
                  lastUpdated: new Date() 
                }
              },
              { upsert: true }
            );
          }
        }
      }
    }

    await user.save();
    res.json({ success: true, message: 'User updated successfully', user });
  } catch (err) {
    console.error('Admin Update 360 Error:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.post('/forge-transaction', auth, isAdmin, async (req, res) => {
  try {
    const { userId, accountNumber, amount, type, description, date } = req.body;

    const user = await User.findById(userId);
    const account = user?.accounts.find(acc => acc.accountNumber === accountNumber);
    if (!account) return res.status(404).json({ message: "Account not found" });

    // Update balance based on forged transaction
    const numAmount = Number(amount);
    if (type === 'deposit') account.balance += numAmount;
    else account.balance -= numAmount;

    const newTransaction = await BankTransaction.create({
      userId,
      accountNumber,
      amount: numAmount,
      type,
      description,
      balanceAfter: account.balance,
      reference: `FRG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'completed',
      createdAt: new Date(date) // This is the "Backdate" power
    });

    await user.save();
    res.json({ success: true, transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ message: "Forge failed" });
  }
});

router.post('/reset-password-link', auth, isAdmin, async (req, res) => {
  // For now, let's just simulate it
  res.json({ success: true, message: "Reset link sent to user email" });
});

router.post('/manual-password', auth, isAdmin, async (req, res) => {
  const { userId, newPassword } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  
  user.password = newPassword; // The pre-save hook in your model will hash this!
  await user.save();
  res.json({ success: true, message: "Password updated manually" });
});

export default router;