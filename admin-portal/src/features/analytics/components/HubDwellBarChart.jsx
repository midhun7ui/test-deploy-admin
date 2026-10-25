import PropTypes from "prop-types";

export default function HubDwellBarChart({ hubMetrics = [], onSelectHub }) {
  const maxHours = Math.max(3.5, ...hubMetrics.map((h) => h.dwellHours || 0));

  return (
    <div className="analytics-widget-card" id="widget-dwell">
      <div className="analytics-widget-header">
        <div>
          <h3 className="analytics-widget-title">Hub Loading Dwell &amp; Turnaround Cycle</h3>
          <p className="analytics-widget-subtitle">
            Average gate-in to gate-out turnaround latency across regional hub fulfillment centers
          </p>
        </div>

        <div className="analytics-time-pills">
          <span style={{ fontSize: "11px", color: "var(--an-outline)", fontWeight: 600 }}>
            Target Baseline: 2.5h Max
          </span>
        </div>
      </div>

      {!hubMetrics || hubMetrics.length === 0 ? (
        <div style={{ padding: "36px 16px", textAlign: "center", color: "var(--an-text-muted)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "36px", opacity: 0.5, display: "block", marginBottom: "8px" }}>
            warehouse
          </span>
          <p style={{ margin: 0, fontSize: "13px" }}>No regional hub dwell telemetry recorded for the selected filter.</p>
        </div>
      ) : (
        <div className="analytics-hub-bars-container">
          {hubMetrics.map((hub) => {
            const barWidthPct = Math.min(100, Math.round((hub.dwellHours / maxHours) * 100));

          let barColor = "var(--an-green)";
          if (hub.status === "watch") barColor = "var(--an-amber)";
          if (hub.status === "alert") barColor = "var(--an-danger)";

          return (
            <div
              key={hub.hubId}
              className="analytics-hub-bar-row"
              onClick={() => onSelectHub && onSelectHub(hub)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelectHub && onSelectHub(hub);
                }
              }}
              aria-label={`Inspect ${hub.hubName} dwell details`}
            >
              <div className="analytics-hub-bar-meta">
                <div className="analytics-hub-name">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--an-secondary)" }}>
                    warehouse
                  </span>
                  <span>{hub.hubName}</span>
                  <span className="analytics-hub-city">({hub.city})</span>
                </div>

                <div className="analytics-hub-stats">
                  <span className="analytics-hub-dwell">
                    {hub.dwellHours}h{" "}
                    <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--an-outline)" }}>
                      (Target {hub.targetHours}h)
                    </span>
                  </span>

                  <span className={`analytics-hub-status-badge ${hub.status}`}>
                    {hub.statusLabel}
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="analytics-hub-progress-track">
                <div
                  className="analytics-hub-progress-bar"
                  style={{
                    width: `${barWidthPct}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>

              {/* Breakdown details */}
              <div className="analytics-hub-breakdown-strip">
                <span>Inbound: {hub.queueMins}m</span>
                <span>•</span>
                <span>Loading: {hub.loadingMins}m</span>
                <span>•</span>
                <span>Gate Out: {hub.gateMins}m</span>
                <span>•</span>
                <span>Throughput: {hub.throughputTrips} loads</span>
                <span>•</span>
                <span style={{ fontWeight: 700, color: "var(--an-text)" }}>
                  Efficiency: {hub.efficiencyScore}%
                </span>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}

HubDwellBarChart.propTypes = {
  hubMetrics: PropTypes.arrayOf(
    PropTypes.shape({
      hubId: PropTypes.string.isRequired,
      hubName: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      dwellHours: PropTypes.number.isRequired,
      targetHours: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      statusLabel: PropTypes.string.isRequired,
      queueMins: PropTypes.number.isRequired,
      loadingMins: PropTypes.number.isRequired,
      gateMins: PropTypes.number.isRequired,
      throughputTrips: PropTypes.number.isRequired,
      efficiencyScore: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSelectHub: PropTypes.func,
};
