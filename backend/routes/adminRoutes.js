import express from 'express';
import { query, validationResult } from 'express-validator';
import Tailor from '../models/tailors.js';
import Job from '../models/job.js';
import User from '../models/user.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Get dashboard metrics
router.get('/metrics', async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalTailors,
      totalUsers,
      totalJobs,
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      activeTailors,
      completedJobs,
      pendingJobs
    ] = await Promise.all([
      Tailor.countDocuments(),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Job.countDocuments(),
      Job.countDocuments({ createdAt: { $gte: today } }),
      Job.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      Job.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      Tailor.countDocuments({ isAvailable: true }),
      Job.countDocuments({ status: 'closed' }),
      Job.countDocuments({ status: { $in: ['requested', 'accepted', 'in_progress'] } })
    ]);

    // Calculate revenue (sum of all paid job prices)
    const revenueData = await Job.aggregate([
      { $match: { paymentStatus: 'paid', price: { $exists: true } } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Calculate today's revenue
    const todayRevenueData = await Job.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          price: { $exists: true },
          createdAt: { $gte: today }
        }
      },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const revenueToday = todayRevenueData.length > 0 ? todayRevenueData[0].total : 0;

    res.json({
      totalTailors,
      activeTailors,
      totalUsers,
      totalJobs,
      completedJobs,
      pendingJobs,
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      totalRevenue,
      revenueToday
    });
  } catch (error) {
    next(error);
  }
});

// List all tailors with pagination and filters
router.get(
  '/tailors',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('isAvailable').optional().isBoolean(),
    query('search').optional().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { page = 1, limit = 50, isAvailable, search } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const query = {};
      if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ];
      }

      const tailors = await Tailor.find(query)
        .populate('userId', 'name email phone')
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await Tailor.countDocuments(query);

      res.json({
        tailors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// List all jobs with pagination and filters
router.get(
  '/jobs',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('status').optional().isIn([
      'requested',
      'accepted',
      'in_progress',
      'finished_by_tailor',
      'awaiting_user_confirmation',
      'rider_assigned',
      'delivered',
      'closed',
      'cancelled'
    ]),
    query('workType').optional().isIn(['light', 'heavy'])
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { page = 1, limit = 50, status, workType } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const query = {};
      if (status) query.status = status;
      if (workType) query.workType = workType;

      const jobs = await Job.find(query)
        .populate('tailor', 'name email phone')
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      const total = await Job.countDocuments(query);

      res.json({
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// List all users (admin already has this in userRoutes, but keeping for consistency)
router.get(
  '/users',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('role').optional().isIn(['user', 'tailor', 'admin']),
    query('search').optional().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { page = 1, limit = 50, role, search } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const query = {};
      if (role) query.role = role;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .select('-password')
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.json({
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update tailor verification status
router.put(
  '/tailors/:id/verify',
  async (req, res, next) => {
    try {
      const tailor = await Tailor.findById(req.params.id);
      if (!tailor) {
        return res.status(404).json({ message: 'Tailor not found' });
      }

      tailor.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : true;
      await tailor.save();

      res.json(tailor);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

