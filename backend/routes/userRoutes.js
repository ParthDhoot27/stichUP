import express from "express";
import User from "../models/user.js";

const router = express.Router();

// Get user data
router.get("/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) {
    const newUser = await User.create({ email: req.params.email });
    return res.json(newUser);
  }
  res.json(user);
});

// Update credits
router.post("/update", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.creditsUsed >= user.creditLimit)
    return res.status(400).json({ message: "Credit limit reached" });

  user.creditsUsed += 1;
  await user.save();

  res.json({ message: "Credit used", user });
});

export default router;
