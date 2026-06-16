import express from "express";

import {
  getAllAssetHistory,
  getAssetHistory,
  getAssetHistoryByTag,
} from "../controllers/assetHistoryController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllAssetHistory);

router.get(
  "/asset/:assetId",
  protect,
  getAssetHistory
);

router.get(
  "/tag/:assetTag",
  protect,
  getAssetHistoryByTag
);

export default router;