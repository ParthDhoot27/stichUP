import express from "express";
import Job from "../models/job.js";
import Tailor from "../models/tailors.js";

const router = express.Router();

// Create job
router.post("/", async (req, res) => {
  const { userEmail, tailorId, workType } = req.body;
  const tailor = await Tailor.findById(tailorId);
  if (!tailor) return res.status(404).json({ message: "Tailor not found" });

  const avgTime = workType === "heavy" ? tailor.services.heavyAvgMins : tailor.services.lightAvgMins;
  const estimated = (tailor.waitingListCount || 0) * avgTime + avgTime;

  const job = await Job.create({ userEmail, tailor: tailorId, workType, estimatedMinutes: estimated });
  // increment waiting list
  tailor.waitingListCount = (tailor.waitingListCount || 0) + 1;
  await tailor.save();

  res.json(job);
});

// Tailor accept job
router.post("/:id/accept", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  job.status = "accepted";
  job.acceptedAt = new Date();
  await job.save();

  // decrement waiting list
  const tailor = await Tailor.findById(job.tailor);
  if (tailor && tailor.waitingListCount > 0) {
    tailor.waitingListCount -= 1;
    await tailor.save();
  }

  res.json(job);
});

// Tailor start job
router.post("/:id/start", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  job.status = "in_progress";
  job.startedAt = new Date();
  await job.save();
  res.json(job);
});

// Tailor finish job (upload images handled separately)
router.post("/:id/finish", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  job.status = "finished_by_tailor";
  job.finishedAt = new Date();
  await job.save();
  res.json(job);
});

// User confirm job
router.post("/:id/confirm", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  job.status = "rider_assigned";
  job.confirmedAt = new Date();
  await job.save();
  res.json(job);
});

// Get job
router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id).populate("tailor");
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
});

// List jobs for a user
router.get('/user/:email', async (req, res) => {
  const jobs = await Job.find({ userEmail: req.params.email }).populate('tailor').sort({ createdAt: -1 });
  res.json(jobs);
});

// List jobs for a tailor
router.get('/tailor/:id', async (req, res) => {
  const jobs = await Job.find({ tailor: req.params.id }).populate('tailor').sort({ createdAt: -1 });
  res.json(jobs);
});

// Add a message to a job
router.post('/:id/message', async (req, res) => {
  const { sender, text } = req.body;
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  job.messages.push({ sender, text, createdAt: new Date() });
  await job.save();
  res.json(job);
});

// Add an image/url to a job
router.post('/:id/image', async (req, res) => {
  const { url } = req.body;
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  job.images.push(url);
  await job.save();
  res.json(job);
});

export default router;
