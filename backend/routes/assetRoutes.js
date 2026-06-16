import express from "express";
import Asset from "../models/Asset.js";

import {
  getAssetByTag,
  getDepartmentAssets,
  updateAssetStatus,
  receiveRequisitionAssets,
  createManualAssets,
  getAssetById,
  getArchivedAssets,
} from "../controllers/assetController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
========================================
GET ALL ASSETS
========================================
*/
router.get("/", protect, async (req, res) => {
  try {
    const assets = await Asset.find()
      .populate("department")
      .populate("createdBy");

    res.status(200).json({
      success: true,
      assets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
========================================
GET ARCHIVED ASSETS
========================================
*/
router.get(
  "/archived",
  protect,
  getArchivedAssets
);

/*
========================================
GET ASSET BY TAG
========================================
*/
router.get(
  "/tag/:assetTag",
  protect,
  getAssetByTag
);

/*
========================================
GET ASSET BY ID
========================================
*/
router.get(
  "/:id",
  protect,
  getAssetById
);

/*
========================================
GET DEPARTMENT ASSETS
========================================
*/
router.get(
  "/department/:department",
  protect,
  getDepartmentAssets
);

/*
========================================
RECEIVE REQUISITION ASSETS
========================================
*/
router.post(
  "/receive/:requisitionId",
  protect,
  receiveRequisitionAssets
);

/*
========================================
CREATE MANUAL ASSET
========================================
*/
router.post(
  "/manual",
  protect,
  createManualAssets
);

/*
========================================
UPDATE ASSET STATUS
========================================
*/
router.put(
  "/:id/status",
  protect,
  updateAssetStatus
);

export default router;