import PropTypes from "prop-types";

export default function EnterpriseDemandMatrix({ cohorts = [], onSelectAccount }) {
  return (
    <div className="analytics-widget-card" id="widget-retention">
      <div className="analytics-widget-header">
        <div>
          <h3 className="analytics-widget-title">Enterprise Demand Acceleration</h3>
          <p className="analytics-widget-subtitle">
            Booking demand velocity cohorts across top enterprise clients
          </p>
        </div>

        <span className="material-symbols-outlined" style={{ color: "var(--an-primary)" }}>
          corporate_fare
        </span>
      </div>

      {!cohorts || cohorts.length === 0 ? (
        <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--an-text-muted)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "36px", opacity: 0.5, display: "block", marginBottom: "8px" }}>
            corporate_fare
          </span>
          <p style={{ margin: 0, fontSize: "13px" }}>No enterprise client demand cohorts found.</p>
        </div>
      ) : (
        <div className="analytics-enterprise-list">
          {cohorts.map((cohort) => (
            <div
              key={cohort.id}
              className="analytics-enterprise-item"
              onClick={() => onSelectAccount && onSelectAccount(cohort)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelectAccount && onSelectAccount(cohort);
                }
              }}
              aria-label={`Inspect ${cohort.name} cohort metrics`}
            >
              <div className="analytics-ent-left">
                <span className="analytics-ent-name">{cohort.name}</span>
                <span className="analytics-ent-sub">
                  {cohort.industry} • SLA {cohort.fulfillmentSla}
                </span>
              </div>

              <div className="analytics-ent-right">
                <span className="analytics-ent-loads">{cohort.weeklyLoads} loads/wk</span>
                <span className="analytics-ent-trend">{cohort.trend}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

EnterpriseDemandMatrix.propTypes = {
  cohorts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      industry: PropTypes.string.isRequired,
      weeklyLoads: PropTypes.number.isRequired,
      capacityAllocatedMt: PropTypes.number.isRequired,
      avgDispatchTime: PropTypes.string.isRequired,
      fulfillmentSla: PropTypes.string.isRequired,
      retentionScore: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      trend: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelectAccount: PropTypes.func,
};
