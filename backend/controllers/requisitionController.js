import Requisition from "../models/Requisition.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

/*
|--------------------------------------------------------------------------
| CREATE REQUISITION
|--------------------------------------------------------------------------
| HOD creates a new requisition
*/

export const createRequisition = async (req, res) => {
  try {
    const {
      department,
      priority,
      items
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required"
      });
    }

    let totalAmount = 0;

    const processedItems = items
  .filter(item => item.name && item.quantity && item.unitPrice)
  .map((item) => {
    const total = item.quantity * item.unitPrice;

    totalAmount += total;

    return {
      ...item,
      total
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

    const populatedRequisition = await Requisition.findById(
      requisition._id
    ).populate(
      "requestedBy",
      "name email role department"
    );

    /*
    |--------------------------------------------------------------------------
    | NOTIFY ADMINS
    |--------------------------------------------------------------------------
    */

    const admins = await User.find({
      role: "ADMIN"
    });

    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: "New Requisition",
        message: `${req.user.name} submitted a requisition.`,
        type: "REQUISITION_CREATED"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | SOCKET EVENT
    |--------------------------------------------------------------------------
    */

    const io = req.app.get("io");

if (io) {
  io.emit("requisitionCreated", populatedRequisition);
}

    io.emit("requisitionCreated", populatedRequisition);

    io.emit("notificationCreated", {
      title: "New Requisition Submitted"
    });

    return res.status(201).json({
      success: true,
      message: "Requisition created successfully",
      requisition: populatedRequisition
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET MY REQUISITIONS
|--------------------------------------------------------------------------
| HOD views their requisitions
*/

export const getMyRequisitions = async (req, res) => {
  try {

    const requisitions = await Requisition.find({
      requestedBy: req.user.id
    })
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
|--------------------------------------------------------------------------
| GET ALL REQUISITIONS
|--------------------------------------------------------------------------
| Admin views all requisitions
*/

export const getAllRequisitions = async (req, res) => {
  try {

    const requisitions = await Requisition.find()
      .populate(
        "requestedBy",
        "name email department role"
      )
      .populate(
        "reviewedBy",
        "name email"
      )
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
|--------------------------------------------------------------------------
| REVIEW REQUISITION
|--------------------------------------------------------------------------
| Admin approves/rejects items
*/

export const reviewRequisition = async (req, res) => {
  try {

    const {
      items,
      principalComment
    } = req.body;

    const requisition = await Requisition.findById(
      req.params.id
    );

    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: "Requisition not found"
      });
    }

    let approvedItems = 0;
    let rejectedItems = 0;

    requisition.items.forEach((item) => {

      const reviewedItem = items.find(
        (i) => i._id === item._id.toString()
      );

      if (!reviewedItem) return;

      item.approvedQuantity =
        reviewedItem.approvedQuantity;

      item.status =
        reviewedItem.status;

      item.adminComment =
        reviewedItem.adminComment || "";

      if (
        reviewedItem.status === "APPROVED"
      ) {
        approvedItems++;
      }

      if (
        reviewedItem.status === "REJECTED"
      ) {
        rejectedItems++;
      }
    });

    /*
    |--------------------------------------------------------------------------
    | DETERMINE OVERALL STATUS
    |--------------------------------------------------------------------------
    */

    if (
      approvedItems === requisition.items.length
    ) {
      requisition.status = "APPROVED";
    }
    else if (
      rejectedItems === requisition.items.length
    ) {
      requisition.status = "REJECTED";
    }
    else {
      requisition.status = "PROCESSING";
    }

    requisition.principalComment =
      principalComment;

    requisition.reviewedBy =
      req.user.id;

    requisition.reviewedAt =
      new Date();

    await requisition.save();

    const updatedRequisition =
      await Requisition.findById(
        requisition._id
      )
        .populate(
          "requestedBy",
          "name email department"
        )
        .populate(
          "reviewedBy",
          "name email"
        );

    /*
    |--------------------------------------------------------------------------
    | CREATE NOTIFICATION
    |--------------------------------------------------------------------------
    */

    await Notification.create({
      user: requisition.requestedBy,
      title: "Requisition Reviewed",
      message: `Your requisition has been ${requisition.status}`,
      type:
        requisition.status === "APPROVED"
          ? "REQUISITION_APPROVED"
          : "REQUISITION_REJECTED"
    });

    /*
    |--------------------------------------------------------------------------
    | SOCKET EVENT
    |--------------------------------------------------------------------------
    */

    const io = req.app.get("io");

if (io) {
  io.emit("requisitionCreated", populatedRequisition);
}

    io.emit(
      "requisitionUpdated",
      updatedRequisition
    );

    io.to(
      requisition.requestedBy.toString()
    ).emit("notificationCreated", {
      title: "Requisition Reviewed",
      status: requisition.status
    });

    return res.status(200).json({
      success: true,
      message: "Requisition reviewed successfully",
      requisition: updatedRequisition
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};