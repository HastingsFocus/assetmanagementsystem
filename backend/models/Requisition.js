import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  // Quantity approved by Admin/Principal
  approvedQuantity: {
    type: Number,
    default: 0
  },

  unitPrice: {
    type: Number,
    required: true
  },

  description: {
    type: String
  },

  // quantity * unitPrice
  total: {
    type: Number
  },

  status: {
    type: String,
    enum: [
      "PENDING",
      "APPROVED",
      "PARTIALLY_APPROVED",
      "REJECTED"
    ],
    default: "PENDING"
  },

  adminComment: {
    type: String
  }
});

const requisitionSchema = new mongoose.Schema({
  requisitionId: {
    type: String,
    unique: true
  },

  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  department: {
    type: String,
    required: true
  },

  items: [itemSchema],

  totalAmount: {
    type: Number,
    default: 0
  },

  status: {
  type: String,
  enum: [
    "PENDING",     // Waiting for Principal
    "APPROVED",    // Approved by Principal
    "FUNDED",      // Accounts released funds
    "PURCHASED",   // Items have been bought
    "COMPLETED",   // Items received and assigned
    "REJECTED"     // Rejected by Principal
  ],
  default: "PENDING"
},

fundedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

fundedAt: {
  type: Date
},

purchasedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

purchasedAt: {
  type: Date
},

completedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

completedAt: {
  type: Date
},

  priority: {
    type: String,
    enum: [
      "LOW",
      "MEDIUM",
      "HIGH",
      "CRITICAL"
    ],
    default: "LOW"
  },

  principalComment: {
    type: String
  },

  // Who reviewed the requisition
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // Date reviewed
  reviewedAt: {
    type: Date
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model(
  "Requisition",
  requisitionSchema
);