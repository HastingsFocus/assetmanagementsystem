import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        "REQUISITION_CREATED",
        "REQUISITION_APPROVED",
        "REQUISITION_REJECTED",
        "REQUISITION_UPDATED",
        "REQUISITION_FUNDED",

        "PROCUREMENT_CREATED",
        "PROCUREMENT_APPROVED",
        "PROCUREMENT_REJECTED",

        "ASSET_ASSIGNED",
        "ASSET_RETURNED",

        "MAINTENANCE_CREATED",
        "MAINTENANCE_COMPLETED",

        "SYSTEM"
      ],
      default: "SYSTEM"
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);