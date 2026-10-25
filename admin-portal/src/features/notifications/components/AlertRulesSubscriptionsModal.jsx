import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function AlertRulesSubscriptionsModal({ isOpen, onClose, rules = [], onSaveRules }) {
  const [ruleList, setRuleList] = useState(rules);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (Array.isArray(rules) && rules.length > 0) {
      setRuleList(rules);
    }
  }, [rules, isOpen]);

  if (!isOpen) return null;

  const handleToggleRule = (id) => {
    setRuleList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleSave = async () => {
    if (typeof onSaveRules === "function") {
      try {
        await onSaveRules(ruleList);
      } catch (err) {
        console.error("Failed to save rules:", err);
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
        style={{ maxWidth: "680px" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-rules-modal-title"
      >
        <div className="notifications-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--notif-primary)", fontSize: "22px" }}>
              notifications_active
            </span>
            <h3 className="notifications-modal-title" id="alert-rules-modal-title">
              Automated Alert Rules &amp; Subscriptions
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

        <div className="notifications-modal-body">
          <p style={{ fontSize: "12.5px", color: "var(--notif-text-muted)", margin: 0 }}>
            Configure automatic escalation triggers across telemetry geofences, driver compliance deadlines, and financial reconciliation webhooks.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ruleList.map((rule) => (
              <div
                key={rule.id}
                style={{
                  border: "1px solid var(--notif-border)",
                  borderRadius: "var(--notif-radius-md)",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "14px",
                  backgroundColor: rule.enabled ? "#ffffff" : "var(--notif-surface-low)",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "13.5px", color: "var(--notif-text)" }}>
                      {rule.name}
                    </strong>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        backgroundColor:
                          rule.severity === "Critical"
                            ? "var(--notif-error-bg)"
                            : "var(--notif-warning-bg)",
                        color:
                          rule.severity === "Critical"
                            ? "var(--notif-error)"
                            : "var(--notif-warning)",
                      }}
                    >
                      {rule.severity}
                    </span>
                  </div>

                  <p style={{ fontSize: "12px", color: "var(--notif-text-muted)", margin: "0 0 6px 0", lineHeight: 1.4 }}>
                    {rule.description}
                  </p>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {rule.channels.map((ch) => (
                      <span
                        key={ch}
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 600,
                          backgroundColor: "var(--notif-surface-low)",
                          color: "var(--notif-text)",
                          padding: "1px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Toggle Switch */}
                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "40px",
                    height: "22px",
                    cursor: "pointer",
                    flexShrink: 0,
                    marginTop: "4px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => handleToggleRule(rule.id)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      inset: 0,
                      backgroundColor: rule.enabled ? "var(--notif-primary-container)" : "#cbd5e1",
                      borderRadius: "22px",
                      transition: "0.2s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        content: "",
                        height: "16px",
                        width: "16px",
                        left: rule.enabled ? "21px" : "3px",
                        bottom: "3px",
                        backgroundColor: "#ffffff",
                        borderRadius: "50%",
                        transition: "0.2s",
                      }}
                    />
                  </span>
                </label>
              </div>
            ))}
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
            type="button"
            className="notifications-btn-primary"
            onClick={handleSave}
            disabled={savedFeedback}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              {savedFeedback ? "check" : "save"}
            </span>
            <span>{savedFeedback ? "Rules Saved!" : "Save Policy Rules"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

AlertRulesSubscriptionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
};
