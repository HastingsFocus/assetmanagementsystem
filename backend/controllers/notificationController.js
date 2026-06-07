import Notification from "../models/Notification.js";

/*
|--------------------------------------------------------------------------
| GET USER NOTIFICATIONS
|--------------------------------------------------------------------------
*/

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
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
| GET UNREAD COUNT
|--------------------------------------------------------------------------
*/

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      unreadCount: count
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
| MARK SINGLE AS READ (REALTIME UPDATE)
|--------------------------------------------------------------------------
*/

export const markAsRead = async (req, res) => {
  try {
    const io = req.app.get("io");

    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    // 🔥 SOCKET EVENT (update badge instantly)
    io.to(req.user.id).emit("notificationUpdated", {
      type: "SINGLE_READ",
      notificationId: notification._id
    });

    return res.status(200).json({
      success: true,
      notification
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
| MARK ALL AS READ (REALTIME UPDATE)
|--------------------------------------------------------------------------
*/

export const markAllAsRead = async (req, res) => {
  try {
    const io = req.app.get("io");

    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false
      },
      {
        isRead: true
      }
    );

    // 🔥 SOCKET EVENT (refresh UI instantly)
    io.to(req.user.id).emit("notificationUpdated", {
      type: "ALL_READ"
    });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read"
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
| DELETE NOTIFICATION (REALTIME UPDATE)
|--------------------------------------------------------------------------
*/

export const deleteNotification = async (req, res) => {
  try {
    const io = req.app.get("io");

    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    // 🔥 SOCKET EVENT (remove instantly from UI)
    io.to(req.user.id).emit("notificationUpdated", {
      type: "DELETED",
      notificationId: req.params.id
    });

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};