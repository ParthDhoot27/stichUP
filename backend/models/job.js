import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },
  userEmail: { 
    type: String, 
    required: true,
    index: true,
    lowercase: true,
    trim: true
  },
  tailor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tailor", 
    required: true,
    index: true
  },
  workType: { 
    type: String, 
    enum: ["light", "heavy"], 
    required: true,
    index: true
  },
  status: { 
    type: String, 
    enum: [
      "requested",
      "accepted",
      "in_progress",
      "finished_by_tailor",
      "awaiting_user_confirmation",
      "rider_assigned",
      "delivered",
      "closed",
      "cancelled"
    ], 
    default: "requested",
    index: true
  },
  estimatedMinutes: { 
    type: Number,
    min: 1
  },
  actualMinutes: {
    type: Number,
    min: 0
  },
  images: [{ 
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: "Image must be a valid URL"
    }
  }],
  messages: [{
    sender: {
      type: String,
      required: true,
      enum: ["user", "tailor"]
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  price: { 
    type: Number,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending"
  },
  deliveryAddress: {
    type: String,
    trim: true
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: 500
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledBy: {
    type: String,
    enum: ["user", "tailor", "admin"]
  },
  rating: {
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500
    },
    createdAt: {
      type: Date
    }
  },
  timestamps: {
    requestedAt: {
      type: Date,
      default: Date.now
    },
    acceptedAt: Date,
    startedAt: Date,
    finishedAt: Date,
    confirmedAt: Date,
    deliveredAt: Date,
    closedAt: Date,
    cancelledAt: Date
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
jobSchema.index({ userId: 1, status: 1 });
jobSchema.index({ tailor: 1, status: 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ userEmail: 1, createdAt: -1 });

// Virtual for duration calculation
jobSchema.virtual('duration').get(function() {
  if (!this.timestamps.startedAt || !this.timestamps.finishedAt) {
    return null;
  }
  return Math.round((this.timestamps.finishedAt - this.timestamps.startedAt) / 60000); // minutes
});

// Method to update status with timestamp
jobSchema.methods.updateStatus = async function(newStatus, by = null) {
  const statusMap = {
    "accepted": "acceptedAt",
    "in_progress": "startedAt",
    "finished_by_tailor": "finishedAt",
    "awaiting_user_confirmation": "confirmedAt",
    "delivered": "deliveredAt",
    "closed": "closedAt",
    "cancelled": "cancelledAt"
  };

  this.status = newStatus;
  if (statusMap[newStatus]) {
    this.timestamps[statusMap[newStatus]] = new Date();
  }

  if (newStatus === "cancelled" && by) {
    this.cancelledBy = by;
  }

  await this.save();
  return this;
};

// Method to add message
jobSchema.methods.addMessage = async function(sender, text) {
  if (!["user", "tailor"].includes(sender)) {
    throw new Error("Sender must be 'user' or 'tailor'");
  }
  
  this.messages.push({
    sender,
    text,
    createdAt: new Date()
  });
  
  await this.save();
  return this;
};

// Method to add rating
jobSchema.methods.addRating = async function(value, comment = "") {
  if (value < 1 || value > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  
  this.rating = {
    value,
    comment,
    createdAt: new Date()
  };
  
  await this.save();
  return this;
};

export default mongoose.model("Job", jobSchema);
