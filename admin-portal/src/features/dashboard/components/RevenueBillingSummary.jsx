import PropTypes from "prop-types";

function RevenueBillingSummary({ summary, onExport, onViewLedger }) {
  if (!summary) return null;

  const {
    monthlyRevenue,
    growthRate,
    billingPeriod,
    totalBilled,
    totalCollected,
    outstandingReceivables,
    collectionRate,
    projectedEndMonth,
    categories,
    alerts,
  } = summary;

  return (
    <article className="dashboard-card revenue-billing-card" id="card-revenue-billing">
      {/* Card Header */}
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon-pill icon-purple">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <h3 className="card-title">Monthly Revenue &amp; Billing Summary</h3>
            <p className="card-subtitle">
              Billing cycle: <strong>{billingPeriod}</strong> · Consolidated B2B enterprise revenue
            </p>
          </div>
        </div>

        <div className="card-header-actions">
          <span className="billing-badge badge-active">Active Cycle</span>
          <button
            type="button"
            className="action-btn secondary-btn"
            id="btn-export-billing"
            onClick={onExport}
            title="Download Invoicing Spreadsheet"
          >
            <span className="material-symbols-outlined">download</span>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Revenue Figure Banner */}
      <div className="revenue-hero-banner">
        <div className="revenue-primary-stat">
          <span className="revenue-eyebrow">GROSS MONTHLY REVENUE</span>
          <div className="revenue-amount-row">
            <span className="revenue-amount">{monthlyRevenue}</span>
            <span className={`revenue-growth-pill ${growthRate?.startsWith("-") ? "pill-negative" : ""}`}>
              <span className="material-symbols-outlined">
                {growthRate?.startsWith("-") ? "trending_down" : "trending_up"}
              </span>
              <span>{growthRate}</span>
            </span>
          </div>
          <span className="revenue-projected-caption">
            Projected Month-End Close: <strong>{projectedEndMonth}</strong>
          </span>
        </div>

        {/* 3 Metric Pills */}
        <div className="revenue-submetrics-grid">
          <div className="submetric-box">
            <span className="submetric-label">Total Invoiced</span>
            <strong className="submetric-val text-navy">{totalBilled}</strong>
            <span className="submetric-hint">100% Tax Compliant</span>
          </div>

          <div className="submetric-box">
            <span className="submetric-label">Realized / Collected</span>
            <strong className="submetric-val text-green">{totalCollected}</strong>
            <span className="submetric-hint">{collectionRate} collection rate</span>
          </div>

          <div className="submetric-box">
            <span className="submetric-label">Outstanding Receivables</span>
            <strong className="submetric-val text-amber">{outstandingReceivables}</strong>
            <span className="submetric-hint">
              {outstandingReceivables === "₹0" ? "All Invoices Cleared" : "Within credit grace (Net 30/45)"}
            </span>
          </div>
        </div>
      </div>

      {/* Segment Breakdown Visualizer */}
      <div className="revenue-breakdown-section">
        <div className="breakdown-header">
          <span className="breakdown-title">Corridor Revenue Distribution</span>
          <span className="breakdown-total">100% Verified Trips</span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="stacked-progress-bar" role="progressbar" aria-label="Revenue distribution">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="progress-segment"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color,
                }}
                title={`${cat.label}: ${cat.amount} (${cat.percentage}%)`}
              />
            ))
          ) : (
            <div
              className="progress-segment"
              style={{ width: "100%", backgroundColor: "#e2e8f0" }}
              title="No revenue recorded"
            />
          )}
        </div>

        {/* Legend */}
        <div className="breakdown-legend-grid">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat.id} className="legend-item">
                <span className="legend-color-dot" style={{ backgroundColor: cat.color }} />
                <div className="legend-text">
                  <span className="legend-name">{cat.label}</span>
                  <span className="legend-values">
                    <strong>{cat.amount}</strong> ({cat.percentage}%)
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "#64748b", fontSize: "0.85rem", padding: "0.5rem 0" }}>
              No corridor revenue recorded for this period yet.
            </div>
          )}
        </div>
      </div>

      {/* Financial Alerts & Actions */}
      <div className="revenue-footer-alerts">
        {alerts && alerts.length > 0 && (
          <div className="alerts-container">
            {alerts.map((alt) => (
              <div key={alt.id} className={`alert-pill alert-${alt.type}`}>
                <span className="material-symbols-outlined alert-icon">
                  {alt.type === "warning" ? "info" : "notifications"}
                </span>
                <div className="alert-content">
                  <strong>{alt.title}:</strong>
                  <span>{alt.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="revenue-card-cta">
          <button
            type="button"
            className="link-btn"
            id="btn-view-billing-ledger"
            onClick={onViewLedger}
          >
            <span>Open Invoicing &amp; Statements Ledger</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
}

RevenueBillingSummary.propTypes = {
  summary: PropTypes.shape({
    monthlyRevenue: PropTypes.string.isRequired,
    growthRate: PropTypes.string.isRequired,
    billingPeriod: PropTypes.string.isRequired,
    totalBilled: PropTypes.string.isRequired,
    totalCollected: PropTypes.string.isRequired,
    outstandingReceivables: PropTypes.string.isRequired,
    collectionRate: PropTypes.string.isRequired,
    projectedEndMonth: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    alerts: PropTypes.arrayOf(PropTypes.object),
  }),
  onExport: PropTypes.func,
  onViewLedger: PropTypes.func,
};

export default RevenueBillingSummary;
