import Asset from "../models/Asset.js";
import AssetHistory from "../models/AssetHistory.js";
import Requisition from "../models/Requisition.js";
import Counter from "../models/Counter.js";
import Department from "../models/Department.js";

const generateAssetTag = async (assetName) => {
  const prefix = assetName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase();

  const counter = await Counter.findOneAndUpdate(
    { name: prefix },
    { $inc: { sequenceValue: 1 } },
    {
      new: true,
      upsert: true,
    }
  );

  return `${prefix}-${String(
    counter.sequenceValue
  ).padStart(5, "0")}`;
};

export const getAssetByTag = async (req, res) => {
  try {
    const asset = await Asset.findOne({
      assetTag: req.params.assetTag,
    });

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("department")
      .populate("createdBy", "name email");

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    /*
    ==========================================
    OPTIONAL: FETCH HISTORY (VERY USEFUL)
    ==========================================
    */
    const history = await AssetHistory.find({
      asset: asset._id,
    })
      .populate("performedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      asset,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDepartmentAssets = async (
  req,
  res
) => {
  try {
    const assets = await Asset.find({
      department: req.params.department,
    });

    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateAssetStatus = async (
  req,
  res
) => {
  try {
    const { status, notes } = req.body;

    const asset = await Asset.findById(
      req.params.id
    );

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    const previousStatus = asset.status;

    asset.status = status;

    await asset.save();

    await AssetHistory.create({
      asset: asset._id,
      action: "updated",
      performedBy: req.user._id,
      previousStatus,
      newStatus: status,
      notes,
    });

    res.status(200).json({
      message: "Asset status updated",
      asset,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const receiveRequisitionAssets = async (req, res) => {
    try {
        const { requisitionId } = req.params;
        const requisition = await Requisition.findById(requisitionId)
            .populate("department", "name code");

        if (!requisition) {
            return res.status(404).json({
                success: false,
                message: "Requisition not found"
            });
        }

        if (requisition.status !== "FUNDS_RELEASED") {
            return res.status(400).json({
                success: false,
                message: "Funds have not been released for this requisition"
            });
        }

        if (requisition.inventoryAdded) {
            return res.status(400).json({
                success: false,
                message: "Assets have already been added to inventory"
            });
        }

        const createdAssets = [];

        for (const item of requisition.items) {
            const quantity = item.approvedQuantity > 0 
                ? item.approvedQuantity 
                : item.quantity;

            for (let i = 0; i < quantity; i++) {
                const assetTag = await generateAssetTag(item.name);
                const asset = await Asset.create({
                    assetTag,
                    assetName: item.name,
                    category: item.name,
                    serialNumber: "",
                    brand: "",
                    model: "",
                    quantity: 1,
                    department: requisition.department._id,
                    source: "requisition",
                    requisitionId: requisition._id,
                    purchasePrice: item.unitPrice,
                    createdBy: req.user._id,
                    status: "assigned",
                    condition: "excellent"
                });
await AssetHistory.create({

    asset: asset._id,

    action: "created",

    performedBy: req.user._id,

    previousDepartment: null,

    newDepartment: requisition.department,

    previousStatus: null,

    newStatus: "assigned",

    notes:
    `Asset received from requisition ${requisition.requisitionId}`

});
                createdAssets.push(asset);
            }
        }

        requisition.inventoryAdded = true;
        requisition.status = "COMPLETED";
        requisition.completedBy = req.user._id;
        requisition.completedAt = new Date();
        await requisition.save();

        return res.status(201).json({
            success: true,
            message: `${createdAssets.length} assets added to inventory successfully`,
            assets: createdAssets
        });

    } catch (error) {
        console.error("RECEIVE ASSETS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createManualAssets = async (req, res) => {
    try {
        const {
            assetName,
            category,
            quantity,
            department,
            source,
            purchasePrice,
            remarks,
            brand,
            model,
        } = req.body;

        if (!assetName || !category || !quantity || !department || !source) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        /*
        ========================================================
        FIND DEPARTMENT
        ========================================================
        */
        const departmentData = await Department.findOne({
            code: department.toUpperCase()
        });

        if (!departmentData) {
            return res.status(400).json({
                success: false,
                message: `Department ${department} not found`
            });
        }

        const createdAssets = [];

        /*
        ========================================================
        CREATE ASSETS
        ========================================================
        */
        for (let i = 0; i < quantity; i++) {
            const assetTag = await generateAssetTag(assetName);
            const asset = await Asset.create({
                assetTag,
                assetName,
                category,
                serialNumber: "",
                brand: brand || "",
                model: model || "",
                quantity: 1,
                department: departmentData._id,
                source,
                purchasePrice: purchasePrice || 0,
                remarks: remarks || "",
                status: "assigned",
                condition: "excellent",
                createdBy: req.user._id
            });

            /*
            ========================================================
            ASSET HISTORY
            ========================================================
            */
            await AssetHistory.create({
                asset: asset._id,
                action: "created",
                performedBy: req.user._id,
                previousDepartment: null,
                newDepartment: departmentData._id,
                previousStatus: null,
                newStatus: "assigned",
                notes: `Manually added asset (${source})`
            });

            createdAssets.push(asset);
        }

        return res.status(201).json({
            success: true,
            message: `${createdAssets.length} assets created successfully`,
            assets: createdAssets
        });

    } catch (error) {
        console.error("CREATE MANUAL ASSET ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getArchivedAssets = async (req, res) => {
  try {
    const assets = await Asset.find({
      status: "archived",
    }).sort({ archivedDate: -1 });

    res.status(200).json({
      success: true,
      count: assets.length,
      assets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};