import { useState } from "react";
import PropTypes from "prop-types";

export default function CreateAuditRuleModal({ isOpen, onClose, onSaveRule }) {
  const [ruleName, setRuleName] = useState("");
  const [eventCode, setEventCode] = useState("RBAC_PERMISSION_ESCALATION");
  const [severity, setSeverity] = useState("Critical");
  const [threshold, setThreshold] = useState("1");
  const [channel, setChannel] = useState("siem_pagerduty");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    onSaveRule({
      id: `rule-${Date.now()}`,
      name: ruleName,
      eventCode,
      severity,
      threshold,
      channel,
    });

    onClose();
  };

  return (
    <div className="audit-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="audit-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="audit-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--audit-primary)" }}>
              add_moderator
            </span>
            <h3 className="audit-modal-title">Create Real-Time Audit Alert Rule</h3>
          </div>
          <button
            type="button"
            className="admin-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="audit-modal-body">
            <div className="admin-form-group">
              <label className="admin-form-label">Rule Title *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. Unscheduled Super Admin Threshold Override"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Monitored Event Type</label>
                <select
                  className="admin-form-select"
                  value={eventCode}
                  onChange={(e) => setEventCode(e.target.value)}
                >
                  <option value="RBAC_PERMISSION_ESCALATION">RBAC_PERMISSION_ESCALATION</option>
                  <option value="PAYOUT_MANUAL_OVERRIDE">PAYOUT_MANUAL_OVERRIDE</option>
                  <option value="RATE_CARD_DISCOUNT_APPLIED">RATE_CARD_DISCOUNT_APPLIED</option>
                  <option value="BULK_DATA_EXPORT_ATTEMPT">BULK_DATA_EXPORT_ATTEMPT</option>
                  <option value="FAILED_LOGIN_MFA_LOCKOUT">FAILED_LOGIN_MFA_LOCKOUT</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Alert Severity</label>
                <select
                  className="admin-form-select"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="Critical">Critical (Immediate Dual-Signoff Alert)</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Trigger Frequency Floor</label>
                <select
                  className="admin-form-select"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                >
                  <option value="1">1 occurrence (Zero-tolerance)</option>
                  <option value="3">&gt; 3 occurrences in 15 mins</option>
                  <option value="5">&gt; 5 occurrences in 1 hour</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Escalation Dispatch Channel</label>
                <select
                  className="admin-form-select"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                >
                  <option value="siem_pagerduty">SIEM &amp; PagerDuty Emergency</option>
                  <option value="slack_webhook">Security Slack Webhook</option>
                  <option value="executive_email">Executive Security Email Group</option>
                </select>
              </div>
            </div>
          </div>

          <div className="audit-modal-footer">
            <button type="button" className="audit-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="audit-btn-primary" id="btn-save-audit-rule">
              <span className="material-symbols-outlined">save</span>
              <span>Deploy Alert Rule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateAuditRuleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaveRule: PropTypes.func.isRequired,
};
