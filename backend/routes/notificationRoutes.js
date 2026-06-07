import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ROUTES
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  getNotifications
);

router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

/*
|--------------------------------------------------------------------------
| UPDATE ROUTES
|--------------------------------------------------------------------------
*/

router.put(
  "/mark-all-read",
  protect,
  markAllAsRead
);

router.put(
  "/:id/read",
  protect,
  markAsRead
);

/*
|--------------------------------------------------------------------------
| DELETE ROUTE
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  deleteNotification
);

export default router;