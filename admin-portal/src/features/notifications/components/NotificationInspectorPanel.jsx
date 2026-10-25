import { useState } from "react";
import PropTypes from "prop-types";

export default function NotificationInspectorPanel({
  selectedItem,
  onAcknowledge,
  onCallDriver,
  onWaivePenalty,
  onAddAuditNote,
}) {
  const [noteInput, setNoteInput] = useState("");

  if (!selectedItem) {
    return (
      <div
        className="notifications-inspector-card"
        style={{ padding: "40px 24px", textAlign: "center" }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "42px", color: "var(--notif-outline)", marginBottom: "8px" }}
        >
          page_info
        </span>
        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px 0" }}>
          Select an Alert to Inspect
        </h3>
        <p style={{ fontSize: "13px", color: "var(--notif-text-muted)", margin: 0 }}>
          Click any operational event from the stream on the left to review telemetry, automated actions, and execute incident commands.
        </p>
      </div>
    );
  }

  const { metadata, timeline, automatedTriggers, auditNotes } = selectedItem;

  const handlePostNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddAuditNote(selectedItem.id, noteInput.trim());
    setNoteInput("");
  };

  return (
    <div className="notifications-right-inspector-wrapper">
      {/* 1. Main Alert Inspector Card */}
      <div className="notifications-inspector-card" id="notifications-inspector-panel">
        {/* Header & Priority Badge */}
        <div className="notifications-inspector-header">
          <div>
            <span className="notifications-inspector-subhead">
              Alert Inspector &amp; Action Console
            </span>
            <h2 className="notifications-inspector-heading">
              {metadata?.tripId || selectedItem.title}
            </h2>
          </div>

          <span className="notifications-inspector-badge">
            {selectedItem.type === "critical"
              ? "Critical Severity"
              : selectedItem.type === "warning"
              ? "Warning Level"
              : "Operational Info"}
          </span>
        </div>

        {/* Incident Metadata Grid */}
        <div className="notifications-inspector-meta-grid">
          <div className="notifications-inspector-row alt">
            <span className="notifications-inspector-label">Corridor / Route</span>
            <span className="notifications-inspector-val">{selectedItem.corridor}</span>
          </div>

          <div className="notifications-inspector-row">
            <span className="notifications-inspector-label">Driver In-Charge</span>
            <div className="notifications-inspector-val">
              <div>{metadata?.driverName || "Assigned Carrier"}</div>
              <span style={{ fontSize: "11px", color: "var(--notif-outline)", fontWeight: 500 }}>
                {metadata?.driverPhone || "Verified"} {metadata?.driverRating ? `• ${metadata.driverRating}` : ""}
              </span>
            </div>
          </div>

          <div className="notifications-inspector-row alt">
            <span className="notifications-inspector-label">Assigned Vehicle</span>
            <span className="notifications-inspector-val font-mono">
              {metadata?.vehicleNumber || "Fleet Asset"}
            </span>
          </div>

          <div className="notifications-inspector-row">
            <span className="notifications-inspector-label">Consignor &amp; Cargo</span>
            <div className="notifications-inspector-val">
              <div>{metadata?.consignor || selectedItem.account}</div>
              <span style={{ fontSize: "11px", color: "var(--notif-error)", fontWeight: 600 }}>
                {metadata?.cargoType || "Standard Freight"}
              </span>
            </div>
          </div>

          <div className="notifications-inspector-row alt">
            <span className="notifications-inspector-label">Current Delay Delta</span>
            <span
              className="notifications-inspector-val"
              style={{ color: selectedItem.type === "critical" ? "var(--notif-error)" : "var(--notif-text)" }}
            >
              {metadata?.delayDelta || "Within Tolerance"}
            </span>
          </div>
        </div>

        {/* Telemetry Timeline Section */}
        {timeline && timeline.length > 0 && (
          <div className="notifications-timeline-container">
            <div className="notifications-timeline-header">
              <span className="notifications-timeline-title">Telemetry Audit Trail</span>
              <span className="notifications-timeline-ping">Live GPS Ping • 2m ago</span>
            </div>

            <div className="notifications-timeline-flow">
              {timeline.map((node, i) => (
                <div key={i} className="notifications-timeline-node">
                  <span
                    className={`notifications-timeline-dot ${node.status || "success"} ${
                      node.ping ? "ping" : ""
                    }`}
                  />
                  <div
                    className={`notifications-timeline-node-title ${
                      node.status === "error" ? "error" : ""
                    }`}
                  >
                    {node.time} • {node.title}
                  </div>
                  <div className="notifications-timeline-node-desc">{node.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Automated Policy Action Triggers */}
        {automatedTriggers && automatedTriggers.length > 0 && (
          <div className="notifications-triggers-box">
            <span className="notifications-triggers-title">
              <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--notif-primary)" }}>
                bolt
              </span>
              <span>Automated Triggers Executed</span>
            </span>

            {automatedTriggers.map((trig, i) => (
              <div key={i} className="notifications-trigger-item">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "16px",
                    color: i === 0 ? "var(--notif-success)" : "var(--notif-primary)",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  {i === 0 ? "check_circle" : "near_me"}
                </span>
                <span>{trig}</span>
              </div>
            ))}
          </div>
        )}

        {/* Incident Action Controls */}
        <div className="notifications-console-actions">
          <button
            type="button"
            className="notifications-btn-console-primary"
            onClick={() => onAcknowledge(selectedItem)}
            id="btn-acknowledge-alert"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              verified
            </span>
            <span>Acknowledge &amp; Dispatch Support Hub</span>
          </button>

          <div className="notifications-console-secondary-row">
            <button
              type="button"
              className="notifications-btn-console-sub"
              onClick={() => onCallDriver(selectedItem)}
              id="btn-call-driver"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#10b981" }}>
                call
              </span>
              <span>Call Driver</span>
            </button>

            <button
              type="button"
              className="notifications-btn-console-sub"
              onClick={() => onWaivePenalty(selectedItem)}
              id="btn-waive-penalty"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--notif-outline)" }}>
                tune
              </span>
              <span>Waive Penalty</span>
            </button>
          </div>
        </div>

        {/* Internal Ops Note Audit Box */}
        <div className="notifications-audit-note-box">
          <label className="notifications-inspector-subhead" htmlFor="audit-note-input">
            Internal Dispatch Audit Note
          </label>

          {auditNotes && auditNotes.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "4px" }}>
              {auditNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    fontSize: "11.5px",
                    border: "1px solid var(--notif-border)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--notif-outline)", marginBottom: "2px" }}>
                    <strong>{note.author}</strong>
                    <span>{note.time}</span>
                  </div>
                  <div style={{ color: "var(--notif-text)" }}>{note.text}</div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handlePostNote} className="notifications-audit-input-row">
            <input
              id="audit-note-input"
              type="text"
              className="notifications-audit-input"
              placeholder="Add resolution comment for ops shift logs..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <button type="submit" className="notifications-audit-post-btn">
              Post
            </button>
          </form>
        </div>
      </div>

      {/* 2. Quick Telemetry Map Card / Asset Snapshot */}
      {metadata?.locationCoords && (
        <div className="notifications-map-widget-card" style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="notifications-inspector-subhead">
              Stall Location Telemetry
            </span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--notif-outline)" }}>
              {metadata.locationCoords}
            </span>
          </div>

          <div className="notifications-map-visual">
            <div className="notifications-map-pill">
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--notif-error)",
                  display: "inline-block",
                  animation: "notifBeaconPulse 1.5s infinite ease-in-out",
                }}
              />
              <strong>{metadata.vehicleNumber?.split(" ")[0] || "Fleet Asset"} Halted</strong>
              <span>•</span>
              <span>{metadata.locationName || "Corridor Checkpoint"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

NotificationInspectorPanel.propTypes = {
  selectedItem: PropTypes.object,
  onAcknowledge: PropTypes.func.isRequired,
  onCallDriver: PropTypes.func.isRequired,
  onWaivePenalty: PropTypes.func.isRequired,
  onAddAuditNote: PropTypes.func.isRequired,
};
