import PropTypes from "prop-types";

export default function AnalyticsKPIStats({ kpiData }) {
  const { bookingVelocity, capacityUtilization, hubDwellTime, clientRetention } = kpiData;

  return (
    <div className="analytics-kpi-grid">
      {/* KPI 1: Client Booking Velocity */}
      <div className="analytics-kpi-card">
        <div className="analytics-kpi-top">
          <span className="analytics-kpi-label">{bookingVelocity.label}</span>
          <span className="analytics-kpi-trend positive">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              trending_up
            </span>
            {bookingVelocity.trend}
          </span>
        </div>

        <div className="analytics-kpi-middle">
          <div className="analytics-kpi-value">{bookingVelocity.value}</div>
          <div className="analytics-kpi-sparkline" title="7-Day velocity pacing">
            {bookingVelocity.sparkline.map((val, idx) => {
              const maxSpark = Math.max(1, ...(bookingVelocity.sparkline || [1]));
              const heightPct = val > 0 ? Math.max(25, Math.min(100, Math.round((val / maxSpark) * 100))) : 12;
              return (
                <span
                  key={idx}
                  className="analytics-kpi-sparkbar"
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>
        </div>

        <p className="analytics-kpi-subtext">{bookingVelocity.subtext}</p>

        <div className="analytics-kpi-footer">
          <span>{bookingVelocity.totalBookings}</span>
          <span>{bookingVelocity.period}</span>
        </div>
      </div>

      {/* KPI 2: Tonnage Capacity Utilization */}
      <div className="analytics-kpi-card">
        <div className="analytics-kpi-top">
          <span className="analytics-kpi-label">{capacityUtilization.label}</span>
          <span className="analytics-kpi-trend positive">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              bolt
            </span>
            {capacityUtilization.trend}
          </span>
        </div>

        <div className="analytics-kpi-middle">
          <div className="analytics-kpi-value">{capacityUtilization.value}</div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--an-primary-container)",
              backgroundColor: "rgba(81, 69, 245, 0.08)",
              padding: "3px 8px",
              borderRadius: "4px",
            }}
          >
            {capacityUtilization.deadheadPct}
          </span>
        </div>

        <p className="analytics-kpi-subtext">{capacityUtilization.subtext}</p>

        <div className="analytics-kpi-footer">
          <span>{capacityUtilization.benchmarkNote}</span>
          <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--an-green)" }}>
            check_circle
          </span>
        </div>
      </div>

      {/* KPI 3: Avg Hub Loading Dwell */}
      <div className="analytics-kpi-card">
        <div className="analytics-kpi-top">
          <span className="analytics-kpi-label">{hubDwellTime.label}</span>
          <span className="analytics-kpi-trend positive">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              speed
            </span>
            {hubDwellTime.trend}
          </span>
        </div>

        <div className="analytics-kpi-middle">
          <div className="analytics-kpi-value">{hubDwellTime.value}</div>
          <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--an-secondary)" }}>
            warehouse
          </span>
        </div>

        <p className="analytics-kpi-subtext">{hubDwellTime.subtext}</p>

        <div className="analytics-kpi-footer">
          <span>{hubDwellTime.breakdown.dockQueue}</span>
          <span>{hubDwellTime.breakdown.gateOut}</span>
        </div>
      </div>

      {/* KPI 4: Enterprise Client Retention */}
      <div className="analytics-kpi-card">
        <div className="analytics-kpi-top">
          <span className="analytics-kpi-label">{clientRetention.label}</span>
          <span
            className="analytics-kpi-trend"
            style={{
              backgroundColor: "rgba(0, 168, 255, 0.12)",
              color: "#0284c7",
              border: "1px solid rgba(0, 168, 255, 0.3)",
            }}
          >
            {clientRetention.badge}
          </span>
        </div>

        <div className="analytics-kpi-middle">
          <div className="analytics-kpi-value">{clientRetention.value}</div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--an-text-muted)",
            }}
          >
            {clientRetention.activeAccounts}/{clientRetention.totalAccounts} Active
          </span>
        </div>

        <p className="analytics-kpi-subtext">{clientRetention.subtext}</p>

        <div className="analytics-kpi-footer">
          <span>{clientRetention.note}</span>
          <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--an-primary)" }}>
            verified
          </span>
        </div>
      </div>
    </div>
  );
}

AnalyticsKPIStats.propTypes = {
  kpiData: PropTypes.shape({
    bookingVelocity: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      trend: PropTypes.string.isRequired,
      subtext: PropTypes.string.isRequired,
      totalBookings: PropTypes.string.isRequired,
      period: PropTypes.string.isRequired,
      sparkline: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
    capacityUtilization: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      trend: PropTypes.string.isRequired,
      subtext: PropTypes.string.isRequired,
      deadheadPct: PropTypes.string.isRequired,
      benchmarkNote: PropTypes.string.isRequired,
    }).isRequired,
    hubDwellTime: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      trend: PropTypes.string.isRequired,
      subtext: PropTypes.string.isRequired,
      breakdown: PropTypes.shape({
        dockQueue: PropTypes.string.isRequired,
        loading: PropTypes.string.isRequired,
        gateOut: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    clientRetention: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      badge: PropTypes.string.isRequired,
      subtext: PropTypes.string.isRequired,
      note: PropTypes.string.isRequired,
      activeAccounts: PropTypes.number.isRequired,
      totalAccounts: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
