import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import { getAccountSummary } from '../services/accountService';

// Local interface for this file
interface AuthRequest extends Request {
    user?: any;
}

const router = Router();

// @route   GET /api/accounts/summary
router.get('/summary', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Add validation
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accountNumber = req.query.accountNumber as string;
    
    if (!accountNumber) {
      return res.status(400).json({ 
        success: false,
        message: 'Account number required',
        data: null
      });
    }

    const summary = await getAccountSummary(req.user.id, accountNumber);
    
    res.json({
      success: true,
      message: 'Account summary retrieved',
      data: summary
    });
    
  } catch (err) {
    console.error('Account summary error:', err);
    res.status(500).json({ 
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? err instanceof Error ? err.message : 'Server error'
        : 'Server error',
      data: null
    });
  }
});

export default router;