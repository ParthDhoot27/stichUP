import express from "express";
import { query, param, body, validationResult } from "express-validator";
import Tailor from "../models/tailors.js";
import User from "../models/user.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Search tailors near a point and return estimated time for selected type
router.get(
  "/search",
  [
    query("lat").isFloat({ min: -90, max: 90 }).withMessage("Valid latitude required"),
    query("lng").isFloat({ min: -180, max: 180 }).withMessage("Valid longitude required"),
    query("type").optional().isIn(["light", "heavy"]).withMessage("Type must be 'light' or 'heavy'"),
    query("maxDistance").optional().isInt({ min: 100 }).withMessage("Max distance must be at least 100 meters"),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { lat, lng, type = "light", maxDistance = 50000, limit = 20 } = req.query;
      const workType = type === "heavy" ? "heavy" : "light";
      const avgField = workType === "heavy" ? "services.heavyAvgMins" : "services.lightAvgMins";

      const point = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      };

      const tailors = await Tailor.aggregate([
        {
          $geoNear: {
            near: point,
            distanceField: "dist.calculated",
            spherical: true,
            maxDistance: parseInt(maxDistance),
            query: { isAvailable: true }, // Only available tailors
            limit: parseInt(limit)
          }
        },
        {
          $addFields: {
            avgTime: { $ifNull: [`$${avgField}`, 60] }
          }
        },
        {
          $sort: { "dist.calculated": 1 } // Sort by distance
        }
      ]);

      // Compute estimated time = (waitingListCount * avgTime) + avgTime
      const list = tailors.map(t => ({
        id: t._id,
        name: t.name,
        email: t.email,
        phone: t.phone,
        shopPhotoUrl: t.shopPhotoUrl,
        address: t.address,
        isAvailable: t.isAvailable,
        waitingListCount: t.waitingListCount || 0,
        estimatedMinutes: (t.waitingListCount || 0) * (t.avgTime || 60) + (t.avgTime || 60),
        distanceMeters: Math.round(t.dist?.calculated || 0),
        distanceKm: Math.round((t.dist?.calculated || 0) / 1000 * 100) / 100,
        rating: t.rating || 5,
        totalRatings: t.totalRatings || 0,
        priceRange: t.priceRange,
        description: t.description,
        services: t.services?.availableServices || []
      }));

      res.json(list);
    } catch (error) {
      next(error);
    }
  }
);

// Get tailor profile
router.get(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid tailor ID")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tailor = await Tailor.findById(req.params.id);
      if (!tailor) {
        return res.status(404).json({ message: "Tailor not found" });
      }

      res.json(tailor);
    } catch (error) {
      next(error);
    }
  }
);

// Create or update tailor profile (authenticated)
router.post(
  "/profile",
  authenticate,
  authorize("tailor", "admin"),
  [
    body("name").notEmpty().trim().withMessage("Name is required"),
    body("address").optional().trim(),
    body("location.lat").optional().isFloat({ min: -90, max: 90 }),
    body("location.lng").optional().isFloat({ min: -180, max: 180 }),
    body("shopPhotoUrl").optional().isURL(),
    body("services.lightAvgMins").optional().isInt({ min: 5, max: 1440 }),
    body("services.heavyAvgMins").optional().isInt({ min: 15, max: 1440 }),
    body("description").optional().trim().isLength({ max: 1000 })
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        address,
        location,
        shopPhotoUrl,
        services,
        description,
        priceRange,
        workingHours
      } = req.body;

      // Check if tailor already exists for this user
      let tailor = await Tailor.findOne({ userId: req.userId });

      if (tailor) {
        // Update existing tailor
        if (name) tailor.name = name;
        if (address !== undefined) tailor.address = address;
        if (shopPhotoUrl) tailor.shopPhotoUrl = shopPhotoUrl;
        if (description !== undefined) tailor.description = description;
        if (services) {
          if (services.lightAvgMins) tailor.services.lightAvgMins = services.lightAvgMins;
          if (services.heavyAvgMins) tailor.services.heavyAvgMins = services.heavyAvgMins;
          if (services.availableServices) tailor.services.availableServices = services.availableServices;
        }
        if (priceRange) tailor.priceRange = priceRange;
        if (workingHours) tailor.workingHours = workingHours;

        if (location && location.lat && location.lng) {
          tailor.location = {
            type: "Point",
            coordinates: [parseFloat(location.lng), parseFloat(location.lat)]
          };
        }

        await tailor.save();
      } else {
        // Create new tailor
        const user = await User.findById(req.userId);
        tailor = await Tailor.create({
          userId: req.userId,
          name: name || user?.name,
          email: user?.email,
          phone: user?.phone,
          address,
          shopPhotoUrl,
          services: services || { lightAvgMins: 30, heavyAvgMins: 120 },
          description,
          priceRange,
          workingHours,
          location: location && location.lat && location.lng
            ? {
                type: "Point",
                coordinates: [parseFloat(location.lng), parseFloat(location.lat)]
              }
            : undefined
        });
      }

      res.json(tailor);
    } catch (error) {
      next(error);
    }
  }
);

// Update tailor availability
router.put(
  "/:id/availability",
  authenticate,
  authorize("tailor", "admin"),
  [
    param("id").isMongoId().withMessage("Invalid tailor ID"),
    body("isAvailable").isBoolean().withMessage("isAvailable must be a boolean")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tailor = await Tailor.findById(req.params.id);
      if (!tailor) {
        return res.status(404).json({ message: "Tailor not found" });
      }

      // Check authorization (own profile or admin)
      if (tailor.userId?.toString() !== req.userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      tailor.isAvailable = req.body.isAvailable;
      await tailor.save();

      res.json(tailor);
    } catch (error) {
      next(error);
    }
  }
);

// List all tailors (admin only or public with filters)
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 50, isAvailable, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (isAvailable !== undefined) query.isAvailable = isAvailable === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
      ];
    }

    const tailors = await Tailor.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ rating: -1, createdAt: -1 });

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
});

export default router;
