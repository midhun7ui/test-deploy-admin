import PropTypes from "prop-types";

export default function SecurityAuditTab({ security, onChangeSecurity }) {
  return (
    <section className="settings-section-card">
      <div className="settings-section-header">
        <div className="settings-section-title-wrap">
          <div className="settings-section-title-row">
            <span className="material-symbols-outlined">verified_user</span>
            <h2 className="settings-section-title">
              Security, MFA & Audit Defaults
            </h2>
          </div>
          <p className="settings-section-desc">
            Global zero-trust parameters, session lifecycles, and cryptographic audit compliance rules.
          </p>
        </div>
        <span className="settings-tag-pill success">SOC-2 Type II</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Toggle 1: MFA */}
        <div className="settings-toggle-card">
          <div className="settings-toggle-card-info">
            <span className="settings-toggle-card-title">
              Enforce Mandatory Multi-Factor Authentication (MFA)
            </span>
            <span className="settings-toggle-card-desc">
              Requires TOTP hardware key or Google Authenticator on all staff accounts across all hubs
            </span>
          </div>
          <label className="switch-container">
            <input
              type="checkbox"
              checked={security.mfaEnforced}
              onChange={(e) => onChangeSecurity("mfaEnforced", e.target.checked)}
              id="switch-enforce-mfa"
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Toggle 2: Hardware Key for Payouts */}
        <div className="settings-toggle-card">
          <div className="settings-toggle-card-info">
            <span className="settings-toggle-card-title">
              Hardware Security Key for High-Value Payouts (&gt;₹5,00,000)
            </span>
            <span className="settings-toggle-card-desc">
              Demands WebAuthn FIDO2 physical key verification before initiating disbursement batch
            </span>
          </div>
          <label className="switch-container">
            <input
              type="checkbox"
              checked={security.hardwareTokenRequiredForPayout}
              onChange={(e) =>
                onChangeSecurity("hardwareTokenRequiredForPayout", e.target.checked)
              }
              id="switch-hardware-token-payout"
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Form Inputs */}
        <div className="settings-form-grid">
          <div className="settings-form-group">
            <label className="settings-label" htmlFor="session-timeout">
              Session Inactivity Idle Timeout (Minutes)
            </label>
            <input
              id="session-timeout"
              type="number"
              min="5"
              max="120"
              className="settings-input mono"
              value={security.sessionTimeoutMins}
              onChange={(e) =>
                onChangeSecurity("sessionTimeoutMins", parseInt(e.target.value, 10) || 15)
              }
            />
            <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
              Automatically locks operations console after inactivity
            </span>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="audit-log-level">
              SOC-2 Audit Logging Telemetry Level
            </label>
            <input
              id="audit-log-level"
              type="text"
              className="settings-input"
              value={security.auditLogLevel}
              onChange={(e) => onChangeSecurity("auditLogLevel", e.target.value)}
            />
            <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
              Streamed in real-time to Splunk SIEM and encrypted S3 WORM archive
            </span>
          </div>

          <div className="settings-form-group full-width">
            <label className="settings-label" htmlFor="vpn-subnet">
              Corporate VPN IP CIDR Subnet Whitelist
            </label>
            <input
              id="vpn-subnet"
              type="text"
              className="settings-input mono"
              value={security.vpnSubnet}
              onChange={(e) => onChangeSecurity("vpnSubnet", e.target.value)}
            />
            <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
              Administrative actions are blocked outside this secure corridor tunnel
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

SecurityAuditTab.propTypes = {
  security: PropTypes.shape({
    sessionTimeoutMins: PropTypes.number.isRequired,
    mfaEnforced: PropTypes.bool.isRequired,
    auditLogLevel: PropTypes.string.isRequired,
    vpnSubnet: PropTypes.string.isRequired,
    hardwareTokenRequiredForPayout: PropTypes.bool.isRequired,
  }).isRequired,
  onChangeSecurity: PropTypes.func.isRequired,
};
