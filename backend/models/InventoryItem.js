import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    // 🔥 UNIQUE TAG (KEY FEATURE)
    assetTag: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },

    unitPrice: {
      type: Number,
      default: 0
    },

    department: {
  type: String,
  required: true,
  index: true
},
inventoryAdded: {
  type: Boolean,
  default: false,
},

    sourceRequisition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requisition"
    },

    status: {
      type: String,
      enum: ["available", "in-use", "damaged", "disposed"],
      default: "available"
    },

    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

  },
  { timestamps: true }
);

export default mongoose.model("InventoryItem", inventoryItemSchema);