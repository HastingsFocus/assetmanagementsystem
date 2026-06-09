import express from "express";
import {
  createRequisition,
  getMyRequisitions,
  getAllRequisitions,
  reviewRequisition
} from "../controllers/requisitionController.js";

import { protect } from "../middleware/authMiddleware.js";
import Requisition from "../models/Requisition.js";

const router = express.Router();

/*
========================================
CREATE REQUISITION
========================================
POST /api/requisitions
*/
router.post("/", protect, createRequisition);

/*
========================================
GET ALL REQUISITIONS (ADMIN / PRINCIPAL)
========================================
GET /api/requisitions
*/
router.get("/", protect, getAllRequisitions);

/*
========================================
MY REQUISITIONS (HOD)
========================================
GET /api/requisitions/my
*/
router.get("/my", protect, getMyRequisitions);

/*
========================================
GET SINGLE REQUISITION
========================================
GET /api/requisitions/:id
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
PUT /api/requisitions/:id/review
========================================
*/
router.put("/:id/review", protect, reviewRequisition);

export default router;