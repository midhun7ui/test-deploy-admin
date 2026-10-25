import PropTypes from "prop-types";

export default function NotificationsStreamList({
  items,
  selectedItemId,
  onSelectItem,
  onDismissItem,
  onActionClick,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  totalItemsCount,
}) {
  const getIconForType = (type, category) => {
    if (category === "webhooks") return "webhook";
    if (category === "telemetry") return "swap_calls";
    if (type === "critical") {
      return category === "finance" ? "credit_card_off" : "crisis_alert";
    }
    if (type === "warning") return "assignment_late";
    if (type === "success") return "task_alt";
    return "notifications";
  };

  return (
    <div className="notifications-stream-container">
      {items.length === 0 ? (
        <div
          style={{
            backgroundColor: "var(--notif-card-bg)",
            border: "1px solid var(--notif-border)",
            borderRadius: "var(--notif-radius-lg)",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "42px", color: "var(--notif-outline)", marginBottom: "8px" }}
          >
            notifications_off
          </span>
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px 0" }}>
            No Matching Notifications
          </h3>
          <p style={{ fontSize: "13px", color: "var(--notif-text-muted)", margin: 0 }}>
            Try adjusting your search query, severity, or category filter tabs.
          </p>
        </div>
      ) : (
        <div className="notifications-stream-list">
          {items.map((item) => {
            const isSelected = selectedItemId === item.id;
            const iconName = getIconForType(item.type, item.category);

            return (
              <div
                key={item.id}
                className={`notifications-item-card ${isSelected ? "active" : ""} ${
                  !item.unread ? "read" : ""
                }`}
                onClick={() => onSelectItem(item)}
              >
                {/* Colored Left Accent Bar */}
                <div className={`notifications-item-accent ${item.type}`} />

                {/* Main Body */}
                <div className="notifications-item-body-row">
                  {/* Categorized Icon Box */}
                  <div className={`notifications-item-icon-box ${item.type}`}>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "20px",
                        fontVariationSettings: item.type === "critical" || item.type === "warning" ? "'FILL' 1" : "none",
                      }}
                    >
                      {iconName}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="notifications-item-content">
                    <div className="notifications-item-header">
                      <div className="notifications-item-title-cluster">
                        <h4 className="notifications-item-title">{item.title}</h4>
                        {item.unread && <span className="notifications-item-unread-dot" title="Unread" />}
                      </div>

                      <span className={`notifications-item-tag ${item.type}`}>
                        {item.tag}
                      </span>
                    </div>

                    <p className="notifications-item-desc">{item.description}</p>
                  </div>
                </div>

                {/* Footer Metadata & Inline Context Actions */}
                <div className="notifications-item-footer-strip">
                  <div className="notifications-item-meta">
                    <span className="notifications-item-time">
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                        history
                      </span>
                      <span>{item.time}</span>
                    </span>
                    <span>•</span>
                    <span>Corridor: {item.corridor}</span>
                    <span>•</span>
                    <span style={{ color: "var(--notif-text)", fontWeight: 600 }}>
                      {item.account}
                    </span>
                  </div>

                  <div
                    className="notifications-item-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.category === "critical" && (
                      <button
                        type="button"
                        className="notifications-item-action-btn primary"
                        onClick={() => onActionClick?.("assign", item)}
                      >
                        Assign Incident Manager
                      </button>
                    )}

                    {item.category === "finance" && (
                      <button
                        type="button"
                        className="notifications-item-action-btn secondary"
                        onClick={() => onActionClick?.("review_kyc", item)}
                      >
                        Review KYC &amp; Retry
                      </button>
                    )}

                    {item.category === "compliance" && (
                      <button
                        type="button"
                        className="notifications-item-action-btn secondary"
                        onClick={() => onActionClick?.("ping_whatsapp", item)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#10b981" }}>
                          chat
                        </span>
                        <span>Ping WhatsApp</span>
                      </button>
                    )}

                    {item.category === "finance" && item.type === "success" && (
                      <button
                        type="button"
                        className="notifications-item-action-btn secondary"
                        onClick={() => onActionClick?.("view_statement", item)}
                      >
                        View Statement
                      </button>
                    )}

                    {item.category === "telemetry" && (
                      <button
                        type="button"
                        className="notifications-item-action-btn secondary"
                        onClick={() => onActionClick?.("view_trip", item)}
                      >
                        View Trip
                      </button>
                    )}

                    <button
                      type="button"
                      className="notifications-item-action-btn dismiss"
                      onClick={() => onDismissItem(item.id)}
                      title="Dismiss alert"
                      aria-label="Dismiss alert"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                        close
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Strip */}
      <div className="notifications-pagination-strip">
        <span>
          Showing {items.length} of {totalItemsCount} operational events
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            className="notifications-page-btn"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            style={{ opacity: currentPage <= 1 ? 0.5 : 1 }}
          >
            ← Newer
          </button>
          <span style={{ fontSize: "11.5px", fontWeight: 600 }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="notifications-page-btn"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            style={{ opacity: currentPage >= totalPages ? 0.5 : 1 }}
          >
            Older →
          </button>
        </div>
      </div>
    </div>
  );
}

NotificationsStreamList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedItemId: PropTypes.string,
  onSelectItem: PropTypes.func.isRequired,
  onDismissItem: PropTypes.func.isRequired,
  onActionClick: PropTypes.func,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPrevPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  totalItemsCount: PropTypes.number.isRequired,
};
