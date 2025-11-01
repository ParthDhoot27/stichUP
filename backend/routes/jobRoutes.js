import express from "express";
import { body, param, query, validationResult } from "express-validator";
import Job from "../models/job.js";
import Tailor from "../models/tailors.js";
import User from "../models/user.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Create job (authenticated user)
router.post(
  "/",
  authenticate,
  [
    body("tailorId").isMongoId().withMessage("Valid tailor ID required"),
    body("workType").isIn(["light", "heavy"]).withMessage("Work type must be 'light' or 'heavy'"),
    body("specialInstructions").optional().trim().isLength({ max: 500 }),
    body("deliveryAddress").optional().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tailorId, workType, specialInstructions, deliveryAddress } = req.body;

      const tailor = await Tailor.findById(tailorId);
      if (!tailor) {
        return res.status(404).json({ message: "Tailor not found" });
      }

      if (!tailor.isAvailable) {
        return res.status(400).json({ message: "Tailor is not available" });
      }

      const avgTime = workType === "heavy" ? tailor.services.heavyAvgMins : tailor.services.lightAvgMins;
      const estimated = (tailor.waitingListCount || 0) * avgTime + avgTime;

      const job = await Job.create({
        userId: req.userId,
        userEmail: req.user.email || "",
        tailor: tailorId,
        workType,
        estimatedMinutes: estimated,
        specialInstructions,
        deliveryAddress,
        timestamps: {
          requestedAt: new Date()
        }
      });

      // Increment waiting list
      await tailor.incrementWaitingList();

      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Get job
router.get(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid job ID")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const job = await Job.findById(req.params.id)
        .populate("tailor")
        .populate("userId", "name email phone");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Tailor accept job
router.post(
  "/:id/accept",
  authenticate,
  authorize("tailor", "admin"),
  [
    param("id").isMongoId().withMessage("Invalid job ID")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const job = await Job.findById(req.params.id).populate("tailor");
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check authorization
      if (job.tailor.userId?.toString() !== req.userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to accept this job" });
      }

      if (job.status !== "requested") {
        return res.status(400).json({ message: `Job is already ${job.status}` });
      }

      await job.updateStatus("accepted");

      // Decrement waiting list
      const tailor = await Tailor.findById(job.tailor._id);
      if (tailor) {
        await tailor.decrementWaitingList();
        tailor.currentOrders = (tailor.currentOrders || 0) + 1;
        await tailor.save();
      }

      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Tailor start job
router.post(
  "/:id/start",
  authenticate,
  authorize("tailor", "admin"),
  [
    param("id").isMongoId().withMessage("Invalid job ID")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const job = await Job.findById(req.params.id).populate("tailor");
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check authorization
      if (job.tailor.userId?.toString() !== req.userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (job.status !== "accepted") {
        return res.status(400).json({ message: `Job must be accepted to start. Current status: ${job.status}` });
      }

      await job.updateStatus("in_progress");

      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Tailor finish job
router.post(
  "/:id/finish",
  authenticate,
  authorize("tailor", "admin"),
  [
    param("id").isMongoId().withMessage("Invalid job ID"),
    body("images").optional().isArray().withMessage("Images must be an array"),
    body("images.*").optional().isURL().withMessage("Each image must be a valid URL"),
    body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { images, price } = req.body;
      const job = await Job.findById(req.params.id).populate("tailor");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check authorization
      if (job.tailor.userId?.toString() !== req.userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (job.status !== "in_progress") {
        return res.status(400).json({ message: `Job must be in progress. Current status: ${job.status}` });
      }

      if (images && Array.isArray(images)) {
        job.images = [...job.images || [], ...images];
      }

      if (price !== undefined) {
        job.price = price;
      }

      await job.updateStatus("finished_by_tailor");

      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// User confirm job completion
router.post(
  "/:id/confirm",
  authenticate,
  [
    param("id").isMongoId().withMessage("Invalid job ID")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check authorization
      if (job.userId?.toString() !== req.userId && job.userEmail !== req.user.email && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (job.status !== "finished_by_tailor") {
        return res.status(400).json({ message: `Job must be finished by tailor. Current status: ${job.status}` });
      }

      await job.updateStatus("awaiting_user_confirmation");

      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Cancel job
router.post(
  "/:id/cancel",
  authenticate,
  [
    param("id").isMongoId().withMessage("Invalid job ID"),
    body("reason").optional().trim().isLength({ max: 500 })
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { reason } = req.body;
      const job = await Job.findById(req.params.id).populate("tailor");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check authorization
      let cancelledBy = null;
      if (job.userId?.toString() === req.userId || job.userEmail === req.user.email) {
        cancelledBy = "user";
      } else if (job.tailor.userId?.toString() === req.userId || req.user.role === "admin") {
        cancelledBy = "tailor";
      } else {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (["delivered", "closed", "cancelled"].includes(job.status)) {
        return res.status(400).json({ message: `Cannot cancel job with status: ${job.status}` });
      }

      job.cancellationReason = reason;
      await job.updateStatus("cancelled", cancelledBy);

      // Decrement waiting list if job was requested/accepted
      if (["requested", "accepted"].includes(job.status)) {
        const tailor = await Tailor.findById(job.tailor);
        if (tailor) {
          await tailor.decrementWaitingList();
          if (tailor.currentOrders > 0) {
            tailor.currentOrders -= 1;
            await tailor.save();
          }
        }
      }

      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// List jobs for current user
router.get("/user/me", authenticate, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {
      $or: [
        { userId: req.userId },
        { userEmail: req.user.email }
      ]
    };

    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query)
      .populate("tailor", "name shopPhotoUrl address rating")
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
});

// List jobs for a user by email (backward compatibility)
router.get(
  "/user/:email",
  [
    param("email").isEmail().normalizeEmail().withMessage("Valid email required")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status } = req.query;
      const query = { userEmail: req.params.email.toLowerCase() };

      if (status) {
        query.status = status;
      }

      const jobs = await Job.find(query)
        .populate("tailor")
        .sort({ createdAt: -1 });

      res.json(jobs);
    } catch (error) {
      next(error);
    }
  }
);

// List jobs for a tailor
router.get(
  "/tailor/:id",
  authenticate,
  [
    param("id").isMongoId().withMessage("Invalid tailor ID")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status, page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Check authorization - tailor can only see their own jobs
      const tailor = await Tailor.findById(req.params.id);
      if (!tailor) {
        return res.status(404).json({ message: "Tailor not found" });
      }

      if (tailor.userId?.toString() !== req.userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const query = { tailor: req.params.id };
      if (status) {
        query.status = status;
      }

      const jobs = await Job.find(query)
        .populate("userId", "name email phone")
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

// Add a message to a job
router.post(
  "/:id/message",
  authenticate,
  [
    param("id").isMongoId().withMessage("Invalid job ID"),
    body("text").trim().notEmpty().isLength({ max: 1000 }).withMessage("Message text is required (max 1000 chars)")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { text } = req.body;
      const job = await Job.findById(req.params.id).populate("tailor");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Determine sender
      let sender = null;
      if (job.userId?.toString() === req.userId || job.userEmail === req.user.email) {
        sender = "user";
      } else if (job.tailor.userId?.toString() === req.userId || req.user.role === "admin") {
        sender = "tailor";
      } else {
        return res.status(403).json({ message: "Not authorized to message this job" });
      }

      await job.addMessage(sender, text);

      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Add an image/url to a job
router.post(
  "/:id/image",
  authenticate,
  [
    param("id").isMongoId().withMessage("Invalid job ID"),
    body("url").isURL().withMessage("Valid image URL required")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { url } = req.body;
      const job = await Job.findById(req.params.id).populate("tailor");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check authorization
      const isUser = job.userId?.toString() === req.userId || job.userEmail === req.user.email;
      const isTailor = job.tailor.userId?.toString() === req.userId || req.user.role === "admin";

      if (!isUser && !isTailor) {
        return res.status(403).json({ message: "Not authorized" });
      }

      job.images.push(url);
      await job.save();

      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Rate a completed job
router.post(
  "/:id/rate",
  authenticate,
  [
    param("id").isMongoId().withMessage("Invalid job ID"),
    body("value").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment").optional().trim().isLength({ max: 500 })
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { value, comment } = req.body;
      const job = await Job.findById(req.params.id).populate("tailor");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Only user can rate their job
      if (job.userId?.toString() !== req.userId && job.userEmail !== req.user.email && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (!["delivered", "closed"].includes(job.status)) {
        return res.status(400).json({ message: "Can only rate delivered or closed jobs" });
      }

      if (job.rating?.value) {
        return res.status(400).json({ message: "Job already rated" });
      }

      await job.addRating(value, comment);

      // Update tailor's rating
      const tailor = await Tailor.findById(job.tailor);
      if (tailor) {
        await tailor.addRating(value);
        await tailor.save();
      }

      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
