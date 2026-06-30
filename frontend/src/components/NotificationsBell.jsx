import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

/**
 * NotificationsBell — renders only the unread-count badge. It is placed next
 * to a bell icon/label by its parent (e.g. the sidebar nav link), so it no
 * longer renders its own icon.
 */
const NotificationsBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let active = true;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        const list = Array.isArray(data)
          ? data
          : data.notifications || data.data || [];
        if (active) setNotifications(list);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };

    fetchNotifications();
    return () => {
      active = false;
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (unreadCount === 0) return null;

  return (
    <span
      className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white"
      aria-label={`${unreadCount} unread notifications`}
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
};

export default NotificationsBell;
