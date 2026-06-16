import AssetHistory from "../models/AssetHistory.js";
import Asset from "../models/Asset.js";


export const getAllAssetHistory = async (req, res) => {
  try {
    const history = await AssetHistory.find()
      .populate("asset", "assetTag assetName")
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAssetHistory = async (req, res) => {
  try {
    const { assetId } = req.params;

    const asset = await Asset.findById(assetId);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    const history = await AssetHistory.find({
      asset: assetId,
    })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      asset: {
        id: asset._id,
        assetTag: asset.assetTag,
        assetName: asset.assetName,
      },
      count: history.length,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAssetHistoryByTag = async (
  req,
  res
) => {
  try {
    const { assetTag } = req.params;

    const asset = await Asset.findOne({
      assetTag,
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    const history = await AssetHistory.find({
      asset: asset._id,
    })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      asset: {
        id: asset._id,
        assetTag: asset.assetTag,
        assetName: asset.assetName,
      },
      count: history.length,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};