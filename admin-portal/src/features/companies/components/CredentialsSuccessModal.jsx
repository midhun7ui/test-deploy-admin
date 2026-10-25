import { useState } from "react";
import PropTypes from "prop-types";

function CredentialsSuccessModal({ isOpen, onClose, title, subtitle, credentials }) {
  const [showPassword, setShowPassword] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !credentials) return null;

  const {
    companyName = "",
    companyCode = "",
    name = "",
    email = "",
    password = "",
    role = "Partner",
    portalUrl = "http://localhost:5173/login",
  } = credentials;

  const handleCopy = async (field, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleCopyAll = () => {
    const summary = [
      `HireD B2B Logistics Partner Portal Credentials`,
      `---------------------------------------------`,
      companyName ? `Company: ${companyName} (${companyCode})` : null,
      name ? `Associate Name: ${name}` : null,
      `Role: ${role}`,
      `Portal URL: ${portalUrl}`,
      `Login Email: ${email}`,
      `Password: ${password}`,
      `---------------------------------------------`,
      `Note: Please change your password upon initial login if required.`,
    ]
      .filter(Boolean)
      .join("\n");

    handleCopy("all", summary);
  };

  return (
    <div
      className="company-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id="modal-credentials-success"
    >
      <div
        className="company-modal-card credentials-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "560px" }}
      >
        <div className="company-modal-header" style={{ borderBottom: "1px solid var(--comp-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-outlined text-[24px]">key</span>
            </div>
            <div>
              <h3 className="company-modal-title" style={{ margin: 0, fontSize: "1.125rem" }}>
                {title || "Partner Account Provisioned"}
              </h3>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--comp-outline)" }}>
                {subtitle || "Share these credentials with the company associate for B2B portal login."}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
            id="btn-close-credentials"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="company-modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.25rem 1.5rem" }}>
          {/* Company & Associate Identity Chip */}
          {(companyName || name) && (
            <div
              style={{
                background: "var(--comp-surface-raised, rgba(255,255,255,0.03))",
                border: "1px solid var(--comp-border)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--comp-outline)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Partner Enterprise
                </div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--comp-text-main)" }}>
                  {companyName} {companyCode && <span style={{ fontSize: "0.75rem", color: "var(--comp-primary)", fontWeight: 500 }}>({companyCode})</span>}
                </div>
              </div>
              {name && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--comp-outline)" }}>Associate</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--comp-text-main)" }}>{name}</div>
                </div>
              )}
            </div>
          )}

          {/* Email Row */}
          <div className="company-form-group" style={{ marginBottom: 0 }}>
            <label className="company-form-label" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Login Email (Username)</span>
              {copiedField === "email" && (
                <span style={{ color: "#10b981", fontSize: "0.75rem", fontWeight: 600 }}>Copied!</span>
              )}
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                className="company-form-input"
                readOnly
                value={email}
                style={{ fontFamily: "monospace", fontSize: "0.875rem", background: "var(--comp-surface-sunken, rgba(0,0,0,0.2))" }}
              />
              <button
                type="button"
                className="btn-profile-action"
                style={{ height: "40px", minWidth: "40px", borderRadius: "8px", borderColor: "var(--comp-border)" }}
                title="Copy Email"
                onClick={() => handleCopy("email", email)}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedField === "email" ? "check" : "content_copy"}
                </span>
              </button>
            </div>
          </div>

          {/* Password Row */}
          <div className="company-form-group" style={{ marginBottom: 0 }}>
            <label className="company-form-label" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Generated Password</span>
              {copiedField === "password" && (
                <span style={{ color: "#10b981", fontSize: "0.75rem", fontWeight: 600 }}>Copied!</span>
              )}
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="company-form-input"
                readOnly
                value={password}
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.9375rem",
                  letterSpacing: showPassword ? "0.05em" : "0.2em",
                  background: "var(--comp-surface-sunken, rgba(0,0,0,0.2))",
                  color: "#10b981",
                  fontWeight: 600,
                }}
              />
              <button
                type="button"
                className="btn-profile-action"
                style={{ height: "40px", minWidth: "40px", borderRadius: "8px", borderColor: "var(--comp-border)" }}
                title={showPassword ? "Hide Password" : "Show Password"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
              <button
                type="button"
                className="btn-profile-action"
                style={{ height: "40px", minWidth: "40px", borderRadius: "8px", borderColor: "var(--comp-border)" }}
                title="Copy Password"
                onClick={() => handleCopy("password", password)}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedField === "password" ? "check" : "content_copy"}
                </span>
              </button>
            </div>
          </div>

          {/* Portal Link Row */}
          <div className="company-form-group" style={{ marginBottom: 0 }}>
            <label className="company-form-label" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>B2B Partner Portal Login URL</span>
              {copiedField === "portalUrl" && (
                <span style={{ color: "#10b981", fontSize: "0.75rem", fontWeight: 600 }}>Copied!</span>
              )}
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                className="company-form-input"
                readOnly
                value={portalUrl}
                style={{ fontSize: "0.8125rem", background: "var(--comp-surface-sunken, rgba(0,0,0,0.2))" }}
              />
              <button
                type="button"
                className="btn-profile-action"
                style={{ height: "40px", minWidth: "40px", borderRadius: "8px", borderColor: "var(--comp-border)" }}
                title="Copy Portal Link"
                onClick={() => handleCopy("portalUrl", portalUrl)}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedField === "portalUrl" ? "check" : "content_copy"}
                </span>
              </button>
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-profile-action"
                style={{
                  height: "40px",
                  minWidth: "40px",
                  borderRadius: "8px",
                  borderColor: "var(--comp-border)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--comp-primary)",
                  textDecoration: "none",
                }}
                title="Open Partner Portal in New Tab"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </a>
            </div>
          </div>

          <div
            style={{
              padding: "0.625rem 0.875rem",
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--comp-text-muted)",
            }}
          >
            <span className="material-symbols-outlined text-[16px]" style={{ color: "#3b82f6", marginTop: "2px" }}>
              shield
            </span>
            <span>
              This password is only displayed once in plaintext. Make sure to copy and store or securely send it to the partner before closing this window.
            </span>
          </div>
        </div>

        <div className="company-modal-footer" style={{ borderTop: "1px solid var(--comp-border)", padding: "1rem 1.5rem" }}>
          <button
            type="button"
            className="btn-submit"
            style={{
              background: copiedField === "all" ? "#10b981" : "var(--comp-primary)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onClick={handleCopyAll}
          >
            <span className="material-symbols-outlined text-[18px]">
              {copiedField === "all" ? "check" : "assignment"}
            </span>
            <span>{copiedField === "all" ? "Credentials Copied to Clipboard!" : "Copy Full Credentials"}</span>
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            id="btn-done-credentials"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

CredentialsSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  credentials: PropTypes.shape({
    companyName: PropTypes.string,
    companyCode: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.string,
    portalUrl: PropTypes.string,
  }),
};

export default CredentialsSuccessModal;
