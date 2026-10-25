import PropTypes from "prop-types";

export default function CohortDeepDiveModal({ isOpen, onClose, cohortItem }) {
  if (!isOpen || !cohortItem) return null;

  const isHub = !!cohortItem.hubId;
  const isCorridor = !!cohortItem.corridor;

  const title = isHub
    ? cohortItem.hubName
    : isCorridor
    ? cohortItem.corridor
    : cohortItem.name;

  const subtitle = isHub
    ? `Hub Code: ${cohortItem.hubId} • ${cohortItem.city}`
    : isCorridor
    ? `Corridor ID: ${cohortItem.id} • Saturation: ${cohortItem.saturationPct}%`
    : `Enterprise ID: ${cohortItem.id} • ${cohortItem.industry}`;

  const iconName = isHub ? "warehouse" : isCorridor ? "radar" : "corporate_fare";

  const handleDownloadAudit = () => {
    const lines = [
      `HIRED PERFORMANCE ANALYTICS - AUDIT SHEET`,
      `Generated At: ${new Date().toISOString()}`,
      `Subject: ${title}`,
      `Metadata: ${subtitle}`,
      `------------------------------------------`,
    ];

    if (isHub) {
      lines.push(`Total Turnaround: ${cohortItem.dwellHours} Hours`);
      lines.push(`Target Turnaround: ${cohortItem.targetHours} Hours`);
      lines.push(`Status: ${cohortItem.statusLabel}`);
      lines.push(`Throughput Volume: ${cohortItem.throughputTrips} Trips`);
      lines.push(`Efficiency Score: ${cohortItem.efficiencyScore}%`);
      lines.push(`Inbound Yard Queue: ${cohortItem.queueMins} mins`);
      lines.push(`Loading & Lashing: ${cohortItem.loadingMins} mins`);
      lines.push(`Gate Out Clearance: ${cohortItem.gateMins} mins`);
    } else if (isCorridor) {
      lines.push(`Corridor Lane: ${cohortItem.corridor}`);
      lines.push(`Saturation: ${cohortItem.saturationPct}%`);
      lines.push(`Status: ${cohortItem.statusLabel}`);
      lines.push(`Active Trucks: ${cohortItem.activeTrucks}`);
      lines.push(`Queued Loads: ${cohortItem.queuedLoads || 0}`);
      lines.push(`Deficit Action: ${cohortItem.deficitAction}`);
      lines.push(`Velocity Trend: ${cohortItem.trend}`);
    } else {
      lines.push(`Enterprise Client: ${cohortItem.name}`);
      lines.push(`Industry: ${cohortItem.industry}`);
      lines.push(`Weekly Loads: ${cohortItem.weeklyLoads}`);
      lines.push(`Allocated Tonnage: ${cohortItem.capacityAllocatedMt} MT`);
      lines.push(`Average Dispatch: ${cohortItem.avgDispatchTime}`);
      lines.push(`Fulfillment SLA: ${cohortItem.fulfillmentSla}`);
      lines.push(`Retention: ${cohortItem.retentionScore}`);
      lines.push(`Tier Status: ${cohortItem.status}`);
    }

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_${String(title).toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="analytics-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="analytics-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="analytics-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--an-primary-container)" }}>
              {iconName}
            </span>
            <div>
              <h2 className="analytics-modal-title">{title}</h2>
              <span style={{ fontSize: "11px", color: "var(--an-outline)", fontWeight: 600 }}>
                {subtitle}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="analytics-modal-close-btn"
            onClick={onClose}
            aria-label="Close cohort details modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="analytics-modal-body">
          {isHub ? (
            /* Hub Dwell Deep Dive */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="analytics-sim-results-grid">
                <div className="analytics-sim-box">
                  <span className="analytics-sim-box-title">Total Turnaround</span>
                  <span className="analytics-sim-box-val">{cohortItem.dwellHours} Hours</span>
                  <span style={{ fontSize: "11px", color: "var(--an-outline)" }}>
                    Target: {cohortItem.targetHours}h ({cohortItem.statusLabel})
                  </span>
                </div>

                <div className="analytics-sim-box">
                  <span className="analytics-sim-box-title">Throughput Capacity</span>
                  <span className="analytics-sim-box-val" style={{ color: "var(--an-text)" }}>
                    {cohortItem.throughputTrips} Trips / Mo
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--an-green)", fontWeight: 600 }}>
                    {cohortItem.efficiencyScore}% Efficiency Score
                  </span>
                </div>
              </div>

              <div style={{ background: "var(--an-surface-low)", padding: "14px", borderRadius: "8px", border: "1px solid var(--an-border)" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--an-text)", display: "block", marginBottom: "8px" }}>
                  Dock Turnaround Stage Latencies:
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--an-text-muted)" }}>Inbound Yard Queue:</span>
                    <span style={{ fontWeight: 700 }}>{cohortItem.queueMins} mins</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--an-text-muted)" }}>Loading &amp; Pallet Lashing:</span>
                    <span style={{ fontWeight: 700 }}>{cohortItem.loadingMins} mins</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--an-text-muted)" }}>FASTag &amp; Gate Out Documentation:</span>
                    <span style={{ fontWeight: 700 }}>{cohortItem.gateMins} mins</span>
                  </div>
                </div>
              </div>
            </div>
          ) : isCorridor ? (
            /* Corridor Deep Dive */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="analytics-sim-results-grid">
                <div className="analytics-sim-box">
                  <span className="analytics-sim-box-title">Payload Saturation</span>
                  <span className="analytics-sim-box-val" style={{ color: cohortItem.saturationPct >= 85 ? "var(--an-danger)" : "var(--an-text)" }}>
                    {cohortItem.saturationPct}%
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--an-outline)" }}>
                    {cohortItem.statusLabel}
                  </span>
                </div>

                <div className="analytics-sim-box">
                  <span className="analytics-sim-box-title">Active Trucks on Lane</span>
                  <span className="analytics-sim-box-val" style={{ color: "var(--an-text)" }}>
                    {cohortItem.activeTrucks} Trucks
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--an-green)", fontWeight: 600 }}>
                    {cohortItem.queuedLoads || 0} Queued Loads
                  </span>
                </div>
              </div>

              <div style={{ background: "var(--an-surface-low)", padding: "14px", borderRadius: "8px", border: "1px solid var(--an-border)" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--an-text)", display: "block", marginBottom: "8px" }}>
                  Capacity &amp; Reallocation Strategy:
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--an-text-muted)" }}>Recommended Action:</span>
                    <span style={{ fontWeight: 700, color: "var(--an-primary-container)" }}>{cohortItem.deficitAction}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--an-text-muted)" }}>Demand Velocity Trend:</span>
                    <span style={{ fontWeight: 700 }}>{cohortItem.trend}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--an-text-muted)" }}>Status Classification:</span>
                    <span style={{ fontWeight: 700, textTransform: "uppercase" }}>{cohortItem.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Enterprise Account Deep Dive */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="analytics-sim-results-grid">
                <div className="analytics-sim-box">
                  <span className="analytics-sim-box-title">Weekly Load Volume</span>
                  <span className="analytics-sim-box-val">{cohortItem.weeklyLoads} Loads / Wk</span>
                  <span style={{ fontSize: "11px", color: "var(--an-green)", fontWeight: 600 }}>
                    {cohortItem.trend}
                  </span>
                </div>

                <div className="analytics-sim-box">
                  <span className="analytics-sim-box-title">Tonnage Allocated</span>
                  <span className="analytics-sim-box-val" style={{ color: "var(--an-text)" }}>
                    {cohortItem.capacityAllocatedMt} MT
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--an-outline)" }}>
                    Avg Dispatch: {cohortItem.avgDispatchTime}
                  </span>
                </div>
              </div>

              <div style={{ background: "var(--an-surface-low)", padding: "14px", borderRadius: "8px", border: "1px solid var(--an-border)" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--an-text)", display: "block", marginBottom: "8px" }}>
                  Account Fulfillment &amp; SLA Compliance:
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--an-text-muted)" }}>On-Time Delivery SLA:</span>
                    <span style={{ fontWeight: 700, color: "var(--an-green)" }}>{cohortItem.fulfillmentSla}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--an-text-muted)" }}>Quarterly Repeat / Retention:</span>
                    <span style={{ fontWeight: 700 }}>{cohortItem.retentionScore}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--an-text-muted)" }}>Account Cohort Status:</span>
                    <span style={{ fontWeight: 700, textTransform: "uppercase", color: "var(--an-primary-container)" }}>
                      {cohortItem.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="analytics-modal-footer">
          <button type="button" className="analytics-btn-modal-cancel" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="analytics-btn-modal-primary"
            onClick={handleDownloadAudit}
          >
            Download Audit Report
          </button>
        </div>
      </div>
    </div>
  );
}

CohortDeepDiveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cohortItem: PropTypes.object,
};
