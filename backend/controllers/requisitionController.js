import Requisition from "../models/Requisition.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";

import {
  getPrincipal,
  getAccountsUsers
} from "../utils/userHelpers.js";

/* 
========================================================
CREATE REQUISITION (HOD)
========================================================
*/
export const createRequisition = async (req, res) => {
  try {
    const { department, priority, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required"
      });
    }

    let totalAmount = 0;

    const processedItems = items
      .filter(item => item.name && item.quantity && item.unitPrice)
      .map(item => {
        const total = item.quantity * item.unitPrice;
        totalAmount += total;

        return {
          ...item,
          total,
          status: "PENDING"
        };
      });

    const requisition = await Requisition.create({
      requisitionId: `REQ-${Date.now()}`,
      requestedBy: req.user.id,
      department,
      priority,
      items: processedItems,
      totalAmount
    });

    const populated = await Requisition.findById(requisition._id)
      .populate("requestedBy", "name email role department");

    const principal = await getPrincipal();

    if (principal) {
      await Notification.create({
        user: principal._id,
        title: "New Requisition Submitted",
        message: `${req.user.name} submitted a requisition for approval.`,
        type: "REQUISITION_CREATED",
        relatedId: requisition._id
      });

      await sendEmail({
        to: principal.email,
        subject: "New Requisition Submitted",
        html: `
          <h2>New Requisition</h2>
          <p>${req.user.name} submitted a new requisition.</p>
          <p>Please review it in the system.</p>
        `
      });
    }

    const io = req.app.get("io");

    if (io && principal) {
      io.emit("requisitionCreated", populated);

      io.to(principal._id.toString()).emit("notificationCreated", {
        title: "New Requisition",
        message: "A new requisition needs your approval"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Requisition created successfully",
      requisition: populated
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* 
========================================================
HOD - GET MY REQUISITIONS
========================================================
*/
export const getMyRequisitions = async (req, res) => {
  try {
    const requisitions = await Requisition.find({
      requestedBy: req.user.id
    })
      .populate("requestedBy", "name email department role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requisitions.length,
      requisitions
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* 
========================================================
PRINCIPAL / ADMIN - GET ALL REQUISITIONS
========================================================
*/
export const getAllRequisitions = async (req, res) => {
  try {
    const requisitions = await Requisition.find()
      .populate("requestedBy", "name email department role")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requisitions.length,
      requisitions
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* 
========================================================
REVIEW REQUISITION (PRINCIPAL)
========================================================
*/
export const reviewRequisition = async (req, res) => {
  try {
    const { items, principalComment } = req.body;

    const requisition = await Requisition.findById(req.params.id);

    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: "Requisition not found"
      });
    }

    let approved = 0;
    let rejected = 0;

    requisition.items.forEach((item) => {
      const review = items.find(
        (i) => i._id === item._id.toString()
      );

      if (!review) return;

      item.approvedQuantity = review.approvedQuantity;
      item.status = review.status;
      item.adminComment = review.adminComment || "";

      if (review.status === "APPROVED") approved++;
      if (review.status === "REJECTED") rejected++;
    });

    /* =========================
       SET OVERALL STATUS
    ========================= */
    if (approved === requisition.items.length) {
      requisition.status = "APPROVED";
    } else if (rejected === requisition.items.length) {
      requisition.status = "REJECTED";
    } else {
      requisition.status = "PROCESSING";
    }

    requisition.principalComment = principalComment;
    requisition.reviewedBy = req.user.id;
    requisition.reviewedAt = new Date();

    await requisition.save();

    const updated = await Requisition.findById(requisition._id)
      .populate("requestedBy", "name email department role")
      .populate("reviewedBy", "name email");

    const hod = await User.findById(requisition.requestedBy);

    const io = req.app.get("io");

    /* =========================
       1. NOTIFY HOD (DB + EMAIL + SOCKET)
    ========================= */
    if (hod) {
      await Notification.create({
        user: hod._id,
        title: "Requisition Reviewed",
        message: `Your requisition is ${requisition.status}`,
        type:
          requisition.status === "APPROVED"
            ? "REQUISITION_APPROVED"
            : "REQUISITION_REJECTED",
        relatedId: requisition._id
      });

      await sendEmail({
        to: hod.email,
        subject: `Requisition ${requisition.status}`,
        html: `<p>Your requisition has been ${requisition.status}</p>`
      });

      if (io) {
        io.to(hod._id.toString()).emit("notificationCreated", {
          title: "Requisition Reviewed",
          message: `Your requisition is ${requisition.status}`
        });
      }
    }

    /* =========================
       2. NOTIFY ACCOUNTS (FIXED PROPERLY)
    ========================= */

    if (requisition.status === "APPROVED") {
      const accountsUsers = await User.find({ role: "Accounts" });

      for (const acc of accountsUsers) {
        // DB notification
        await Notification.create({
          user: acc._id,
          title: "Funding Required",
          message: `Requisition ${requisition.requisitionId} approved and awaiting funding`,
          type: "REQUISITION_APPROVED",
          relatedId: requisition._id
        });

        // EMAIL
        await sendEmail({
          to: acc.email,
          subject: "Funding Required",
          html: `
            <h3>Approved Requisition</h3>
            <p>Requisition <b>${requisition.requisitionId}</b> is awaiting funding.</p>
          `
        });

        // SOCKET (IMPORTANT FIX)
        if (io) {
          io.to(acc._id.toString()).emit("notificationCreated", {
            title: "Funding Required",
            message: `Requisition ${requisition.requisitionId} needs funding`
          });
        }
      }
    }

    /* =========================
       GLOBAL UPDATE EVENT
    ========================= */
    if (io) {
      io.emit("requisitionUpdated", updated);
    }

    return res.status(200).json({
      success: true,
      message: "Requisition reviewed successfully",
      requisition: updated
    });

  } catch (error) {
    console.error("REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};