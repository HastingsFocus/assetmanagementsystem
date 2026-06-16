import Asset from "../models/Asset.js";
import AssetHistory from "../models/AssetHistory.js";
import AssetConditionRequest from "../models/AssetConditionRequest.js";

/*
=================================================
CREATE CONDITION CHANGE REQUEST (HOD)
=================================================
*/
export const createConditionRequest = async (req, res) => {
  try {
    const { assetId } = req.params;
    const { requestedCondition, reason, requestArchive } = req.body;

    const asset = await Asset.findById(assetId);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    const existingRequest = await AssetConditionRequest.findOne({
      asset: asset._id,
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "There is already a pending request for this asset",
      });
    }

    const request = await AssetConditionRequest.create({
      asset: asset._id,
      requestedBy: req.user._id,
      currentCondition: asset.condition,
      requestedCondition,
      reason,
      requestArchive: requestArchive || false,
      status: "PENDING",
    });

    await AssetHistory.create({
      asset: asset._id,
      action: "condition_change_requested",
      performedBy: req.user._id,
      notes: `Condition change requested from ${asset.condition} to ${requestedCondition}`,
    });

    return res.status(201).json({
      success: true,
      message: "Condition change request submitted successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
GET ALL CONDITION REQUESTS
=================================================
*/
export const getConditionRequests = async (req, res) => {
  try {
    const requests = await AssetConditionRequest.find()
      .populate("asset")
      .populate("requestedBy", "name email role")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
GET SINGLE CONDITION REQUEST
=================================================
*/
export const getConditionRequestById = async (req, res) => {
  try {
    const request = await AssetConditionRequest.findById(req.params.id)
      .populate("asset")
      .populate("requestedBy", "name email role")
      .populate("reviewedBy", "name email role");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
APPROVE CONDITION REQUEST (STORES)
=================================================
*/
export const approveConditionRequest = async (req, res) => {
  try {
    const request = await AssetConditionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    const asset = await Asset.findById(request.asset);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    const previousCondition = asset.condition;
    const previousStatus = asset.status;

   asset.condition = request.requestedCondition;

if (request.requestedCondition === "unserviceable") {
  asset.status = "archived";
  asset.archivedDate = new Date();
}

    await asset.save();

    request.status = "APPROVED";
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();

    await request.save();

    await AssetHistory.create({
  asset: asset._id,
  action: "condition_updated",
  performedBy: req.user._id,

  previousCondition,
  newCondition: request.requestedCondition,

  previousStatus,
  newStatus: asset.status,

  notes: `Condition changed from ${previousCondition} to ${request.requestedCondition}`,
});

    return res.status(200).json({
      success: true,
      message: "Condition request approved successfully",
      asset,
      request,
    });
  } catch (error) {
  console.error("🔥 APPROVE CONDITION REQUEST ERROR:");
  console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
};

/*
=================================================
REJECT CONDITION REQUEST (STORES)
=================================================
*/
export const rejectConditionRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const request = await AssetConditionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    request.status = "REJECTED";
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    request.rejectionReason = rejectionReason || "";

    await request.save();

    await AssetHistory.create({
      asset: request.asset,
      action: "condition_request_rejected",
      performedBy: req.user._id,
      notes: rejectionReason || "Condition request rejected",
    });

    return res.status(200).json({
      success: true,
      message: "Condition request rejected successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
GET MY CONDITION REQUESTS (HOD)
=================================================
*/
export const getMyConditionRequests = async (req, res) => {
  try {
    const requests = await AssetConditionRequest.find({
      requestedBy: req.user._id,
    })
      .populate("asset")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};