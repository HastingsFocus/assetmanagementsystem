import express from "express";

import {
    createTransferRequest,
    getMyTransferRequests,
    getPendingTransferRequests,
    approveTransferRequest,
    rejectTransferRequest
} from "../controllers/assetTransferController.js";

import {
    protect
} from "../middleware/authMiddleware.js";


const router = express.Router();



router.post(
    "/",
    protect,
    createTransferRequest
);


router.get(
    "/my",
    protect,
    getMyTransferRequests
);


router.get(
    "/pending",
    protect,
    getPendingTransferRequests
);


router.put(
    "/approve/:id",
    protect,
    approveTransferRequest
);


router.put(
    "/reject/:id",
    protect,
    rejectTransferRequest
);



export default router;