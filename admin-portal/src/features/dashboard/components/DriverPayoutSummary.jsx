import PropTypes from "prop-types";

function DriverPayoutSummary({ payoutData, onReviewBatch, onViewHistory }) {
  if (!payoutData) return null;

  const {
    totalDisbursed,
    pendingSettlementAmount,
    completedSettlementsCount,
    activePaidDrivers,
    avgDriverEarnings,
    disbursementRate,
    nextBatch,
    topEarners,
  } = payoutData;

  return (
    <article className="dashboard-card payout-summary-card" id="card-driver-payout">
      {/* Card Header */}
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon-pill icon-teal">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <div>
            <h3 className="card-title">Driver Payout &amp; Settlement Summary</h3>
            <p className="card-subtitle">
              Fleet compensation, digital wallet disbursals &amp; two-person bank settlements
            </p>
          </div>
        </div>

        <div className="card-header-actions">
          <span className="payout-badge badge-settled">
            <span className="material-symbols-outlined">verified</span>
            <span>{disbursementRate} Settled</span>
          </span>
          <button
            type="button"
            className="action-btn secondary-btn"
            id="btn-settlement-history"
            onClick={onViewHistory}
            title="View Payout Log"
          >
            <span className="material-symbols-outlined">history</span>
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Main Figures Row */}
      <div className="payout-hero-banner">
        <div className="payout-stat-item">
          <span className="payout-label">DISBURSED THIS CYCLE</span>
          <strong className="payout-val text-navy">{totalDisbursed}</strong>
          <span className="payout-subtext">{activePaidDrivers} drivers credited via NEFT/UPI</span>
        </div>

        <div className="payout-stat-item highlight-item">
          <span className="payout-label">PENDING AUDIT &amp; CLEARANCE</span>
          <strong className="payout-val text-amber">{pendingSettlementAmount}</strong>
          <span className="payout-subtext">Awaiting final ePOD &amp; toll receipt audit</span>
        </div>

        <div className="payout-stat-item">
          <span className="payout-label">AVG DRIVER EARNINGS</span>
          <strong className="payout-val text-teal">{avgDriverEarnings}</strong>
          <span className="payout-subtext">Across {completedSettlementsCount} closed trip milestones</span>
        </div>
      </div>

      {/* Upcoming Payout Batch Card */}
      {nextBatch && (
        <div className="next-batch-card">
          <div className="next-batch-left">
            <div className="batch-icon-box">
              <span className="material-symbols-outlined">schedule_send</span>
            </div>
            <div className="batch-details">
              <div className="batch-title-row">
                <strong>Upcoming Payout Batch: {nextBatch.batchCode}</strong>
                <span className="batch-status-tag">{nextBatch.status}</span>
              </div>
              <p className="batch-sub">
                Scheduled for <strong>{nextBatch.scheduledDate}</strong> ·{" "}
                <span>
                  {nextBatch.driverCount} drivers ({nextBatch.tripsIncluded} trips)
                </span>
              </p>
            </div>
          </div>

          <div className="next-batch-right">
            <div className="batch-amount-box">
              <span className="batch-amount-label">Batch Total</span>
              <strong className="batch-amount-val">{nextBatch.estimatedAmount}</strong>
            </div>

            <button
              type="button"
              className="action-btn primary-btn small-btn"
              id="btn-review-payout-batch"
              onClick={onReviewBatch}
            >
              <span>Review Batch</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Performing Drivers Roster */}
      <div className="top-earners-section">
        <div className="top-earners-header">
          <span className="section-small-title">Top Earning Drivers This Month</span>
          <span className="section-small-subtitle">Ranked by verified trip completion</span>
        </div>

        <div className="top-earners-list">
          {!topEarners || topEarners.length === 0 ? (
            <div className="empty-earners-state" style={{ padding: "1.25rem 1rem", textAlign: "center", color: "#64748b", fontSize: "0.875rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "1.75rem", color: "#94a3b8", display: "block", marginBottom: "0.25rem" }}>
                payments
              </span>
              No closed driver settlements for this period yet.
            </div>
          ) : (
            topEarners.map((driver, index) => (
              <div key={driver.id} className="earner-row">
                <div className="earner-rank-avatar">
                  <span className="rank-num">#{index + 1}</span>
                </div>

                <div className="earner-info">
                  <div className="earner-name-row">
                    <strong className="earner-name">{driver.name}</strong>
                    <span className="earner-rating">
                      <span className="material-symbols-outlined star-icon">star</span>
                      <span>{driver.rating}</span>
                    </span>
                  </div>
                  <span className="earner-vehicle">
                    {driver.vehicle} · {driver.tripsCount} trips closed
                  </span>
                </div>

                <div className="earner-earnings">
                  <strong className="earner-payout">{driver.amount}</strong>
                  <span className="earner-status">Settled</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </article>
  );
}

DriverPayoutSummary.propTypes = {
  payoutData: PropTypes.shape({
    totalDisbursed: PropTypes.string.isRequired,
    pendingSettlementAmount: PropTypes.string.isRequired,
    completedSettlementsCount: PropTypes.number.isRequired,
    activePaidDrivers: PropTypes.number.isRequired,
    avgDriverEarnings: PropTypes.string.isRequired,
    disbursementRate: PropTypes.string.isRequired,
    nextBatch: PropTypes.object,
    topEarners: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  onReviewBatch: PropTypes.func,
  onViewHistory: PropTypes.func,
};

export default DriverPayoutSummary;
