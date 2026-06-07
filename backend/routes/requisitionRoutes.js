import express from "express";

import {
  createRequisition,
  getMyRequisitions,
  getAllRequisitions,
  reviewRequisition
} from "../controllers/requisitionController.js";

import { protect } from "../middleware/authMiddleware.js";
import Requisition from "../models/Requisition.js"; // ✅ ADD THIS

const router = express.Router();

/*
========================================
CREATE REQUISITION
========================================
*/
router.post("/", protect, createRequisition);

/*
========================================
MY REQUISITIONS
========================================
*/
router.get("/my", protect, getMyRequisitions);

/*
========================================
ALL REQUISITIONS
========================================
*/
router.get("/all", protect, getAllRequisitions);

/*
========================================
GET SINGLE REQUISITION (FIXED)
========================================
*/
router.get("/:id", protect, async (req, res) => {
  try {
    const requisition = await Requisition.findById(req.params.id)
      .populate("requestedBy", "name email department role")
      .populate("reviewedBy", "name email");

    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: "Requisition not found"
      });
    }

    res.status(200).json({
      success: true,
      requisition
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/*
========================================
REVIEW REQUISITION
========================================
*/
router.put("/:id/review", protect, reviewRequisition);

export default router;