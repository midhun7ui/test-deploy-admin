import PropTypes from "prop-types";

export default function CapacityBottleneckRadar({ bottlenecks = [], onSelectCorridor }) {
  return (
    <div className="analytics-widget-card" id="widget-bottlenecks">
      <div className="analytics-widget-header">
        <div>
          <h3 className="analytics-widget-title">Corridor Bottleneck Radar</h3>
          <p className="analytics-widget-subtitle">
            Lane payload capacity saturation &amp; dispatch deficit monitoring
          </p>
        </div>

        <span className="material-symbols-outlined" style={{ color: "var(--an-danger)" }}>
          radar
        </span>
      </div>

      {!bottlenecks || bottlenecks.length === 0 ? (
        <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--an-text-muted)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "36px", opacity: 0.5, display: "block", marginBottom: "8px" }}>
            radar
          </span>
          <p style={{ margin: 0, fontSize: "13px" }}>No corridor bottlenecks detected. Fleet capacity is balanced.</p>
        </div>
      ) : (
        <div className="analytics-bottlenecks-list">
        {bottlenecks.map((item) => (
          <div
            key={item.id}
            className="analytics-bottleneck-card"
            onClick={() => onSelectCorridor && onSelectCorridor(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectCorridor && onSelectCorridor(item);
              }
            }}
            aria-label={`Inspect ${item.corridor} capacity status`}
          >
            <div className="analytics-bot-header">
              <span className="analytics-bot-corridor">
                <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--an-secondary)" }}>
                  trending_flat
                </span>
                {item.corridor}
              </span>

              <span className={`analytics-bot-pill ${item.status}`}>
                {item.statusLabel}
              </span>
            </div>

            {/* Meter fill */}
            <div className="analytics-bot-meter">
              <div
                className={`analytics-bot-meter-fill ${item.status}`}
                style={{ width: `${item.saturationPct}%` }}
              />
            </div>

            <div className="analytics-bot-footer">
              <span>{item.activeTrucks} Trucks Active</span>
              <span style={{ fontWeight: 600, color: item.status === "critical" ? "var(--an-danger)" : "var(--an-text)" }}>
                {item.deficitAction}
              </span>
              <span>{item.trend}</span>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

CapacityBottleneckRadar.propTypes = {
  bottlenecks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      corridor: PropTypes.string.isRequired,
      saturationPct: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      statusLabel: PropTypes.string.isRequired,
      activeTrucks: PropTypes.number.isRequired,
      queuedLoads: PropTypes.number.isRequired,
      deficitAction: PropTypes.string.isRequired,
      trend: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelectCorridor: PropTypes.func,
};
