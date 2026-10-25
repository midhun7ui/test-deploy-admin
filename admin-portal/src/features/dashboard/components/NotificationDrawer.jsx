import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const FALLBACK_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Driver KYC Alert",
    text: "3 new driver licenses uploaded for KYC approval",
    time: "10m ago",
    unread: true,
    type: "driver",
  },
  {
    id: "notif-2",
    title: "High Value Order",
    text: "Nexus Logistics submitted ₹64,500 FTL booking",
    time: "25m ago",
    unread: true,
    type: "order",
  },
  {
    id: "notif-3",
    title: "Weekly Payout Batch Ready",
    text: "Batch BATCH-OCT-W2 awaiting 2-person sign-off",
    time: "1h ago",
    unread: true,
    type: "finance",
  },
  {
    id: "notif-4",
    title: "System Health",
    text: "Django DRF Backend REST endpoints operating nominally (Lat: 42ms)",
    time: "2h ago",
    unread: false,
    type: "system",
  },
];

function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick,
}) {
  const initialList =
    Array.isArray(notifications) && notifications.length > 0
      ? notifications
      : FALLBACK_NOTIFICATIONS;

  const [items, setItems] = useState(initialList);

  useEffect(() => {
    if (Array.isArray(notifications) && notifications.length > 0) {
      setItems(notifications);
    }
  }, [notifications]);

  if (!isOpen) return null;

  function handleMarkAll() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (typeof onMarkAllRead === "function") {
      onMarkAllRead();
    }
  }

  function handleItemClick(notif) {
    setItems((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    if (typeof onNotificationClick === "function") {
      onNotificationClick(notif);
    }
  }

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <aside
        className="notification-flyout-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Notification Center"
      >
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span className="material-symbols-outlined drawer-header-icon">notifications</span>
            <div>
              <h3 className="drawer-title">Notifications</h3>
              <span className="drawer-subtitle">Operational events &amp; system alerts</span>
            </div>
          </div>

          <div className="drawer-header-actions">
            <button
              type="button"
              className="action-btn text-btn small-btn"
              onClick={handleMarkAll}
              id="btn-mark-all-read"
            >
              Mark all read
            </button>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={onClose}
              id="btn-close-notifs"
              aria-label="Close notifications drawer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="drawer-content-list">
          {items.length === 0 ? (
            <div className="drawer-empty-state">
              <span className="material-symbols-outlined empty-icon">notifications_off</span>
              <p>No new notifications</p>
            </div>
          ) : (
            items.map((notif) => (
              <div
                key={notif.id}
                className={`drawer-notif-item ${notif.unread ? "unread" : ""}`}
                onClick={() => handleItemClick(notif)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleItemClick(notif);
                  }
                }}
              >
                <div className={`notif-icon-circle type-${notif.type || "system"}`}>
                  <span className="material-symbols-outlined">
                    {notif.type === "driver" && "badge"}
                    {notif.type === "order" && "shopping_cart"}
                    {notif.type === "finance" && "payments"}
                    {(notif.type === "system" || !notif.type) && "dns"}
                  </span>
                </div>

                <div className="notif-body">
                  <div className="notif-title-row">
                    <strong className="notif-item-title">{notif.title}</strong>
                    <span className="notif-time">{notif.time || "Just now"}</span>
                  </div>
                  <p className="notif-text">{notif.text || notif.message || "Operational update recorded."}</p>
                </div>

                {notif.unread && <span className="notif-unread-dot" />}
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

NotificationDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.object),
  onMarkAllRead: PropTypes.func,
  onNotificationClick: PropTypes.func,
};

export default NotificationDrawer;
