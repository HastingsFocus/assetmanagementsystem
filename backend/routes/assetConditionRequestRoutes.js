import express from "express";

import {
  createConditionRequest,
  getConditionRequests,
  getConditionRequestById,
  approveConditionRequest,
  rejectConditionRequest,
  getMyConditionRequests,
} from "../controllers/assetConditionRequestController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/asset/:assetId", protect, createConditionRequest);


router.get("/my-requests", protect, getMyConditionRequests );


router.get( "/", protect, getConditionRequests);


router.get( "/:id", protect, getConditionRequestById);


router.put(  "/:id/approve", protect, approveConditionRequest);


router.put("/:id/reject", protect, rejectConditionRequest);

export default router;