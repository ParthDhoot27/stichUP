import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, index: true },
  password: { type: String }, // hashed password (bcrypt)
  role: { type: String, enum: ['user','tailor','admin'], default: 'user' },
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  credits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

export default mongoose.model('User', userSchema);
