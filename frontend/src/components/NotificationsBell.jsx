import { useEffect, useState } from "react";
import {
  getNotifications,
} from "../services/notificationService";

const NotificationBell = () => {
  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
  try {
    const data = await getNotifications();

   // console.log("RAW NOTIF DATA:", data);

    // 👇 FIX HERE
    const list = Array.isArray(data)
      ? data
      : data.notifications || data.data || [];

    setNotifications(list);
  } catch (error) {
    console.error(error);
  }
};

  const unreadCount =
    notifications.filter(
      (n) => !n.isRead
    ).length;

  return (
    <div
      style={{
        position: "relative",
        fontSize: "24px",
      }}
    >
      🔔

      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-8px",
            right: "-10px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 8px",
            fontSize: "12px",
          }}
        >
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;