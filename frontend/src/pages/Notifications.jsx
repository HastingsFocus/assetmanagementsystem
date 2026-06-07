import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  getNotifications,
  markNotificationRead,
} from "../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  /*
  ========================================
  LOAD NOTIFICATIONS
  ========================================
  */
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();

      // console.log("RAW DATA:", data);

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    }
  };

  /*
  ========================================
  MARK AS READ
  ========================================
  */
  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      loadNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h2 style={{ marginBottom: "20px" }}>
          Notifications
        </h2>

        {notifications.length === 0 ? (
          <p>No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "6px",
                background: n.isRead
                  ? "#fff"
                  : "#f0f8ff",
              }}
            >
              <h4 style={{ marginBottom: "5px" }}>
                {n.title}
              </h4>

              <p style={{ marginBottom: "5px" }}>
                {n.message}
              </p>

              <small>
                {new Date(
                  n.createdAt
                ).toLocaleString()}
              </small>

              {!n.isRead && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() =>
                      handleRead(n._id)
                    }
                    style={{
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Mark Read
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;