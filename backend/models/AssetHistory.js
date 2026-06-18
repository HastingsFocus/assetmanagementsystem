import mongoose from "mongoose";

const assetHistorySchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "created",
        "assigned",
        "transferred",
        "maintenance",
        "returned",
        "disposed",
        "lost",
        "updated",

        // condition workflow
        "condition_change_requested",
        "condition_updated",
        "condition_request_rejected",

        "transfer_requested",
    "transfer_approved",
    "transfer_rejected",
      ],
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    previousDepartment: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Department",
  default: null,
},

    newDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    previousStatus: {
      type: String,
      default: null,
    },

    newStatus: {
      type: String,
      default: null,
    },

    previousCondition: {
      type: String,
      default: null,
    },

    newCondition: {
      type: String,
      default: null,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


const AssetHistory = mongoose.model(
  "AssetHistory",
  assetHistorySchema
);


export default AssetHistory;