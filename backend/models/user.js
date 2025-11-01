import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    trim: true 
  },
  email: { 
    type: String, 
    lowercase: true,
    trim: true,
    index: true,
    sparse: true // Allow multiple null values
  },
  phone: { 
    type: String, 
    required: true,
    unique: true,
    index: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: "Phone must be 10-15 digits"
    }
  },
  password: { 
    type: String,
    select: false // Don't include password in queries by default
  },
  role: { 
    type: String, 
    enum: ['user', 'tailor', 'admin'], 
    default: 'user',
    index: true
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
  credits: { 
    type: Number, 
    default: 0,
    min: 0
  },
  creditsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  creditLimit: {
    type: Number,
    default: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String
  },
  lastLogin: {
    type: Date
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ location: '2dsphere' });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Virtual for remaining credits
userSchema.virtual('remainingCredits').get(function() {
  return Math.max(0, this.creditLimit - (this.creditsUsed || 0));
});

// Method to check if user can use credits
userSchema.methods.canUseCredits = function(amount = 1) {
  return (this.creditsUsed || 0) + amount <= (this.creditLimit || 100);
};

// Method to use credits
userSchema.methods.useCredits = async function(amount = 1) {
  if (!this.canUseCredits(amount)) {
    throw new Error("Credit limit reached");
  }
  this.creditsUsed = (this.creditsUsed || 0) + amount;
  await this.save();
  return this;
};

export default mongoose.model('User', userSchema);
