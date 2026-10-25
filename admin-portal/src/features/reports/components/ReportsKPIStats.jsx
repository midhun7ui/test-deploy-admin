import PropTypes from "prop-types";

export default function ReportsKPIStats({ kpiData }) {
  const {
    totalBilledRevenue,
    completedTrips,
    fleetUtilization,
    platformGrossMargin,
  } = kpiData;

  return (
    <div className="reports-kpi-grid">
      {/* Card 1: Total Billed Revenue */}
      <div className="reports-kpi-card">
        <div>
          <div className="reports-kpi-header">
            <span className="reports-kpi-label">{totalBilledRevenue.label}</span>
            <div className="reports-kpi-icon-pod indigo">
              <span className="material-symbols-outlined">currency_rupee</span>
            </div>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-value">{totalBilledRevenue.value}</span>
            <span className="reports-kpi-trend-pill">
              <span className="material-symbols-outlined">trending_up</span>
              {totalBilledRevenue.trend}
            </span>
          </div>
          <p className="reports-kpi-subtext">{totalBilledRevenue.subtext}</p>
        </div>

        <div className="reports-kpi-footer">
          <div className="reports-kpi-target-row">
            <span>{totalBilledRevenue.targetText}</span>
            <span className="target-pct">{totalBilledRevenue.targetPct}%</span>
          </div>
          <div className="reports-progress-track">
            <div
              className="reports-progress-fill"
              style={{ width: `${totalBilledRevenue.targetPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Total Completed Trips */}
      <div className="reports-kpi-card">
        <div>
          <div className="reports-kpi-header">
            <span className="reports-kpi-label">{completedTrips.label}</span>
            <div className="reports-kpi-icon-pod slate">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-value">{completedTrips.value}</span>
            <span className="reports-kpi-trend-pill">
              <span className="material-symbols-outlined">trending_up</span>
              {completedTrips.trend}
            </span>
          </div>
          <p className="reports-kpi-subtext">{completedTrips.subtext}</p>
        </div>

        <div className="reports-kpi-footer">
          <div className="reports-trip-status-strip">
            <span className="on-time">
              <span className="dot" />
              {completedTrips.breakdown.onTime}
            </span>
            <span className="delay">{completedTrips.breakdown.delay}</span>
            <span className="disputed">{completedTrips.breakdown.disputed}</span>
          </div>
        </div>
      </div>

      {/* Card 3: Fleet & Driver Utilization */}
      <div className="reports-kpi-card">
        <div>
          <div className="reports-kpi-header">
            <span className="reports-kpi-label">{fleetUtilization.label}</span>
            <div className="reports-kpi-icon-pod teal">
              <span className="material-symbols-outlined">speed</span>
            </div>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-value">{fleetUtilization.value}</span>
            <span className="reports-kpi-trend-pill">
              <span className="material-symbols-outlined">speed</span>
              {fleetUtilization.trend}
            </span>
          </div>
          <p className="reports-kpi-subtext">{fleetUtilization.subtext}</p>
        </div>

        <div className="reports-kpi-footer">
          <div className="reports-kpi-turnaround-row">
            <span>{fleetUtilization.turnaroundLabel}</span>
            <span className="turnaround-badge">
              {fleetUtilization.turnaroundValue}
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: Platform Gross Margin & Net Take */}
      <div className="reports-kpi-card">
        <div>
          <div className="reports-kpi-header">
            <span className="reports-kpi-label">{platformGrossMargin.label}</span>
            <div className="reports-kpi-icon-pod periwinkle">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-value">{platformGrossMargin.value}</span>
            <span className="reports-kpi-cut-pill">
              {platformGrossMargin.badge}
            </span>
          </div>
          <p className="reports-kpi-subtext">{platformGrossMargin.subtext}</p>
        </div>

        <div className="reports-kpi-footer">
          <div className="reports-kpi-deficit-row">
            <span className="material-symbols-outlined">verified</span>
            <span className="truncate">{platformGrossMargin.note}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

ReportsKPIStats.propTypes = {
  kpiData: PropTypes.shape({
    totalBilledRevenue: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      trend: PropTypes.string.isRequired,
      trendUp: PropTypes.bool.isRequired,
      subtext: PropTypes.string.isRequired,
      targetText: PropTypes.string.isRequired,
      targetPct: PropTypes.number.isRequired,
    }).isRequired,
    completedTrips: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      trend: PropTypes.string.isRequired,
      trendUp: PropTypes.bool.isRequired,
      subtext: PropTypes.string.isRequired,
      breakdown: PropTypes.shape({
        onTime: PropTypes.string.isRequired,
        delay: PropTypes.string.isRequired,
        disputed: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    fleetUtilization: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      trend: PropTypes.string.isRequired,
      trendUp: PropTypes.bool.isRequired,
      subtext: PropTypes.string.isRequired,
      turnaroundLabel: PropTypes.string.isRequired,
      turnaroundValue: PropTypes.string.isRequired,
    }).isRequired,
    platformGrossMargin: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      badge: PropTypes.string.isRequired,
      subtext: PropTypes.string.isRequired,
      note: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
