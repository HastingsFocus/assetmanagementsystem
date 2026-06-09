import express from "express";

import {
  receiveGoods,
  getAllInventory,
  getDepartmentInventory,
  getInventoryByTag,
  updateInventoryStatus
} from "../controllers/inventoryController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/receive/:id",
  protect,
  receiveGoods
);

router.get("/", protect, getAllInventory);

router.get(
  "/department/:department",
  protect,
  getDepartmentInventory
);

router.get(
  "/tag/:assetTag",
  protect,
  getInventoryByTag
);

router.patch(
  "/status/:id",
  protect,
  updateInventoryStatus
);

export default router;