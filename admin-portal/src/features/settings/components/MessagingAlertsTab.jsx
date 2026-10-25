import PropTypes from "prop-types";

export default function MessagingAlertsTab({ messaging, onChangeMessaging }) {
  return (
    <section className="settings-section-card">
      <div className="settings-section-header">
        <div className="settings-section-title-wrap">
          <div className="settings-section-title-row">
            <span className="material-symbols-outlined">chat</span>
            <h2 className="settings-section-title">
              Messaging & Telecommunication Gateways
            </h2>
          </div>
          <p className="settings-section-desc">
            Manage TRAI DLT-approved telemarketer routes, WhatsApp Cloud API tokens, and operational incident bots.
          </p>
        </div>
        <span className="settings-tag-pill success">DLT Approved</span>
      </div>

      <div className="settings-form-grid">
        <div className="settings-form-group">
          <label className="settings-label" htmlFor="whatsapp-vendor">
            WhatsApp Business API Provider
          </label>
          <input
            id="whatsapp-vendor"
            type="text"
            className="settings-input"
            value={messaging.whatsappVendor}
            onChange={(e) => onChangeMessaging("whatsappVendor", e.target.value)}
          />
          <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
            Used for real-time driver trip assignment pings & digital e-PODs
          </span>
        </div>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="dlt-sender-id">
            TRAI DLT Sender Header (India)
          </label>
          <input
            id="dlt-sender-id"
            type="text"
            className="settings-input mono"
            value={messaging.dltSenderId}
            onChange={(e) => onChangeMessaging("dltSenderId", e.target.value)}
          />
          <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
            Approved 6-alpha SMS header for service implicit notifications
          </span>
        </div>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="dlt-entity-id">
            TRAI DLT Principal Entity ID
          </label>
          <input
            id="dlt-entity-id"
            type="text"
            className="settings-input mono"
            value={messaging.dltEntityId}
            onChange={(e) => onChangeMessaging("dltEntityId", e.target.value)}
          />
          <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
            Central registration ID for regulatory template compliance
          </span>
        </div>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="escalation-phone">
            Critical Incident Escalation Hotline
          </label>
          <input
            id="escalation-phone"
            type="tel"
            className="settings-input mono"
            value={messaging.urgentEscalationPhone}
            onChange={(e) => onChangeMessaging("urgentEscalationPhone", e.target.value)}
          />
          <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
            Triggered automatically on accident detection or high-priority SOS
          </span>
        </div>

        <div className="settings-form-group full-width">
          <label className="settings-label" htmlFor="email-gateway">
            Transactional Email Dispatch Rails
          </label>
          <input
            id="email-gateway"
            type="text"
            className="settings-input"
            value={messaging.emailGateway}
            onChange={(e) => onChangeMessaging("emailGateway", e.target.value)}
          />
          <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
            High-throughput infrastructure for billing tax statements and waybill receipts
          </span>
        </div>
      </div>
    </section>
  );
}

MessagingAlertsTab.propTypes = {
  messaging: PropTypes.shape({
    whatsappVendor: PropTypes.string.isRequired,
    dltSenderId: PropTypes.string.isRequired,
    dltEntityId: PropTypes.string.isRequired,
    urgentEscalationPhone: PropTypes.string.isRequired,
    emailGateway: PropTypes.string.isRequired,
  }).isRequired,
  onChangeMessaging: PropTypes.func.isRequired,
};
