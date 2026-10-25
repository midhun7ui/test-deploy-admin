import PropTypes from "prop-types";

export default function WebhookLogsModal({ isOpen, onClose, logs = [] }) {
  if (!isOpen) return null;

  return (
    <div className="notifications-modal-backdrop" onClick={onClose}>
      <div
        className="notifications-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "720px" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="webhook-logs-modal-title"
      >
        <div className="notifications-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--notif-primary)", fontSize: "22px" }}>
              terminal
            </span>
            <h3 className="notifications-modal-title" id="webhook-logs-modal-title">
              Real-time Webhook Event Stream &amp; Audit Logs
            </h3>
          </div>

          <button
            type="button"
            className="notifications-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="notifications-modal-body">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "12px", color: "var(--notif-text-muted)" }}>
              Live telemetry and third-party callback audit logs from ICICI Bank, FASTag NETC, and WhatsApp Gateway.
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#10b981",
                backgroundColor: "#d1fae5",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              Zero Dropped Events
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {logs.map((log) => {
              const isError = log.status >= 400;
              return (
                <div
                  key={log.id}
                  style={{
                    backgroundColor: "#0f172a",
                    color: "#f8fafc",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    fontFamily: "monospace",
                    fontSize: "11.5px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          backgroundColor: "#334155",
                          color: "#38bdf8",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {log.method}
                      </span>
                      <span style={{ color: "#f1f5f9" }}>{log.endpoint}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          backgroundColor: isError ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)",
                          color: isError ? "#f87171" : "#4ade80",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {log.status} {log.statusText}
                      </span>
                      <span style={{ color: "#94a3b8" }}>{log.latency}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#1e293b",
                      padding: "6px 8px",
                      borderRadius: "4px",
                      color: "#94a3b8",
                      overflowX: "auto",
                      whiteSpace: "pre-wrap",
                      fontSize: "11px",
                    }}
                  >
                    Payload: {log.payloadPreview}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "10px" }}>
                    <span>Event Ref: #{log.id}</span>
                    <span>Received {log.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="notifications-modal-footer">
          <button
            type="button"
            className="notifications-btn-secondary"
            onClick={onClose}
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
}

WebhookLogsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  logs: PropTypes.arrayOf(PropTypes.object),
};
