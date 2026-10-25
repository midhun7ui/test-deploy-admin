import PropTypes from "prop-types";

function DashboardHeader({
  activePeriod,
  onChangePeriod,
  onRefresh,
  isRefreshing,
  lastUpdatedText,
}) {
  const periods = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month (Oct 2026)" },
    { id: "quarter", label: "Q3 Fiscal" },
  ];

  return (
    <section className="dashboard-header-banner" aria-label="Operations Overview Header">
      <div className="banner-left-content">
        <div className="banner-badge-row">
          <span className="operations-chip">
            <span className="material-symbols-outlined chip-icon">terminal</span>
            <span>CENTRAL OPERATIONS DESK</span>
          </span>
          <span className="corridor-status-tag">14 Active Interstate Corridors</span>
        </div>

        <h1 className="banner-main-title">Operations Command Center</h1>
        <p className="banner-lead-description">
          Unified control room for corporate B2B freight bookings, live corridor dispatch, driver
          settlements, and monthly statement reconciliation.
        </p>
      </div>

      <div className="banner-right-controls">
        {/* Time Period Filter Pills */}
        <div className="period-filter-group" role="radiogroup" aria-label="Select Time Period">
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`period-pill-btn ${activePeriod === p.id ? "active" : ""}`}
              onClick={() => onChangePeriod(p.id)}
              role="radio"
              aria-checked={activePeriod === p.id}
              id={`btn-period-${p.id}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Refresh & Last Updated Info */}
        <div className="refresh-status-cluster">
          <span className="last-updated-text">
            {lastUpdatedText || "Updated just now"}
          </span>

          <button
            type="button"
            className={`refresh-icon-btn ${isRefreshing ? "refreshing" : ""}`}
            id="btn-dashboard-refresh"
            onClick={onRefresh}
            title="Refresh Operational Telemetry"
            aria-label="Refresh Telemetry"
            disabled={isRefreshing}
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>
    </section>
  );
}

DashboardHeader.propTypes = {
  activePeriod: PropTypes.string.isRequired,
  onChangePeriod: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool,
  lastUpdatedText: PropTypes.string,
};

export default DashboardHeader;
