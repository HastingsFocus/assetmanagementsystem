import mongoose from "mongoose";

const assetTransferRequestSchema =
  new mongoose.Schema(
    {
      asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        required: true,
      },

      fromDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
       },

      toDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
       },
       
      reason: {
        type: String,
        required: true,
      },

      requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

      rejectionReason: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "AssetTransferRequest",
  assetTransferRequestSchema
);