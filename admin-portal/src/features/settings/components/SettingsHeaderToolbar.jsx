import PropTypes from "prop-types";

export default function SettingsHeaderToolbar({
  onExportJson,
  onSaveAll,
  lastSync = "4 mins ago by Vikramaditya S.",
  clusterRegion = "AP-South-1 (Mumbai)",
}) {
  return (
    <div className="settings-header-toolbar">
      <div className="settings-header-left">
        <div className="settings-meta-row">
          <span className="settings-category-pill">
            Platform Governance & Integrations
          </span>
          <span className="settings-cluster-pill">
            <span className="settings-pulse-dot" />
            Cluster: {clusterRegion}
          </span>
          <span className="settings-sync-timestamp">
            • Last Config Sync: {lastSync}
          </span>
        </div>
        <h1 className="settings-header-title">
          System Settings & Platform Configurations
        </h1>
        <p className="settings-header-desc">
          Manage global platform parameters, corporate entity billing coordinates, default freight
          commission margins, automated escrow triggers, API webhook gateways, and notification rules.
        </p>
      </div>

      <div className="settings-header-actions">
        <button
          type="button"
          className="settings-btn-secondary"
          onClick={onExportJson}
          id="btn-export-config-json"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
            file_download
          </span>
          <span>Export Config JSON</span>
        </button>

        <button
          type="button"
          className="settings-btn-primary"
          onClick={onSaveAll}
          id="btn-save-all-changes"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
            verified
          </span>
          <span>Save All System Changes</span>
        </button>
      </div>
    </div>
  );
}

SettingsHeaderToolbar.propTypes = {
  onExportJson: PropTypes.func.isRequired,
  onSaveAll: PropTypes.func.isRequired,
  lastSync: PropTypes.string,
  clusterRegion: PropTypes.string,
};
