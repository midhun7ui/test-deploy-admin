import PropTypes from "prop-types";

export default function AuditEventInspectorPanel({
  event,
  onCopyPayload,
  onViewActorTrace,
  onFlagReview,
  onDownloadReceipt,
}) {
  if (!event) {
    return (
      <div className="audit-inspector-pane" style={{ textAlign: "center", padding: "40px 20px" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "var(--audit-outline)" }}>
          policy
        </span>
        <p style={{ margin: "10px 0 0 0", fontSize: "13px", color: "var(--audit-text-muted)" }}>
          Select an event from the telemetry stream to inspect actor context, JSON payload diffs, and cryptographic signatures.
        </p>
      </div>
    );
  }

  return (
    <div className="audit-inspector-pane" id="audit-event-inspector">
      {/* Inspector Header */}
      <div className="audit-inspector-header">
        <div>
          <div className="audit-inspector-title">
            <span>Event Inspector</span>
            <span className={`audit-kpi-pill ${event.severityClass || "primary"}`}>
              {event.severity.toUpperCase()} SEVERITY
            </span>
          </div>
          <p className="audit-inspector-trace">
            {event.eventNumber} • TraceID: {event.traceId}
          </p>
        </div>

        <button
          type="button"
          className="admin-action-icon-btn"
          style={{ backgroundColor: "var(--audit-surface-high)" }}
          onClick={() => onDownloadReceipt?.(event)}
          title="Download Cryptographic Receipt"
          id="btn-download-audit-receipt"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>receipt</span>
        </button>
      </div>

      {/* Actor Security Context Box */}
      <div className="audit-context-box">
        <div className="audit-context-actor-row">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="audit-context-avatar">{event.actor.initials}</div>
            <div>
              <strong style={{ fontSize: "13px", color: "var(--audit-text)", display: "block", lineHeight: 1.2 }}>
                {event.actor.name}
              </strong>
              <span style={{ fontSize: "11px", color: "var(--audit-text-muted)" }}>
                {event.actor.role} • {event.actor.empId}
              </span>
            </div>
          </div>
          <span className="audit-kpi-pill primary">{event.actor.authBadge}</span>
        </div>

        <div className="audit-context-grid">
          <div>
            <span className="audit-context-cell-label">Client IP &amp; Node</span>
            <span className="audit-context-cell-val" style={{ fontFamily: "monospace" }}>
              {event.actor.ip} ({event.actor.node})
            </span>
          </div>
          <div>
            <span className="audit-context-cell-label">Device Fingerprint</span>
            <span className="audit-context-cell-val">{event.actor.device}</span>
          </div>
          <div>
            <span className="audit-context-cell-label">Session Reference</span>
            <span className="audit-context-cell-val" style={{ fontFamily: "monospace" }}>
              {event.actor.session}
            </span>
          </div>
          <div>
            <span className="audit-context-cell-label">Token Auth Mechanism</span>
            <span className="audit-context-cell-val">{event.actor.authMechanism}</span>
          </div>
        </div>
      </div>

      {/* State Mutation Payload (JSON Diff Viewer) */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--audit-outline)" }}>
            State Mutation Payload (JSON Diff)
          </span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--audit-primary)" }}>
            {event.jsonDiff?.diffLines?.filter((l) => l.type !== "context").length || 2} keys mutated
          </span>
        </div>

        <div className="audit-diff-box">
          <div className="audit-diff-node-comment">// Target Node: {event.jsonDiff?.node}</div>
          <div style={{ color: "#94a3b8" }}>&#123;</div>
          {event.jsonDiff?.diffLines?.map((line, idx) => {
            if (line.type === "removed") {
              return (
                <div key={idx} className="audit-diff-line-removed">
                  {line.text}
                </div>
              );
            }
            if (line.type === "added") {
              return (
                <div key={idx} className="audit-diff-line-added">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={idx} style={{ paddingLeft: "12px", color: "#e2e8f0" }}>
                {line.text}
              </div>
            );
          })}
          <div style={{ color: "#94a3b8" }}>&#125;</div>
        </div>
      </div>

      {/* Dual-Key Governance Consensus Record */}
      <div className="audit-consensus-box">
        <span style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--audit-outline)" }}>
          Dual-Key Governance Consensus
        </span>

        {/* Signer 1 */}
        <div className="audit-consensus-signer">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--audit-primary)" }}>
              key
            </span>
            <div>
              <strong style={{ display: "block", color: "var(--audit-text)", fontSize: "12px" }}>
                Initiator: {event.consensus?.initiator?.name}
              </strong>
              <span style={{ fontSize: "11px", color: "var(--audit-outline)" }}>
                {event.consensus?.initiator?.role} • {event.consensus?.initiator?.time}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#059669" }}>
            check_circle
          </span>
        </div>

        {/* Signer 2 */}
        <div className="audit-consensus-signer">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--audit-primary)" }}>
              verified
            </span>
            <div>
              <strong style={{ display: "block", color: "var(--audit-text)", fontSize: "12px" }}>
                Co-Signer: {event.consensus?.cosigner?.name}
              </strong>
              <span style={{ fontSize: "11px", color: "var(--audit-outline)" }}>
                {event.consensus?.cosigner?.role} • {event.consensus?.cosigner?.time}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#059669" }}>
            check_circle
          </span>
        </div>

        {/* Signature Hash */}
        <div className="audit-sig-hash-box">
          <span className="material-symbols-outlined" style={{ fontSize: "14px", verticalAlign: "middle", marginRight: "4px", color: "var(--audit-primary)" }}>
            lock
          </span>
          <span>{event.consensus?.hashSignature}</span>
        </div>
      </div>

      {/* Downstream SIEM Dispatch */}
      <div>
        <span style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--audit-outline)", display: "block", marginBottom: "6px" }}>
          Downstream SIEM Dispatch
        </span>
        <div className="audit-siem-status-grid">
          <div className="audit-siem-card">
            <strong style={{ color: "var(--audit-text)" }}>Splunk Enterprise</strong>
            <span className="audit-kpi-pill success">{event.siemDispatch?.splunk}</span>
          </div>
          <div className="audit-siem-card">
            <strong style={{ color: "var(--audit-text)" }}>Datadog SIEM</strong>
            <span className="audit-kpi-pill secondary">{event.siemDispatch?.datadog}</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="audit-inspector-actions-stack">
        <button
          type="button"
          className="audit-btn-secondary"
          style={{ justifyContent: "center", height: "36px" }}
          onClick={() => onCopyPayload?.(event)}
          id="btn-copy-raw-json"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>content_copy</span>
          <span>Copy Raw JSON Event Payload</span>
        </button>

        <button
          type="button"
          className="audit-btn-secondary"
          style={{ justifyContent: "center", height: "36px" }}
          onClick={() => onViewActorTrace?.(event.actor)}
          id="btn-view-actor-trace"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>history</span>
          <span>View Actor Full Session Trace ({event.actor.name.split(" ")[0]})</span>
        </button>

        <button
          type="button"
          className="admin-btn-suspend"
          style={{ justifyContent: "center", height: "36px" }}
          onClick={() => onFlagReview?.(event)}
          id="btn-flag-security-review"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>gavel</span>
          <span>Flag for Security Review / Revoke Change</span>
        </button>
      </div>
    </div>
  );
}

AuditEventInspectorPanel.propTypes = {
  event: PropTypes.object,
  onCopyPayload: PropTypes.func.isRequired,
  onViewActorTrace: PropTypes.func.isRequired,
  onFlagReview: PropTypes.func.isRequired,
  onDownloadReceipt: PropTypes.func.isRequired,
};
