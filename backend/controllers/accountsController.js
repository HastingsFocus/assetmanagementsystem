import Requisition from "../models/Requisition.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "../services/emailService.js";

/*
========================================
RELEASE FUNDS (ACCOUNTS)
========================================
*/
export const releaseFunds = async (req, res) => {
  try {
    const requisitionId = req.params.id;

    // 1. FIND REQUISITION
    const requisition = await Requisition.findById(requisitionId);

    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: "Requisition not found"
      });
    }

    // 2. CHECK STATUS
    if (requisition.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Only APPROVED requisitions can be funded"
      });
    }

    // 3. UPDATE REQUISITION
    requisition.status = "FUNDED";
    requisition.fundedBy = req.user.id;
    requisition.fundedAt = new Date();

    await requisition.save();

    // 4. GET USERS
    const storesUsers = await User.find({ role: "Stores" });
    const hodUser = await User.findById(requisition.requestedBy);

    // 5. NOTIFY STORES (DB NOTIFICATIONS)
    await Notification.insertMany(
      storesUsers.map((user) => ({
        user: user._id,
        title: "Funds Released",
        message: `Requisition ${requisition.requisitionId} is funded and ready for procurement.`,
        type: "REQUISITION_FUNDED",
        relatedId: requisition._id
      }))
    );

    // 6. EMAIL STORES (SAFE)
    for (const store of storesUsers) {
      await sendEmail({
        to: store.email,
        subject: "Funds Released",
        html: `
          <h3>Funds Released</h3>
          <p>Requisition <b>${requisition.requisitionId}</b> is now funded.</p>
          <p>Please proceed with procurement.</p>
        `
      });
    }

    // 7. EMAIL HOD
    if (hodUser) {
      await sendEmail({
        to: hodUser.email,
        subject: "Funds Released",
        html: `
          <p>Your requisition ${requisition.requisitionId} has been funded.</p>
        `
      });
    }

    // 8. SOCKET EVENT
    const io = req.app.get("io");

if (io) {
  io.emit("requisitionUpdated", requisition);

  io.emit("storesNotification", {
    title: "Funds Released",
    message: `Requisition ${requisition.requisitionId} funded`,
    type: "REQUISITION_FUNDED"
  });
}

    // 9. RESPONSE
    return res.status(200).json({
      success: true,
      message: "Funds released successfully",
      requisition
    });

  } catch (error) {
    console.error("🔥 GLOBAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};