import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function ChannelConfigModal({ isOpen, onClose, channelConfig, onSaveConfig }) {
  const [webhookUrl, setWebhookUrl] = useState("https://api.hired.in/v1/webhooks/ops-telemetry");
  const [hmacSecret, setHmacSecret] = useState("whsec_984f88e1a0b3294c71e82");
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (channelConfig) {
      if (channelConfig.webhookUrl) setWebhookUrl(channelConfig.webhookUrl);
      if (channelConfig.hmacSecret) setHmacSecret(channelConfig.hmacSecret);
    }
  }, [channelConfig, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (typeof onSaveConfig === "function") {
      try {
        await onSaveConfig({ webhookUrl, hmacSecret });
      } catch (err) {
        console.error("Failed to save channel config:", err);
      }
    }
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 900);
  };

  return (
    <div className="notifications-modal-backdrop" onClick={onClose}>
      <div
        className="notifications-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "640px" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="channel-config-modal-title"
      >
        <div className="notifications-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--notif-primary)", fontSize: "22px" }}>
              settings_input_component
            </span>
            <h3 className="notifications-modal-title" id="channel-config-modal-title">
              Configure Notification Channels &amp; Webhooks
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

        <form onSubmit={handleSave}>
          <div className="notifications-modal-body">
            <p style={{ fontSize: "12.5px", color: "var(--notif-text-muted)", margin: 0 }}>
              Manage third-party delivery gateways, DLT authentication tokens, and webhook HMAC signature verification keys.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* WhatsApp Config */}
              <div style={{ border: "1px solid var(--notif-border)", borderRadius: "8px", padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "13px", color: "var(--notif-text)" }}>WhatsApp Business Cloud API</strong>
                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#10b981", backgroundColor: "#d1fae5", padding: "1px 6px", borderRadius: "4px" }}>
                    Connected (Meta v20.0)
                  </span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--notif-text-muted)" }}>
                  Verified Business ID: WABA-99201 • Phone ID: +91 80 4488 9900
                </div>
              </div>

              {/* Webhook Endpoint Config */}
              <div style={{ border: "1px solid var(--notif-border)", borderRadius: "8px", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13px", color: "var(--notif-text)" }}>Primary REST Webhook Dispatcher</strong>
                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--notif-primary)", backgroundColor: "var(--notif-primary-light)", padding: "1px 6px", borderRadius: "4px" }}>
                    HTTP POST
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", color: "var(--notif-outline)", display: "block", marginBottom: "3px" }}>
                    Webhook Destination URL
                  </label>
                  <input
                    type="url"
                    className="notifications-search-input"
                    style={{ height: "36px", paddingLeft: "10px", fontFamily: "monospace", fontSize: "11.5px" }}
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", color: "var(--notif-outline)", display: "block", marginBottom: "3px" }}>
                    HMAC-SHA256 Signing Secret
                  </label>
                  <input
                    type="password"
                    className="notifications-search-input"
                    style={{ height: "36px", paddingLeft: "10px", fontFamily: "monospace", fontSize: "11.5px" }}
                    value={hmacSecret}
                    onChange={(e) => setHmacSecret(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* SMS DLT Route */}
              <div style={{ border: "1px solid var(--notif-border)", borderRadius: "8px", padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "13px", color: "var(--notif-text)" }}>Telecom DLT Route (TRAI Compliant)</strong>
                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#10b981", backgroundColor: "#d1fae5", padding: "1px 6px", borderRadius: "4px" }}>
                    DLT Entity Active
                  </span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--notif-text-muted)" }}>
                  Registered Header: HIREDIN • Principal Entity ID: 170115982001
                </div>
              </div>
            </div>
          </div>

          <div className="notifications-modal-footer">
            <button
              type="button"
              className="notifications-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="notifications-btn-primary"
              disabled={savedFeedback}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                {savedFeedback ? "check" : "save"}
              </span>
              <span>{savedFeedback ? "Settings Saved!" : "Save Channel Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ChannelConfigModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
