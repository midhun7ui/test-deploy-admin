import PropTypes from "prop-types";

/**
 * InvoiceKPIStats - Top metric cards matching Stitch Reference 10:
 * 1. Billed This Cycle (₹29,33,100, +12.4% vs last mo, 34 Invoices)
 * 2. Outstanding Receivables (₹25,45,100, Due within 30d, 18 Invoices)
 * 3. Overdue / Dunning (₹14,23,100, High Risk 5 Invoices, Overdue >15d)
 * 4. Drafts Pending Review (01, Action Required, Two-Step Sign-off)
 */
export default function InvoiceKPIStats({ kpiData, selectedFilter, onSelectFilter }) {
  if (!kpiData) return null;

  return (
    <section className="inv-kpis-grid" aria-label="Invoicing & Billing Key Metrics">
      {/* 1. Billed This Cycle */}
      <div
        className={`inv-kpi-card inv-kpi-card--primary ${selectedFilter === "paid" ? "inv-kpi-card--active" : ""}`}
        onClick={() => onSelectFilter && onSelectFilter("paid")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectFilter && onSelectFilter("paid");
          }
        }}
      >
        <div className="inv-kpi-header">
          <span className="inv-kpi-label">{kpiData.billedThisCycle.label}</span>
          <span className="material-symbols-outlined inv-kpi-icon-pod">account_balance_wallet</span>
        </div>
        <div className="inv-kpi-value-row">
          <div className="inv-kpi-value">{kpiData.billedThisCycle.value}</div>
          <span className="inv-kpi-badge inv-kpi-badge--positive">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>trending_up</span>
            {kpiData.billedThisCycle.trend}
          </span>
        </div>
        <div className="inv-kpi-subtext">
          <span>Total volume</span>
          <span className="inv-kpi-subtext-val">{kpiData.billedThisCycle.count}</span>
        </div>
        <div className="inv-kpi-track">
          <div
            className="inv-kpi-fill inv-kpi-fill--primary"
            style={{ width: `${kpiData.billedThisCycle.progressPct}%` }}
          />
        </div>
        <div className="inv-kpi-footnote">{kpiData.billedThisCycle.footnote}</div>
      </div>

      {/* 2. Outstanding Receivables */}
      <div
        className={`inv-kpi-card inv-kpi-card--warning ${selectedFilter === "sent" ? "inv-kpi-card--active" : ""}`}
        onClick={() => onSelectFilter && onSelectFilter("sent")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectFilter && onSelectFilter("sent");
          }
        }}
      >
        <div className="inv-kpi-header">
          <span className="inv-kpi-label">{kpiData.outstandingReceivables.label}</span>
          <span className="material-symbols-outlined inv-kpi-icon-pod">schedule</span>
        </div>
        <div className="inv-kpi-value-row">
          <div className="inv-kpi-value">{kpiData.outstandingReceivables.value}</div>
          <span className="inv-kpi-badge inv-kpi-badge--warning">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>hourglass_top</span>
            {kpiData.outstandingReceivables.trend}
          </span>
        </div>
        <div className="inv-kpi-subtext">
          <span>Active cycle buffer</span>
          <span className="inv-kpi-subtext-val">{kpiData.outstandingReceivables.count}</span>
        </div>
        <div className="inv-kpi-track">
          <div
            className="inv-kpi-fill inv-kpi-fill--warning"
            style={{ width: `${kpiData.outstandingReceivables.progressPct}%` }}
          />
        </div>
        <div className="inv-kpi-footnote">{kpiData.outstandingReceivables.footnote}</div>
      </div>

      {/* 3. Overdue / Dunning */}
      <div
        className={`inv-kpi-card inv-kpi-card--danger ${selectedFilter === "overdue" ? "inv-kpi-card--active" : ""}`}
        onClick={() => onSelectFilter && onSelectFilter("overdue")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectFilter && onSelectFilter("overdue");
          }
        }}
      >
        <div className="inv-kpi-header">
          <span className="inv-kpi-label">{kpiData.overdueDunning.label}</span>
          <span className="material-symbols-outlined inv-kpi-icon-pod">warning</span>
        </div>
        <div className="inv-kpi-value-row">
          <div className="inv-kpi-value">{kpiData.overdueDunning.value}</div>
          <span className="inv-kpi-badge inv-kpi-badge--danger">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>error</span>
            {kpiData.overdueDunning.trend}
          </span>
        </div>
        <div className="inv-kpi-subtext">
          <span>Aging aging bucket</span>
          <span className="inv-kpi-subtext-val">{kpiData.overdueDunning.subtext}</span>
        </div>
        <div className="inv-kpi-track">
          <div
            className="inv-kpi-fill inv-kpi-fill--danger"
            style={{ width: `${kpiData.overdueDunning.progressPct}%` }}
          />
        </div>
        <div className="inv-kpi-footnote">{kpiData.overdueDunning.footnote}</div>
      </div>

      {/* 4. Drafts Pending Review */}
      <div
        className={`inv-kpi-card inv-kpi-card--info ${selectedFilter === "pending" ? "inv-kpi-card--active" : ""}`}
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
        <div className="inv-kpi-header">
          <span className="inv-kpi-label">{kpiData.draftsPendingReview.label}</span>
          <span className="material-symbols-outlined inv-kpi-icon-pod">verified_user</span>
        </div>
        <div className="inv-kpi-value-row">
          <div className="inv-kpi-value">{kpiData.draftsPendingReview.value}</div>
          <span className="inv-kpi-badge inv-kpi-badge--accent">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>rate_review</span>
            {kpiData.draftsPendingReview.trend}
          </span>
        </div>
        <div className="inv-kpi-subtext">
          <span>Internal workflow</span>
          <span className="inv-kpi-subtext-val">{kpiData.draftsPendingReview.subtext}</span>
        </div>
        <div className="inv-kpi-track">
          <div
            className="inv-kpi-fill inv-kpi-fill--info"
            style={{ width: `${kpiData.draftsPendingReview.progressPct}%` }}
          />
        </div>
        <div className="inv-kpi-footnote">{kpiData.draftsPendingReview.footnote}</div>
      </div>
    </section>
  );
}

InvoiceKPIStats.propTypes = {
  kpiData: PropTypes.shape({
    billedThisCycle: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      trend: PropTypes.string,
      count: PropTypes.string,
      progressPct: PropTypes.number,
      footnote: PropTypes.string,
    }),
    outstandingReceivables: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      trend: PropTypes.string,
      count: PropTypes.string,
      progressPct: PropTypes.number,
      footnote: PropTypes.string,
    }),
    overdueDunning: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      trend: PropTypes.string,
      subtext: PropTypes.string,
      progressPct: PropTypes.number,
      footnote: PropTypes.string,
    }),
    draftsPendingReview: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      trend: PropTypes.string,
      subtext: PropTypes.string,
      progressPct: PropTypes.number,
      footnote: PropTypes.string,
    }),
  }).isRequired,
  selectedFilter: PropTypes.string.isRequired,
  onSelectFilter: PropTypes.func.isRequired,
};
