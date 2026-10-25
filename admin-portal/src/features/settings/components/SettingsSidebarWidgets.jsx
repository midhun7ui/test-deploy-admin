import PropTypes from "prop-types";

export default function SettingsSidebarWidgets({
  integrations = [],
  maintenance = {},
  onToggleMaintenance,
  onPurgeRedis,
  onReinitPricing,
  onRefreshHealth,
  isRefreshing = false,
  isPurging = false,
  isReinitializing = false,
  onViewAuditLogs,
}) {
  const healthyCount = (integrations || []).filter(
    (i) => i.status === "healthy" || i.status === "active" || i.status === "connected"
  ).length;

  const isMaintenanceActive = Boolean(maintenance?.maintenanceMode);

  return (
    <div className="settings-right-col">
      {/* Widget 1: Third-Party Operational Health */}
      <div className="settings-inspector-card">
        <div className="settings-inspector-header">
          <h3 className="settings-inspector-title">
            <span className="material-symbols-outlined">hub</span>
            <span>Integration Status</span>
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {onRefreshHealth && (
              <button
                type="button"
                className={`integration-refresh-btn ${isRefreshing ? "rotating" : ""}`}
                onClick={onRefreshHealth}
                title="Refresh live health diagnostics"
                aria-label="Refresh integration health"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  refresh
                </span>
              </button>
            )}
            <span className="settings-tag-pill success">
              {healthyCount}/{integrations.length} Operational
            </span>
          </div>
        </div>

        <div className="integration-item-list">
          {integrations.map((item) => (
            <div key={item.id} className="integration-row-card">
              <div className="integration-row-left">
                <span
                  className={`integration-status-beacon ${item.status || "healthy"}`}
                  title={`Status: ${item.status || "healthy"}`}
                />
                <div className="integration-row-text">
                  <div className="integration-row-title-wrap">
                    <h6>{item.name}</h6>
                    {item.health_label && (
                      <span className={`integration-health-chip ${item.status || "healthy"}`}>
                        {item.health_label}
                      </span>
                    )}
                  </div>
                  <p>{item.desc}</p>
                </div>
              </div>
              <span className="material-symbols-outlined integration-row-icon">
                {item.icon || "cloud"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 2: Cache Controls & Danger Zone */}
      <div className={`settings-inspector-card ${isMaintenanceActive ? "danger-zone-active" : ""}`}>
        <div className="settings-inspector-header">
          <h3 className="settings-inspector-title danger">
            <span className="material-symbols-outlined">warning</span>
            <span>Maintenance & Memory Flush</span>
          </h3>
          {isMaintenanceActive ? (
            <span className="settings-tag-pill danger" title="Dispatcher console access is locked">
              <span className="pulse-dot red" /> Lockout Active
            </span>
          ) : (
            <span className="settings-tag-pill" title="Platform operating normally">
              <span className="pulse-dot green" /> Ready
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Maintenance Mode Toggle */}
          <div
            className={`settings-toggle-card ${isMaintenanceActive ? "maintenance-active" : ""}`}
            style={{ padding: "10px 12px" }}
          >
            <div className="settings-toggle-card-info">
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="settings-toggle-card-title">Platform Maintenance Mode</span>
                {isMaintenanceActive && (
                  <span className="lockout-status-chip">LOCKED</span>
                )}
              </div>
              <span className="settings-toggle-card-desc">Blocks dispatcher access for upgrades</span>
            </div>
            <label className="switch-container">
              <input
                type="checkbox"
                checked={isMaintenanceActive}
                onChange={() => onToggleMaintenance && onToggleMaintenance(!isMaintenanceActive)}
                id="switch-maintenance-mode"
              />
              <span className="switch-slider danger" />
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              type="button"
              className="danger-zone-btn warning"
              onClick={onPurgeRedis}
              disabled={isPurging}
              id="btn-purge-redis"
            >
              <span
                className={`material-symbols-outlined ${isPurging ? "spin" : ""}`}
                style={{ fontSize: "16px" }}
              >
                cached
              </span>
              <span>{isPurging ? "Purging Redis Key-Store..." : "Purge Redis Config Key-Store"}</span>
            </button>

            <button
              type="button"
              className="danger-zone-btn danger"
              onClick={onReinitPricing}
              disabled={isReinitializing}
              id="btn-reinit-pricing"
            >
              <span
                className={`material-symbols-outlined ${isReinitializing ? "spin" : ""}`}
                style={{ fontSize: "16px" }}
              >
                restart_alt
              </span>
              <span>
                {isReinitializing
                  ? "Recalculating Matrix..."
                  : "Re-initialize Pricing Engine Matrix"}
              </span>
            </button>
          </div>

          <div className="audit-notice-box">
            <span className="material-symbols-outlined">info</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span>
                All configuration overrides are cryptographically recorded in the SOC-2 immutable audit trail.
              </span>
              {onViewAuditLogs && (
                <button
                  type="button"
                  className="audit-trail-link-btn"
                  onClick={onViewAuditLogs}
                  id="btn-view-audit-trail"
                >
                  View Audit Trail →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

SettingsSidebarWidgets.propTypes = {
  integrations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      icon: PropTypes.string,
      health_label: PropTypes.string,
      category: PropTypes.string,
    })
  ).isRequired,
  maintenance: PropTypes.shape({
    maintenanceMode: PropTypes.bool.isRequired,
  }).isRequired,
  onToggleMaintenance: PropTypes.func.isRequired,
  onPurgeRedis: PropTypes.func.isRequired,
  onReinitPricing: PropTypes.func.isRequired,
  onRefreshHealth: PropTypes.func,
  isRefreshing: PropTypes.bool,
  isPurging: PropTypes.bool,
  isReinitializing: PropTypes.bool,
  onViewAuditLogs: PropTypes.func,
};
