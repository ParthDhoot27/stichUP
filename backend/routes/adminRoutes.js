import express from 'express'
import Tailor from '../models/tailors.js'
import Job from '../models/job.js'

const router = express.Router()

router.get('/metrics', async (req, res) => {
  const totalTailors = await Tailor.countDocuments()
  const totalUsers = await Job.distinct('userEmail').then(a=>a.length)
  const ordersToday = await Job.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } })
  const commissionToday = 0 // placeholder
  res.json({ totalTailors, totalUsers, ordersToday, commissionToday })
})

router.get('/tailors', async (req, res) => {
  const tailors = await Tailor.find().limit(200)
  res.json(tailors)
})

router.get('/jobs', async (req, res) => {
  const jobs = await Job.find().populate('tailor').sort({ createdAt: -1 }).limit(200)
  res.json(jobs)
})

export default router
