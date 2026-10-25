import PropTypes from "prop-types";

export default function EnterpriseExposureWidget({ accounts, onViewAll }) {
  return (
    <div className="reports-widget-card">
      <div className="reports-widget-header">
        <div>
          <h3 className="reports-widget-title">Enterprise Account Exposure</h3>
          <p className="reports-widget-subtitle">
            Top revenue contributors &amp; escrow status
          </p>
        </div>
        <button
          type="button"
          className="reports-view-all-link"
          onClick={onViewAll}
        >
          View All ({accounts?.length || 0})
        </button>
      </div>

      <div className="reports-exposure-list">
        {(!accounts || accounts.length === 0) ? (
          <div style={{ textAlign: "center", padding: "24px 12px", color: "var(--rep-outline, #64748b)", fontSize: "12.5px" }}>
            No enterprise exposure accounts registered yet.
          </div>
        ) : (
          accounts.map((acc) => (
            <div key={acc.id} className="reports-exposure-item">
              <div className="reports-exposure-top-row">
                <span className="reports-client-name">{acc.name}</span>
                <span className="reports-client-rev">{acc.revenue || acc.totalExposure || "₹0.00"}</span>
              </div>
              <div className="reports-exposure-bottom-row">
                <span>{acc.shareText || `${acc.ordersCount || 0} Orders`}</span>
                <span className={`reports-client-status ${acc.statusType || acc.statusClass || "compliant"}`}>
                  {acc.statusBadge || acc.status || "Compliant"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

EnterpriseExposureWidget.propTypes = {
  accounts: PropTypes.array,
  onViewAll: PropTypes.func.isRequired,
};
