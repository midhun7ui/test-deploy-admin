import PropTypes from "prop-types";

function TripKPIStats({ stats, onCardClick, activeFilter }) {
  return (
    <div className="trip-kpi-ribbons-grid">
      {/* 1. Active Trips */}
      <div
        className={`trip-kpi-card ${activeFilter === "ALL" ? "kpi-card-selected" : ""}`}
        onClick={() => onCardClick?.("ALL")}
        role="button"
        tabIndex={0}
      >
        <div className="trip-kpi-header">
          <span className="trip-kpi-title">Active Trips</span>
          <div className="trip-kpi-icon-box bg-blue-tint">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
        </div>
        <div className="trip-kpi-metric-row">
          <span className="trip-kpi-large-number">{stats.activeTrips}</span>
          <span className="trip-kpi-sub-badge text-primary">{stats.inTransit} in transit</span>
        </div>
        <div className="trip-kpi-footer-row">
          <span className="material-symbols-outlined trip-kpi-footer-icon">alt_route</span>
          <span>{stats.atDock} at dock / loading</span>
        </div>
      </div>

      {/* 2. On-Time SLA Rate */}
      <div
        className={`trip-kpi-card ${activeFilter === "ON_TIME" ? "kpi-card-selected" : ""}`}
        onClick={() => onCardClick?.("ON_TIME")}
        role="button"
        tabIndex={0}
      >
        <div className="trip-kpi-header">
          <span className="trip-kpi-title">On-Time SLA Rate</span>
          <div className="trip-kpi-icon-box bg-light-purple">
            <span className="material-symbols-outlined">verified</span>
          </div>
        </div>
        <div className="trip-kpi-metric-row">
          <span className="trip-kpi-large-number">{stats.slaRate}</span>
          <span className="trip-kpi-change-pill text-positive">{stats.slaChange}</span>
        </div>
        <div className="trip-kpi-footer-row">
          <span>{stats.slaTarget}</span>
        </div>
      </div>

      {/* 3. Awaiting Driver */}
      <div
        className={`trip-kpi-card ${activeFilter === "AWAITING_DRIVER" ? "kpi-card-selected" : ""}`}
        onClick={() => onCardClick?.("AWAITING_DRIVER")}
        role="button"
        tabIndex={0}
      >
        <div className="trip-kpi-header">
          <span className="trip-kpi-title">Awaiting Driver</span>
          <div className="trip-kpi-icon-box bg-error-tint">
            <span className="material-symbols-outlined text-error">person_alert</span>
          </div>
        </div>
        <div className="trip-kpi-metric-row">
          <span className="trip-kpi-large-number text-error">{stats.awaitingDriver}</span>
          <span className="trip-kpi-change-pill text-error-pill">Requires Action</span>
        </div>
        <div className="trip-kpi-footer-row">
          <span>Avg dispatch delay: {stats.avgDispatchDelay}</span>
        </div>
      </div>

      {/* 4. Exceptions / Delayed */}
      <div
        className={`trip-kpi-card ${activeFilter === "DELAYED" ? "kpi-card-selected" : ""}`}
        onClick={() => onCardClick?.("DELAYED")}
        role="button"
        tabIndex={0}
      >
        <div className="trip-kpi-header">
          <span className="trip-kpi-title">Exceptions / Delayed</span>
          <div className="trip-kpi-icon-box bg-warning-tint">
            <span className="material-symbols-outlined">warning</span>
          </div>
        </div>
        <div className="trip-kpi-metric-row">
          <span className="trip-kpi-large-number">{stats.delayedCount}</span>
          <span className="trip-kpi-sub-badge text-error font-semibold">
            {stats.criticalCount} critical
          </span>
        </div>
        <div className="trip-kpi-footer-row">
          <span>{stats.delayedCongestionNotice}</span>
        </div>
      </div>
    </div>
  );
}

TripKPIStats.propTypes = {
  stats: PropTypes.shape({
    activeTrips: PropTypes.number.isRequired,
    inTransit: PropTypes.number.isRequired,
    atDock: PropTypes.number.isRequired,
    slaRate: PropTypes.string.isRequired,
    slaChange: PropTypes.string.isRequired,
    slaTarget: PropTypes.string.isRequired,
    awaitingDriver: PropTypes.number.isRequired,
    avgDispatchDelay: PropTypes.string.isRequired,
    delayedCount: PropTypes.number.isRequired,
    criticalCount: PropTypes.number.isRequired,
    delayedCongestionNotice: PropTypes.string.isRequired,
  }).isRequired,
  onCardClick: PropTypes.func,
  activeFilter: PropTypes.string,
};

export default TripKPIStats;
