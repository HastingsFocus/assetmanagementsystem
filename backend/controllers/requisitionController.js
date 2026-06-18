import Requisition from "../models/Requisition.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
import { sendEmail } from "../services/emailService.js";
import { getPrincipal } from "../utils/userHelpers.js";

/*
========================================================
CREATE REQUISITION (HOD)
========================================================
*/
export const createRequisition = async (req, res) => {
    try {
        const { priority, items } = req.body;

        /*
        ========================================================
        CHECK ITEMS
        ========================================================
        */
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one item is required"
            });
        }

        /*
        ========================================================
        GET USER DEPARTMENT
        ========================================================
        */
        const departmentId = req.user.department;
        if (!departmentId) {
            return res.status(400).json({
                success: false,
                message: "User is not assigned to a department"
            });
        }

        /*
        ========================================================
        VERIFY DEPARTMENT EXISTS
        ========================================================
        */
        const departmentData = await Department.findById(departmentId);
        if (!departmentData) {
            return res.status(400).json({
                success: false,
                message: "Department not found"
            });
        }

        /*
        ========================================================
        PROCESS ITEMS
        ========================================================
        */
        let totalAmount = 0;
        const processedItems = items
            .filter(item => item.name && item.quantity && item.unitPrice)
            .map(item => {
                const total = Number(item.quantity) * Number(item.unitPrice);
                totalAmount += total;
                return {
                    name: item.name,
                    quantity: Number(item.quantity),
                    unitPrice: Number(item.unitPrice),
                    description: item.description || "",
                    total,
                    status: "PENDING"
                };
            });

        if (processedItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid items submitted"
            });
        }

        /*
        ========================================================
        CREATE REQUISITION
        ========================================================
        */
        const requisition = await Requisition.create({
            requisitionId: `REQ-${Date.now()}`,
            requestedBy: req.user._id,
            department: departmentData._id,
            priority,
            items: processedItems,
            totalAmount,
            status: "PENDING"
        });

        /*
        ========================================================
        POPULATE RESPONSE
        ========================================================
        */
        const populated = await Requisition.findById(requisition._id)
            .populate("requestedBy", "name email role")
            .populate("department", "name code");

        /*
        ========================================================
        NOTIFY PRINCIPAL
        ========================================================
        */
        const principal = await getPrincipal();
        if (principal) {
            await Notification.create({
                user: principal._id,
                title: "New Requisition Submitted",
                message: `${req.user.name} submitted a requisition`,
                type: "REQUISITION_CREATED",
                relatedId: requisition._id
            });

            await sendEmail({
                to: principal.email,
                subject: "New Requisition Submitted",
                html: `
                    <h2>New Requisition</h2>
                    <p>${req.user.name} submitted a new requisition.</p>
                `
            });
        }

        /*
        ========================================================
        SOCKET
        ========================================================
        */
        const io = req.app.get("io");
        if (io && principal) {
            io.to(principal._id.toString()).emit("notificationCreated", {
                title: "New Requisition",
                message: "A new requisition needs approval"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Requisition created successfully",
            requisition: populated
        });

    } catch (error) {
        console.error("CREATE REQUISITION ERROR:", error);
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
        .populate("department", "name code")
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
            .populate("department", "name code")
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

        requisition.items.forEach(item => {
            const review = items.find(i => i._id === item._id.toString());
            if (!review) return;

            item.approvedQuantity = review.approvedQuantity;
            item.status = review.status;
            item.adminComment = review.adminComment || "";

            if (review.status === "APPROVED") approved++;
            if (review.status === "REJECTED") rejected++;
        });

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
            .populate("department", "name code")
            .populate("reviewedBy", "name email");

        const hod = await User.findById(requisition.requestedBy);
        const io = req.app.get("io");

        /*
        ========================================================
        NOTIFY HOD
        ========================================================
        */
        if (hod) {
            await Notification.create({
                user: hod._id,
                title: "Requisition Reviewed",
                message: `Your requisition is ${requisition.status}`,
                type: requisition.status === "APPROVED" 
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

        /*
        ========================================================
        NOTIFY ACCOUNTS
        ========================================================
        */
        if (requisition.status === "APPROVED") {
            const accountsUsers = await User.find({ role: "Accounts" });

            for (const account of accountsUsers) {
                await Notification.create({
                    user: account._id,
                    title: "Funding Required",
                    message: `Requisition ${requisition.requisitionId} approved and awaiting funding`,
                    type: "REQUISITION_APPROVED",
                    relatedId: requisition._id
                });

                await sendEmail({
                    to: account.email,
                    subject: "Funding Required",
                    html: `
                        <h3>Approved Requisition</h3>
                        <p>${requisition.requisitionId} requires funding.</p>
                    `
                });

                if (io) {
                    io.to(account._id.toString()).emit("notificationCreated", {
                        title: "Funding Required",
                        message: `Requisition ${requisition.requisitionId} needs funding`
                    });
                }
            }
        }

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