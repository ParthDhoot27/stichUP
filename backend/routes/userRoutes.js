import express from "express";
import { body, param, validationResult } from "express-validator";
import User from "../models/user.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Get user data by email or ID
router.get(
  "/:identifier",
  [
    param("identifier").notEmpty().withMessage("User identifier required")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { identifier } = req.params;
      
      // Check if identifier is ObjectId or email
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
      const query = isObjectId 
        ? { _id: identifier }
        : { email: identifier.toLowerCase() };

      let user = await User.findOne(query).select("-password");

      if (!user) {
        // Auto-create user only if it's an email (for backward compatibility)
        if (!isObjectId) {
          user = await User.create({ email: identifier.toLowerCase() });
          const userResponse = user.toObject();
          delete userResponse.password;
          return res.json(userResponse);
        }
        return res.status(404).json({ message: "User not found" });
      }

      const userResponse = user.toObject();
      delete userResponse.password;

      res.json(userResponse);
    } catch (error) {
      next(error);
    }
  }
);

// Get current user profile (authenticated)
router.get("/profile/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put(
  "/profile",
  authenticate,
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().normalizeEmail(),
    body("address").optional().trim(),
    body("location.lat").optional().isFloat({ min: -90, max: 90 }),
    body("location.lng").optional().isFloat({ min: -180, max: 180 }),
    body("profileImage").optional().isURL()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, address, location, profileImage } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.name = name;
      if (email) {
        // Check if email is already taken
        const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
        if (existing) {
          return res.status(400).json({ message: "Email already in use" });
        }
        user.email = email.toLowerCase();
      }
      if (address !== undefined) user.address = address;
      if (profileImage) user.profileImage = profileImage;

      if (location && location.lat && location.lng) {
        user.location = {
          type: "Point",
          coordinates: [parseFloat(location.lng), parseFloat(location.lat)]
        };
      }

      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      res.json(userResponse);
    } catch (error) {
      next(error);
    }
  }
);

// Update credits
router.post(
  "/credits/use",
  authenticate,
  [
    body("amount").optional().isInt({ min: 1 }).withMessage("Amount must be a positive integer")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const amount = req.body.amount || 1;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.canUseCredits(amount)) {
        return res.status(400).json({ 
          message: "Credit limit reached",
          remainingCredits: user.remainingCredits
        });
      }

      await user.useCredits(amount);

      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({ 
        message: "Credits used successfully", 
        user: userResponse,
        remainingCredits: user.remainingCredits
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get credits info
router.get("/credits/info", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("credits creditsUsed creditLimit");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      credits: user.credits || 0,
      creditsUsed: user.creditsUsed || 0,
      creditLimit: user.creditLimit || 100,
      remainingCredits: user.remainingCredits || 0
    });
  } catch (error) {
    next(error);
  }
});

// List all users (admin only)
router.get("/", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const { page = 1, limit = 50, role, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query)
      .select("-password")
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
});

export default router;
