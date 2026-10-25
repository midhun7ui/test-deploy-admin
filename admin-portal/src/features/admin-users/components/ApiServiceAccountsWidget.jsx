import PropTypes from "prop-types";

export default function ApiServiceAccountsWidget({
  accounts,
  onRegenerateSecret,
  onRevokeAccount,
  onAddAccount,
}) {
  return (
    <div className="admin-matrix-view-card" id="api-service-accounts-widget">
      {/* Header */}
      <div className="admin-matrix-header-row">
        <div>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--admin-text)" }}>
            API &amp; Service Accounts (M2M Automation)
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--admin-text-muted)" }}>
            Cryptographically signed machine-to-machine daemon credentials for automated integrations and microservices.
          </p>
        </div>

        <button
          type="button"
          className="admin-btn-primary"
          onClick={onAddAccount}
          id="btn-create-service-account"
        >
          <span className="material-symbols-outlined">add_link</span>
          <span>Provision Service Account</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="admin-service-accounts-grid">
        {accounts.map((svc) => (
          <div key={svc.id} className="admin-service-bot-card" id={`svc-card-${svc.id}`}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="admin-kpi-icon-box indigo" style={{ width: "36px", height: "36px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>smart_toy</span>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--admin-text)" }}>
                    {svc.name}
                  </h4>
                  <span style={{ fontSize: "11px", color: "var(--admin-outline)" }}>
                    Created: {svc.createdDate} • Rotated: {svc.rotatedDate}
                  </span>
                </div>
              </div>
              <span className="admin-kpi-pill success">{svc.status}</span>
            </div>

            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--admin-text-muted)", lineHeight: 1.4 }}>
              {svc.description}
            </p>

            {/* Client ID / Key box */}
            <div
              style={{
                backgroundColor: "var(--admin-surface-low)",
                padding: "8px 10px",
                borderRadius: "var(--admin-radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "11.5px",
                fontFamily: "monospace",
              }}
            >
              <span style={{ color: "var(--admin-text)" }}>{svc.clientId}</span>
              <button
                type="button"
                className="admin-action-icon-btn"
                title="Copy Client ID"
                onClick={() => navigator.clipboard?.writeText(svc.clientId)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>content_copy</span>
              </button>
            </div>

            {/* Scopes & Rate Limit */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {svc.scopes.map((s, idx) => (
                  <span key={idx} className="admin-perm-tag view">
                    {s}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: "11px", color: "var(--admin-text-muted)", fontWeight: 600 }}>
                Limit: {svc.rateLimit}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--admin-border-light)", paddingTop: "10px", marginTop: "4px" }}>
              <span style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>
                Last ping: <strong>{svc.lastActive}</strong>
              </span>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  style={{ height: "30px", fontSize: "11px", padding: "0 10px" }}
                  onClick={() => onRegenerateSecret?.(svc)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>refresh</span>
                  <span>Rotate Key</span>
                </button>
                <button
                  type="button"
                  className="admin-action-icon-btn"
                  style={{ color: "var(--admin-error)" }}
                  title="Revoke Service Account"
                  onClick={() => onRevokeAccount?.(svc)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ApiServiceAccountsWidget.propTypes = {
  accounts: PropTypes.array.isRequired,
  onRegenerateSecret: PropTypes.func.isRequired,
  onRevokeAccount: PropTypes.func.isRequired,
  onAddAccount: PropTypes.func.isRequired,
};
