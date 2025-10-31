import mongoose from "mongoose";

const tailorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  shopPhotoUrl: { type: String },
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  },
  services: {
    lightAvgMins: { type: Number, default: 30 },
    heavyAvgMins: { type: Number, default: 120 }
  },
  isAvailable: { type: Boolean, default: true },
  currentOrders: { type: Number, default: 0 },
  waitingListCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now }
});

// geo index
tailorSchema.index({ location: '2dsphere' });

export default mongoose.model('Tailor', tailorSchema);
