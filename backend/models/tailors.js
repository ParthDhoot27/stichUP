import mongoose from "mongoose";

const tailorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    lowercase: true,
    trim: true,
    sparse: true
  },
  phone: { 
    type: String,
    trim: true,
    index: true,
    validate: {
      validator: function(v) {
        return !v || /^[0-9]{10,15}$/.test(v);
      },
      message: "Phone must be 10-15 digits"
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  shopPhotoUrl: { 
    type: String 
  },
  address: { 
    type: String,
    trim: true
  },
  location: {
    type: { 
      type: String, 
      enum: ['Point'], 
      default: 'Point' 
    },
    coordinates: { 
      type: [Number], 
      default: [0, 0],
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: "Coordinates must be [longitude, latitude]"
      }
    }
  },
  services: {
    lightAvgMins: { 
      type: Number, 
      default: 30,
      min: 5,
      max: 1440
    },
    heavyAvgMins: { 
      type: Number, 
      default: 120,
      min: 15,
      max: 1440
    },
    availableServices: [{
      type: String,
      enum: ['stitching', 'alterations', 'custom', 'repair', 'design', 'other']
    }]
  },
  isAvailable: { 
    type: Boolean, 
    default: true,
    index: true
  },
  currentOrders: { 
    type: Number, 
    default: 0,
    min: 0
  },
  waitingListCount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  rating: { 
    type: Number, 
    default: 5,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: 0
  },
  priceRange: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 }
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  workingHours: {
    start: { type: String }, // Format: "09:00"
    end: { type: String },     // Format: "18:00"
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0
  },
  totalJobsCompleted: {
    type: Number,
    default: 0,
    min: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
tailorSchema.index({ location: '2dsphere' });
tailorSchema.index({ isAvailable: 1, rating: -1 });
tailorSchema.index({ email: 1 }, { sparse: true });
tailorSchema.index({ userId: 1 }, { sparse: true });

// Virtual for average rating calculation
tailorSchema.virtual('averageRating').get(function() {
  if (this.totalRatings === 0) return 5;
  return this.rating / this.totalRatings;
});

// Method to update rating
tailorSchema.methods.addRating = async function(newRating) {
  if (newRating < 0 || newRating > 5) {
    throw new Error("Rating must be between 0 and 5");
  }
  
  const currentTotal = (this.rating || 0) * (this.totalRatings || 0);
  this.totalRatings = (this.totalRatings || 0) + 1;
  this.rating = (currentTotal + newRating) / this.totalRatings;
  await this.save();
  return this;
};

// Method to increment waiting list
tailorSchema.methods.incrementWaitingList = async function() {
  this.waitingListCount = (this.waitingListCount || 0) + 1;
  await this.save();
  return this;
};

// Method to decrement waiting list
tailorSchema.methods.decrementWaitingList = async function() {
  if (this.waitingListCount > 0) {
    this.waitingListCount -= 1;
    await this.save();
  }
  return this;
};

export default mongoose.model('Tailor', tailorSchema);
