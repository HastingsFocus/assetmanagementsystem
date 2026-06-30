import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  getNotifications,
  markNotificationRead,
} from "../services/notificationService";
import { PageHeader, Card, Button, EmptyState, Loader } from "../components/ui";
import { FiBell, FiCheck } from "react-icons/fi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

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
      <PageHeader
        icon={<FiBell />}
        title="Notifications"
        subtitle="Updates about your requisitions, assets and transfers."
      />

      {loading ? (
        <Loader label="Loading notifications…" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<FiBell />}
          title="You're all caught up"
          message="You don't have any notifications yet."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n._id}
              className={
                n.isRead ? "" : "border-brand-200 bg-brand-50/40"
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!n.isRead ? (
                      <span
                        className="size-2 shrink-0 rounded-full bg-brand-600"
                        aria-label="Unread"
                      />
                    ) : null}
                    <h3 className="truncate">{n.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-ink-600">{n.message}</p>
                  <time className="mt-2 block text-xs text-ink-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </time>
                </div>

                {!n.isRead ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRead(n._id)}
                  >
                    <FiCheck className="size-4" />
                    Mark read
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
