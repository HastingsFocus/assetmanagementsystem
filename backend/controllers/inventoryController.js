import InventoryItem from "../models/InventoryItem.js";
import Requisition from "../models/Requisition.js";

/*
==================================================
RECEIVE GOODS FROM FUNDS RELEASED REQUISITION
==================================================
*/



export const receiveGoods = async (req, res) => {
  try {
    const requisitionId = req.params.id;

    const requisition = await Requisition.findById(requisitionId);

    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: "Requisition not found"
      });
    }

    // DEBUG (VERY IMPORTANT)
    console.log("REQ USER:", req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no user attached"
      });
    }

    // Accept correct status flow
    if (requisition.status !== "FUNDS_RELEASED") {
      return res.status(400).json({
        success: false,
        message: `Requisition must be FUNDS_RELEASED. Current: ${requisition.status}`
      });
    }

    const createdItems = [];

    for (const item of requisition.items) {
      // skip invalid items
      if (!item.approvedQuantity || item.approvedQuantity <= 0) {
        continue;
      }

      const inventory = await InventoryItem.create({
        name: item.name,
        description: item.description || "",
        quantity: item.approvedQuantity,
        unitPrice: item.unitPrice,
        department: requisition.department,
        sourceRequisition: requisition._id,
        receivedBy: req.user._id,

        assetTag: `AST-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      });

      createdItems.push(inventory);
    }

    if (createdItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No approved items found to add into inventory"
      });
    }

    requisition.status = "COMPLETED";
    requisition.completedBy = req.user._id;
    requisition.completedAt = new Date();

    await requisition.save();

    return res.status(201).json({
      success: true,
      message: "Goods successfully received into inventory",
      count: createdItems.length,
      inventory: createdItems
    });

  } catch (error) {
    console.error("RECEIVE GOODS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
==================================================
GET ALL INVENTORY
==================================================
*/
export const getAllInventory =
  async (req, res) => {
    try {
      const items =
        await InventoryItem.find()
          .populate(
            "receivedBy",
            "name email role"
          )
          .populate(
            "sourceRequisition"
          )
          .sort({
            createdAt: -1
          });

      return res.status(200).json({
        success: true,
        count: items.length,
        items
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

/*
==================================================
GET INVENTORY BY DEPARTMENT
==================================================
*/
export const getDepartmentInventory =
  async (req, res) => {
    try {
      const {
        department
      } = req.params;

      const items =
        await InventoryItem.find({
          department
        })
          .populate(
            "receivedBy",
            "name email"
          )
          .populate(
            "sourceRequisition"
          )
          .sort({
            createdAt: -1
          });

      return res.status(200).json({
        success: true,
        count: items.length,
        items
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

/*
==================================================
GET INVENTORY BY ASSET TAG
==================================================
*/
export const getInventoryByTag =
  async (req, res) => {
    try {
      const { assetTag } =
        req.params;

      const item =
        await InventoryItem.findOne({
          assetTag
        })
          .populate(
            "receivedBy",
            "name email role"
          )
          .populate(
            "sourceRequisition"
          );

      if (!item) {
        return res.status(404).json({
          success: false,
          message:
            "Inventory item not found"
        });
      }

      return res.status(200).json({
        success: true,
        item
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

/*
==================================================
UPDATE INVENTORY STATUS
==================================================
*/
export const updateInventoryStatus =
  async (req, res) => {
    try {
      const { id } = req.params;

      const { status } = req.body;

      const allowedStatuses = [
        "available",
        "in-use",
        "damaged",
        "disposed"
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid inventory status"
        });
      }

      const item =
        await InventoryItem.findById(
          id
        );

      if (!item) {
        return res.status(404).json({
          success: false,
          message:
            "Inventory item not found"
        });
      }

      item.status = status;

      await item.save();

      return res.status(200).json({
        success: true,
        message:
          "Inventory status updated successfully",
        item
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };