import { useEffect } from "react";
import PropTypes from "prop-types";

export default function MaintenanceDangerModal({
  isOpen,
  actionType,
  targetState,
  isLoading,
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const isMaint = actionType === "MAINTENANCE_MODE";
  const isPurge = actionType === "PURGE_REDIS";
  const isReinit = actionType === "REINIT_PRICING";

  let icon = "warning";
  let title = "Maintenance Action Required";
  let badgeText = "DANGER ZONE • SOC-2 AUDITED";
  let badgeClass = "danger";
  let description = "";
  let bulletPoints = [];
  let confirmBtnText = "Confirm Action";
  let confirmBtnClass = "settings-btn-danger";

  if (isMaint) {
    if (targetState) {
      icon = "warning";
      title = "Enable Platform Maintenance Mode?";
      badgeText = "DISPATCHER LOCKOUT • SOC-2 AUDITED";
      badgeClass = "danger";
      description =
        "Enabling Platform Maintenance Mode immediately blocks dispatcher console access and pauses automated dispatch queues during platform upgrades and maintenance.";
      bulletPoints = [
        "Blocks dispatcher access for upgrades across all 4 operational hubs",
        "Automated trip dispatch queues are immediately suspended",
        "Active driver manifests remain in transit under read-only GPS telemetry",
        "Administrative override capabilities remain fully functional",
      ];
      confirmBtnText = "Confirm & Enable Maintenance Mode";
      confirmBtnClass = "settings-btn-danger";
    } else {
      icon = "published_with_changes";
      title = "Disable Platform Maintenance Mode?";
      badgeText = "RESTORE DISPATCHER ACCESS";
      badgeClass = "success";
      description =
        "Disabling maintenance mode immediately restores dispatcher console access and resumes platform dispatch queues across the cluster.";
      bulletPoints = [
        "Unlocks dispatcher consoles and dispatch management tabs",
        "Resumes automated freight matching and driver assignments",
        "Re-enables partner order booking and quotation confirmation rails",
      ];
      confirmBtnText = "Restore Dispatcher Access";
      confirmBtnClass = "settings-btn-primary";
    }
  } else if (isPurge) {
    icon = "cached";
    title = "Purge Redis Config Key-Store?";
    badgeText = "CACHE PURGE • CLUSTER IMPACT";
    badgeClass = "warning";
    description =
      "Flushes distributed Redis configuration key-stores across all 3 active cluster nodes (AP-South-1). Edge nodes will immediately re-fetch cold configuration state from PostgreSQL.";
    bulletPoints = [
      "Flushes global_platform_config key-value stores from Redis cluster",
      "Clears edge cache and invalidates stale configuration trees",
      "Active dispatch and billing workers will re-query PostgreSQL primary",
      "Transient ~12ms cold-cache re-hydration latency across microservices",
    ];
    confirmBtnText = "Purge Redis Key-Store";
    confirmBtnClass = "settings-btn-warning";
  } else if (isReinit) {
    icon = "restart_alt";
    title = "Re-initialize Pricing Engine Matrix?";
    badgeText = "TARIFF ENGINE • SOC-2 AUDITED";
    badgeClass = "danger";
    description =
      "Recalculates dynamic corridor tariffs, resets fuel adjustment multipliers, and clears stale rate indices across all active transport lanes.";
    bulletPoints = [
      "Recalculates corridor tariff matrices across 38 active freight routes",
      "Refreshes base payload minimums and dwell detention surcharges",
      "Existing active or completed trips remain locked at agreed contract rates",
      "New order quotes will strictly reflect updated tariff calculations",
    ];
    confirmBtnText = "Re-initialize Pricing Matrix";
    confirmBtnClass = "settings-btn-danger";
  }

  return (
    <div
      className="settings-modal-overlay"
      onClick={!isLoading ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="danger-modal-title"
    >
      <div
        className="settings-modal-content danger-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "560px" }}
      >
        {/* Modal Header */}
        <div className="settings-modal-header danger-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className={`danger-modal-icon-badge ${badgeClass}`}>
              <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                <span className={`settings-tag-pill ${badgeClass}`}>{badgeText}</span>
              </div>
              <h3 className="settings-modal-title" id="danger-modal-title">
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            className="settings-modal-close-btn"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Warning Callout Box */}
        <div className={`danger-callout-box ${badgeClass}`}>
          <span className="material-symbols-outlined callout-icon">{icon}</span>
          <p className="danger-callout-text">{description}</p>
        </div>

        {/* Impact List */}
        <div className="danger-impact-section">
          <span className="danger-impact-title">OPERATIONAL IMPACT & SCOPE:</span>
          <ul className="danger-impact-list">
            {bulletPoints.map((pt, idx) => (
              <li key={idx}>
                <span className="material-symbols-outlined bullet-check">check_circle</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SOC-2 Immutable Audit Notice */}
        <div className="audit-notice-box" style={{ background: "var(--settings-card-high)" }}>
          <span className="material-symbols-outlined" style={{ color: "var(--settings-primary)" }}>
            verified_user
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontWeight: 600, color: "var(--settings-text-primary)" }}>
              SOC-2 Cryptographic Audit Logging
            </span>
            <span>
              All configuration overrides are cryptographically recorded in the SOC-2 immutable audit trail with your admin identity, timestamp, and client IP.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="settings-modal-actions danger-modal-actions">
          <button
            type="button"
            className="settings-btn-secondary"
            onClick={onClose}
            disabled={isLoading}
            id="btn-danger-modal-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            className={confirmBtnClass}
            onClick={onConfirm}
            disabled={isLoading}
            id="btn-danger-modal-confirm"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined spin" style={{ fontSize: "18px" }}>
                  progress_activity
                </span>
                <span>Executing Cluster Override...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  {icon}
                </span>
                <span>{confirmBtnText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

MaintenanceDangerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  actionType: PropTypes.oneOf(["MAINTENANCE_MODE", "PURGE_REDIS", "REINIT_PRICING", null]),
  targetState: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
