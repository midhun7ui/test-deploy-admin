import { useState } from "react";
import PropTypes from "prop-types";

export default function BroadcastAlertModal({ isOpen, onClose, onSendBroadcast }) {
  const [corridor, setCorridor] = useState("all");
  const [severity, setSeverity] = useState("warning");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [channels, setChannels] = useState({ whatsapp: true, inapp: true, sms: false });
  const [sentFeedback, setSentFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSendBroadcast({
      corridor,
      severity,
      title: title.trim(),
      message: message.trim(),
      channels,
    });

    setSentFeedback(true);
    setTimeout(() => {
      setSentFeedback(false);
      setTitle("");
      setMessage("");
      onClose();
    }, 1000);
  };

  return (
    <div className="notifications-modal-backdrop" onClick={onClose}>
      <div
        className="notifications-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="broadcast-modal-title"
      >
        <div className="notifications-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--notif-primary)", fontSize: "22px" }}>
              campaign
            </span>
            <h3 className="notifications-modal-title" id="broadcast-modal-title">
              Dispatch Highway Fleet Broadcast
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

        <form onSubmit={handleSubmit}>
          <div className="notifications-modal-body">
            <p style={{ fontSize: "12.5px", color: "var(--notif-text-muted)", margin: 0 }}>
              Broadcast immediate road advisories, weather warnings, or toll plaza diversions directly to driver mobile devices and fleet coordinators.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--notif-outline)", display: "block", marginBottom: "4px" }}>
                  Target Corridor
                </label>
                <select
                  className="notifications-select"
                  style={{ width: "100%", height: "38px" }}
                  value={corridor}
                  onChange={(e) => setCorridor(e.target.value)}
                >
                  <option value="all">All Active Corridors</option>
                  <option value="mumbai-delhi">Mumbai ➔ Delhi (NH-48)</option>
                  <option value="delhi-jaipur">Delhi NCR ➔ Jaipur</option>
                  <option value="bengaluru-chennai">Bengaluru ➔ Chennai</option>
                  <option value="pune-surat">Pune ➔ Surat</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--notif-outline)", display: "block", marginBottom: "4px" }}>
                  Severity Level
                </label>
                <select
                  className="notifications-select"
                  style={{ width: "100%", height: "38px" }}
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="warning">Warning / Diversion</option>
                  <option value="critical">Critical / Highway Closure</option>
                  <option value="info">Advisory / Operational Notice</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--notif-outline)", display: "block", marginBottom: "4px" }}>
                Broadcast Headline
              </label>
              <input
                type="text"
                className="notifications-search-input"
                style={{ height: "38px", paddingLeft: "12px" }}
                placeholder="e.g. Kotputli Toll Congestion: Divert via State Highway 14"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--notif-outline)", display: "block", marginBottom: "4px" }}>
                Advisory Message
              </label>
              <textarea
                style={{
                  width: "100%",
                  height: "80px",
                  padding: "8px 12px",
                  borderRadius: "var(--notif-radius-md)",
                  border: "1px solid var(--notif-border)",
                  fontFamily: "inherit",
                  fontSize: "12.5px",
                  color: "var(--notif-text)",
                  boxSizing: "border-box",
                  outline: "none",
                  resize: "vertical",
                }}
                placeholder="Detailed guidance, recommended alternate routes, or emergency assistance contact..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--notif-outline)", display: "block", marginBottom: "6px" }}>
                Delivery Channels
              </label>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={channels.whatsapp}
                    onChange={(e) => setChannels((p) => ({ ...p, whatsapp: e.target.checked }))}
                  />
                  <span>WhatsApp Business API</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={channels.inapp}
                    onChange={(e) => setChannels((p) => ({ ...p, inapp: e.target.checked }))}
                  />
                  <span>In-App Driver Push</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={channels.sms}
                    onChange={(e) => setChannels((p) => ({ ...p, sms: e.target.checked }))}
                  />
                  <span>SMS DLT Flash</span>
                </label>
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
              disabled={sentFeedback}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                {sentFeedback ? "check_circle" : "send"}
              </span>
              <span>{sentFeedback ? "Broadcast Dispatched!" : "Dispatch Broadcast"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

BroadcastAlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSendBroadcast: PropTypes.func.isRequired,
};
