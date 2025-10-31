import express from "express";
import Tailor from "../models/tailors.js";

const router = express.Router();

// Search tailors near a point and return estimated time for selected type
router.get("/search", async (req, res) => {
  // query params: lat, lng, type (light|heavy)
  const { lat, lng, type } = req.query;
  const workType = type === "heavy" ? "heavy" : "light";
  const avgField = workType === "heavy" ? "services.heavyAvgMins" : "services.lightAvgMins";

  // simple geoNear using $geoNear requires aggregation with a near point
  const point = {
    type: "Point",
    coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0]
  };

  const tailors = await Tailor.aggregate([
    {
      $geoNear: {
        near: point,
        distanceField: "dist.calculated",
        spherical: true,
        limit: 20
      }
    },
    {
      $addFields: {
        avgTime: { $ifNull: [ `$${avgField}`, 60 ] }
      }
    }
  ]);

  // compute estimated time = (waitingListCount * avgTime) + avgTime
  const list = tailors.map(t => ({
    id: t._id,
    name: t.name,
    isAvailable: t.isAvailable,
    waitingListCount: t.waitingListCount || 0,
    estimatedMinutes: (t.waitingListCount || 0) * (t.avgTime || 60) + (t.avgTime || 60),
    distanceMeters: t.dist?.calculated || 0,
    rating: t.rating || 5
  }));

  res.json(list);
});

// Get tailor profile
router.get("/:id", async (req, res) => {
  const t = await Tailor.findById(req.params.id);
  if (!t) return res.status(404).json({ message: "Tailor not found" });
  res.json(t);
});

export default router;
