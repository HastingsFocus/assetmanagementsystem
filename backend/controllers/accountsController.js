import Requisition from "../models/Requisition.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

/*
========================================
RELEASE FUNDS
========================================
*/
export const releaseFunds = async (req, res) => {
  try {
    const requisition = await Requisition.findById(
      req.params.id
    );

    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: "Requisition not found"
      });
    }

    if (requisition.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message:
          "Only approved requisitions can be funded"
      });
    }

    /*
    ========================================
    UPDATE REQUISITION
    ========================================
    */
    requisition.status = "FUNDED";

    requisition.fundedBy = req.user._id;

    requisition.fundedAt = new Date();

    await requisition.save();

    /*
    ========================================
    NOTIFY STORES
    ========================================
    */
    const storesUsers = await User.find({
      role: "Stores"
    });

    for (const store of storesUsers) {
      await Notification.create({
        user: store._id,
        title: "Funds Released",
        message:
          `Requisition ${requisition.requisitionId} has been funded and is ready for procurement.`,
        type: "REQUISITION_FUNDED"
      });
    }

    res.status(200).json({
      success: true,
      message: "Funds released successfully",
      requisition
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};