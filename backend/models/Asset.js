import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    assetName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    serialNumber: {
      type: String,
      default: "",
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    model: {
      type: String,
      default: "",
      trim: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    department: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Department",
  required: true,
},

    source: {
      type: String,
      enum: [
        "requisition",
        "donation",
        "purchase",
        "transfer",
        "other",
      ],
      required: true,
    },

    requisitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requisition",
      default: null,
    },

    status: {
  type: String,
  enum: [
    "in_store",
    "assigned",
    "maintenance",
    "archived",
    "disposed",
    "lost",
  ],
  default: "in_store",
},
archivedDate: {
  type: Date,
  default: null,
},

    condition: {
      type: String,
      enum: [
        "excellent",
        "good",
        "fair",
        "poor",
        "unserviceable",
      ],
      default: "excellent",
    },

    purchasePrice: {
      type: Number,
      default: 0,
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    assignedDate: {
      type: Date,
      default: Date.now,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    archiveRequested: {
      type: Boolean,
      default: false,
    },

    archiveRequestedAt: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;