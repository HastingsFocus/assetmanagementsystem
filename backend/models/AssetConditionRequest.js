import mongoose from "mongoose";

const assetConditionRequestSchema =
  new mongoose.Schema(
    {
      asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        required: true,
      },

      requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      currentCondition: {
        type: String,
        required: true,
      },

      requestedCondition: {
        type: String,
        enum: [
          "excellent",
          "good",
          "fair",
          "poor",
          "unserviceable",
        ],
        required: true,
      },

      reason: {
        type: String,
        required: true,
      },

      requestArchive: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "APPROVED",
          "REJECTED",
        ],
        default: "PENDING",
      },

      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      reviewedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "AssetConditionRequest",
  assetConditionRequestSchema
);