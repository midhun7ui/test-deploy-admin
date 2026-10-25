import PropTypes from "prop-types";

export default function AuditLogsHeaderToolbar({
  dateRange,
  onDateRangeChange,
  environment,
  onEnvironmentChange,
  onExportSiem,
  onVerifyChain,
  onCreateRule,
}) {
  return (
    <div className="audit-logs-header-card" id="audit-logs-header">
      {/* Title Cluster */}
      <div className="audit-logs-title-cluster">
        <div className="audit-logs-title-row">
          <h1 className="audit-logs-page-title">Audit Logs &amp; Security Telemetry</h1>
          <span className="audit-logs-category-tag">
            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--audit-primary)" }}>
              verified_user
            </span>
            <span>Immutable Audit Trail • SOC2 &amp; ISO 27001</span>
          </span>
        </div>
        <p className="audit-logs-subtitle">
          Cryptographically signed event ledger tracking system authentication, RBAC permission shifts,
          financial disbursements, rate card changes, and operational overrides.
        </p>
      </div>

      {/* Action Controls */}
      <div className="audit-logs-toolbar-actions">
        {/* Date Range Selector */}
        <div
          className="audit-selector-box"
          onClick={() => {
            const next = dateRange === "7d" ? "24h" : dateRange === "24h" ? "30d" : "7d";
            onDateRangeChange(next);
          }}
          title="Click to toggle temporal window"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--audit-primary)" }}>
            calendar_today
          </span>
          <span>
            {dateRange === "24h"
              ? "Last 24 Hours (Realtime)"
              : dateRange === "30d"
              ? "Last 30 Days (Full Cycle)"
              : "Last 7 Days (08 Oct - 15 Oct 2026)"}
          </span>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--audit-outline)" }}>
            expand_more
          </span>
        </div>

        {/* Environment Selector */}
        <div
          className="audit-selector-box"
          onClick={() => {
            const next = environment === "prod" ? "staging" : "prod";
            onEnvironmentChange(next);
          }}
          title="Click to toggle cloud cluster environment"
        >
          <span className="audit-pulse-dot" />
          <span>{environment === "staging" ? "Staging (Enclave-Test)" : "Prod (Cluster-AP-South-1)"}</span>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--audit-outline)" }}>
            expand_more
          </span>
        </div>

        {/* Export SIEM */}
        <button
          type="button"
          className="audit-btn-secondary"
          onClick={onExportSiem}
          id="btn-export-siem"
          title="Stream logs to external SIEM / Data lake"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>cloud_download</span>
          <span>Export SIEM</span>
        </button>

        {/* Verify Hash Chain */}
        <button
          type="button"
          className="audit-btn-secondary"
          onClick={onVerifyChain}
          id="btn-verify-hash-chain"
          title="Validate Merkle tree cryptographic integrity"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--audit-primary)" }}>
            fingerprint
          </span>
          <span>Verify Hash Chain</span>
        </button>

        {/* Create Rule CTA */}
        <button
          type="button"
          className="audit-btn-primary"
          onClick={onCreateRule}
          id="btn-create-audit-rule"
          title="Configure real-time automated audit alert rule"
        >
          <span className="material-symbols-outlined">add_moderator</span>
          <span>Create Rule</span>
        </button>
      </div>
    </div>
  );
}

AuditLogsHeaderToolbar.propTypes = {
  dateRange: PropTypes.string.isRequired,
  onDateRangeChange: PropTypes.func.isRequired,
  environment: PropTypes.string.isRequired,
  onEnvironmentChange: PropTypes.func.isRequired,
  onExportSiem: PropTypes.func.isRequired,
  onVerifyChain: PropTypes.func.isRequired,
  onCreateRule: PropTypes.func.isRequired,
};
