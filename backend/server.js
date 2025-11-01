import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import tailorRoutes from "./routes/tailorRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// MongoDB connection with improved error handling
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stichUP";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected to", MONGO_URI);
    console.log("🚀 Server running on http://localhost:" + (process.env.PORT || 5000));
    console.log("📡 MongoDB:", MONGO_URI);
    console.log("✅ Backend is ready! Waiting for requests...");
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tailors", tailorRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n🔗 Available endpoints:`);
    console.log(`   GET  /api/auth/health`);
    console.log(`   POST /api/auth/signup`);
    console.log(`   POST /api/auth/login`);
    console.log(`   POST /api/auth/verify-otp`);
    console.log(`   GET  /api/tailors/search`);
    console.log(`   GET  /api/jobs/user/:email`);
    console.log(`   GET  /api/admin/metrics\n`);
  }
});
