import AssetTransferRequest from "../models/AssetTransferRequest.js";
import Asset from "../models/Asset.js";
import AssetHistory from "../models/AssetHistory.js";
import Department from "../models/Department.js";
import User from "../models/User.js";

/*
========================================================
CREATE TRANSFER REQUEST (HOD)
========================================================
*/
export const createTransferRequest = async (req, res) => {
    try {
        const { assetId, toDepartment, reason } = req.body;
        const asset = await Asset.findById(assetId);

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        /*
        Check ownership
        */
        const userDepartment = req.user.department;
        if (asset.department.toString() !== userDepartment.toString()) {
            return res.status(403).json({
                message: "You can only transfer your department assets"
            });
        }

        const destination = await Department.findById(toDepartment);
        if (!destination) {
            return res.status(404).json({
                message: "Destination department not found"
            });
        }

        const request = await AssetTransferRequest.create({
            asset: asset._id,
            fromDepartment: asset.department,
            toDepartment: destination._id,
            reason,
            requestedBy: req.user.id
        });

        return res.status(201).json({
            message: "Transfer request submitted",
            request
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
========================================================
GET MY TRANSFER REQUESTS (HOD)
========================================================
*/
export const getMyTransferRequests = async (req, res) => {
    try {
        const requests = await AssetTransferRequest.find({
            requestedBy: req.user.id
        })
        .populate("asset")
        .populate("fromDepartment", "name code")
        .populate("toDepartment", "name code")
        .sort({ createdAt: -1 });

        res.json({ requests });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
========================================================
GET PENDING REQUESTS (STORES)
========================================================
*/
export const getPendingTransferRequests = async (req, res) => {
    try {
        const requests = await AssetTransferRequest.find({
            status: "PENDING"
        })
        .populate("asset")
        .populate("fromDepartment", "name code")
        .populate("toDepartment", "name code")
        .populate("requestedBy", "name email")
        .sort({ createdAt: -1 });

        res.json({ requests });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
========================================================
APPROVE TRANSFER (STORES)
========================================================
*/
export const approveTransferRequest = async (req, res) => {
    try {
        const request = await AssetTransferRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Transfer request not found"
            });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "Request already processed"
            });
        }

        const asset = await Asset.findById(request.asset);
        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        const oldDepartment = asset.department;

        /*
        MOVE ASSET
        */
        asset.department = request.toDepartment;
        await asset.save();

        /*
        HISTORY
        */
        await AssetHistory.create({
            asset: asset._id,
            action: "transferred",
            performedBy: req.user.id,
            previousDepartment: oldDepartment,
            newDepartment: request.toDepartment,
            notes: "Asset transferred between departments"
        });

        request.status = "APPROVED";
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();
        await request.save();

        res.json({
            message: "Asset transferred successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
========================================================
REJECT TRANSFER (STORES)
========================================================
*/
export const rejectTransferRequest = async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const request = await AssetTransferRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        request.status = "REJECTED";
        request.rejectionReason = rejectionReason || "";
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();
        await request.save();

        res.json({
            message: "Transfer request rejected"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};