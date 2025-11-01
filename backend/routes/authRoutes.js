import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/user.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Generate OTP (in production, send via SMS/Email service)
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "auth" });
});

// Signup
router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("phone")
      .trim()
      .isMobilePhone("en-IN", { strictMode: false })
      .withMessage("Valid phone number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["user", "tailor", "admin"])
      .withMessage("Invalid role")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, password, role = "user", address, location } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }]
      });

      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === email 
            ? "Email already registered" 
            : "Phone number already registered"
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Prepare location if provided
      let locationData = null;
      if (location && location.lat && location.lng) {
        locationData = {
          type: "Point",
          coordinates: [parseFloat(location.lng), parseFloat(location.lat)]
        };
      }

      // Create user
      const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        address,
        location: locationData,
        credits: 0
      });

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "devsecret",
        { expiresIn: "30d" }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        message: "User created successfully",
        user: userResponse,
        token
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          message: "Email or phone already exists"
        });
      }
      res.status(500).json({ message: error.message });
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phone, password } = req.body;

      // Find user by phone or email
      const user = await User.findOne({
        $or: [
          { phone: phone.replace(/\D/g, "") },
          { email: phone }
        ]
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid phone/email or password" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password || "");

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid phone/email or password" });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "devsecret",
        { expiresIn: "30d" }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        message: "Login successful",
        user: userResponse,
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Send OTP
router.post(
  "/send-otp",
  [
    body("phone")
      .trim()
      .isMobilePhone("en-IN", { strictMode: false })
      .withMessage("Valid phone number is required")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phone } = req.body;
      const normalizedPhone = phone.replace(/\D/g, "");

      // Generate OTP
      const otp = generateOTP();

      // Store OTP with expiration (5 minutes)
      otpStore.set(normalizedPhone, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000
      });

      // In production, send OTP via SMS service (Twilio, AWS SNS, etc.)
      console.log(`OTP for ${normalizedPhone}: ${otp}`); // Remove in production

      res.json({
        message: "OTP sent successfully",
        // In development, return OTP for testing
        ...(process.env.NODE_ENV === "development" && { otp })
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Verify OTP
router.post(
  "/verify-otp",
  [
    body("phone")
      .trim()
      .isMobilePhone("en-IN", { strictMode: false })
      .withMessage("Valid phone number is required"),
    body("otp")
      .trim()
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phone, otp } = req.body;
      const normalizedPhone = phone.replace(/\D/g, "");

      // Check if OTP exists
      const stored = otpStore.get(normalizedPhone);

      if (!stored) {
        return res.status(400).json({ message: "OTP not found. Please request a new one." });
      }

      // Check if OTP expired
      if (Date.now() > stored.expiresAt) {
        otpStore.delete(normalizedPhone);
        return res.status(400).json({ message: "OTP expired. Please request a new one." });
      }

      // Verify OTP
      if (stored.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // OTP verified, delete it
      otpStore.delete(normalizedPhone);

      // Find or create user
      let user = await User.findOne({ phone: normalizedPhone });

      if (!user) {
        // Create user with phone only (user can complete profile later)
        user = await User.create({
          phone: normalizedPhone,
          role: "user"
        });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "devsecret",
        { expiresIn: "30d" }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        message: "OTP verified successfully",
        user: userResponse,
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get current user
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update password
router.put(
  "/password",
  authenticate,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.userId);

      if (!user || !user.password) {
        return res.status(400).json({ message: "Password not set for this account" });
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Update password
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;

