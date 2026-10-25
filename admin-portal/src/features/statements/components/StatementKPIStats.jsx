import PropTypes from "prop-types";

/**
 * StatementKPIStats - 4 metric cards matching Stitch Reference 11:
 * 1. Statements Generated (128, +14 this cycle, 84 Enterprise B2B · 44 Fleet Owners)
 * 2. Consolidated Billing (₹74,80,350, 88.4% billed, Total freight billables across all routes)
 * 3. Pending Reconciliation (08, Action Needed, 6 Unmatched UTRs · 2 Rate holds)
 * 4. Automated Dispatch (116 / 128, 90.6% Sent, Email trigger live · WhatsApp API synced)
 */
export default function StatementKPIStats({ kpiData, selectedFilter, onSelectFilter }) {
  if (!kpiData) return null;

  return (
    <section className="stmt-kpis-grid" aria-label="Statement metrics overview">
      {/* 1. Statements Generated */}
      <div
        className={`stmt-kpi-card ${selectedFilter === "all" ? "stmt-kpi-card--active" : ""}`}
        onClick={() => onSelectFilter && onSelectFilter("all")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectFilter && onSelectFilter("all");
          }
        }}
      >
        <div className="stmt-kpi-header">
          <span className="stmt-kpi-label">{kpiData.statementsGenerated.label}</span>
          <div className="stmt-kpi-icon-pod">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>receipt_long</span>
          </div>
        </div>
        <div>
          <div className="stmt-kpi-value-row">
            <span className="stmt-kpi-value">{kpiData.statementsGenerated.value}</span>
            <span className="stmt-kpi-badge stmt-kpi-badge--positive">
              {kpiData.statementsGenerated.trend}
            </span>
          </div>
          <p className="stmt-kpi-subtext">{kpiData.statementsGenerated.subtext}</p>
        </div>
        <div className="stmt-kpi-track">
          <div
            className="stmt-kpi-fill stmt-kpi-fill--primary"
            style={{ width: `${kpiData.statementsGenerated.progressPct}%` }}
          />
        </div>
      </div>

      {/* 2. Consolidated Billing */}
      <div
        className={`stmt-kpi-card ${selectedFilter === "b2b" ? "stmt-kpi-card--active" : ""}`}
        onClick={() => onSelectFilter && onSelectFilter("b2b")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectFilter && onSelectFilter("b2b");
          }
        }}
      >
        <div className="stmt-kpi-header">
          <span className="stmt-kpi-label">{kpiData.consolidatedBilling.label}</span>
          <div className="stmt-kpi-icon-pod stmt-kpi-icon-pod--secondary">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>account_balance</span>
          </div>
        </div>
        <div>
          <div className="stmt-kpi-value-row">
            <span className="stmt-kpi-value">{kpiData.consolidatedBilling.value}</span>
            <span className="stmt-kpi-badge stmt-kpi-badge--neutral">
              {kpiData.consolidatedBilling.trend}
            </span>
          </div>
          <p className="stmt-kpi-subtext">{kpiData.consolidatedBilling.subtext}</p>
        </div>
        <div className="stmt-kpi-track">
          <div
            className="stmt-kpi-fill stmt-kpi-fill--secondary"
            style={{ width: `${kpiData.consolidatedBilling.progressPct}%` }}
          />
        </div>
      </div>

      {/* 3. Pending Reconciliation */}
      <div
        className={`stmt-kpi-card ${selectedFilter === "pending" ? "stmt-kpi-card--active" : ""}`}
        onClick={() => onSelectFilter && onSelectFilter("pending")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectFilter && onSelectFilter("pending");
          }
        }}
      >
        <div className="stmt-kpi-header">
          <span className="stmt-kpi-label">{kpiData.pendingReconciliation.label}</span>
          <div className="stmt-kpi-icon-pod stmt-kpi-icon-pod--danger">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>rule_folder</span>
          </div>
        </div>
        <div>
          <div className="stmt-kpi-value-row">
            <span className="stmt-kpi-value">{kpiData.pendingReconciliation.value}</span>
            <span className="stmt-kpi-badge stmt-kpi-badge--danger">
              {kpiData.pendingReconciliation.trend}
            </span>
          </div>
          <p className="stmt-kpi-subtext">{kpiData.pendingReconciliation.subtext}</p>
        </div>
        <div className="stmt-kpi-track">
          <div
            className="stmt-kpi-fill stmt-kpi-fill--danger"
            style={{ width: `${kpiData.pendingReconciliation.progressPct}%` }}
          />
        </div>
      </div>

      {/* 4. Automated Dispatch */}
      <div
        className={`stmt-kpi-card ${selectedFilter === "dispatched" ? "stmt-kpi-card--active" : ""}`}
        onClick={() => onSelectFilter && onSelectFilter("dispatched")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectFilter && onSelectFilter("dispatched");
          }
        }}
      >
        <div className="stmt-kpi-header">
          <span className="stmt-kpi-label">{kpiData.automatedDispatch.label}</span>
          <div className="stmt-kpi-icon-pod stmt-kpi-icon-pod--tertiary">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>mark_email_read</span>
          </div>
        </div>
        <div>
          <div className="stmt-kpi-value-row">
            <span className="stmt-kpi-value">{kpiData.automatedDispatch.value}</span>
            <span className="stmt-kpi-badge stmt-kpi-badge--positive">
              {kpiData.automatedDispatch.trend}
            </span>
          </div>
          <p className="stmt-kpi-subtext">{kpiData.automatedDispatch.subtext}</p>
        </div>
        <div className="stmt-kpi-track">
          <div
            className="stmt-kpi-fill stmt-kpi-fill--primary"
            style={{ width: `${kpiData.automatedDispatch.progressPct}%` }}
          />
        </div>
      </div>
    </section>
  );
}

StatementKPIStats.propTypes = {
  kpiData: PropTypes.shape({
    statementsGenerated: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      trend: PropTypes.string,
      subtext: PropTypes.string,
      progressPct: PropTypes.number,
    }),
    consolidatedBilling: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      trend: PropTypes.string,
      subtext: PropTypes.string,
      progressPct: PropTypes.number,
    }),
    pendingReconciliation: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      trend: PropTypes.string,
      subtext: PropTypes.string,
      progressPct: PropTypes.number,
    }),
    automatedDispatch: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      trend: PropTypes.string,
      subtext: PropTypes.string,
      progressPct: PropTypes.number,
    }),
  }).isRequired,
  selectedFilter: PropTypes.string.isRequired,
  onSelectFilter: PropTypes.func.isRequired,
};
