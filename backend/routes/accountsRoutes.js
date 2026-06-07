import express from "express";
import { releaseFunds } from "../controllers/accountsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
========================================
RELEASE FUNDS
========================================
*/
router.put(
  "/release-funds/:id",
  protect,
  releaseFunds
);

export default router;