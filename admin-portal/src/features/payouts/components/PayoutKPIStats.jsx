/**
 * PayoutKPIStats Component
 * 4 Financial Disbursement & Settlement KPI Cards with visual progress tracks
 * Modeled after Stitch reference: 9._payouts_driver_wallets
 */

export default function PayoutKPIStats({ kpis, activeFilter, onFilterSelect }) {
  if (!kpis) return null;

  const {
    totalPayable,
    pendingDisbursements,
    paidThisCycle,
    failedOnHold,
  } = kpis;

  return (
    <div className="payouts-kpi-grid">
      {/* 1. Total Driver Payable */}
      <div
        className={`payout-kpi-card ${
          activeFilter === "all" ? "active-filter" : ""
        }`}
        onClick={() => onFilterSelect && onFilterSelect("all")}
        role="button"
        tabIndex={0}
      >
        <div className="payout-kpi-top">
          <span className="payout-kpi-title">Total Driver Payable</span>
          <div className="payout-kpi-icon-pod primary">
            <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
              account_balance_wallet
            </span>
          </div>
        </div>
        <div className="payout-kpi-middle">
          <span className="payout-kpi-number">{totalPayable.value}</span>
          <span className="payout-kpi-tag primary">{totalPayable.badge}</span>
        </div>
        <div>
          <div className="payout-kpi-subtitle">{totalPayable.subtitle}</div>
          <div className="payout-kpi-track" style={{ marginTop: "0.5rem" }}>
            <div
              className="payout-kpi-bar primary"
              style={{ width: `${totalPayable.progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Pending Disbursements */}
      <div
        className={`payout-kpi-card ${
          activeFilter === "pending" ? "active-filter" : ""
        }`}
        onClick={() => onFilterSelect && onFilterSelect("pending")}
        role="button"
        tabIndex={0}
      >
        <div className="payout-kpi-top">
          <span className="payout-kpi-title">Pending Disbursements</span>
          <div className="payout-kpi-icon-pod amber">
            <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
              schedule
            </span>
          </div>
        </div>
        <div className="payout-kpi-middle">
          <span className="payout-kpi-number">{pendingDisbursements.value}</span>
          <span className="payout-kpi-tag amber">{pendingDisbursements.badge}</span>
        </div>
        <div>
          <div className="payout-kpi-subtitle">{pendingDisbursements.subtitle}</div>
          <div className="payout-kpi-track" style={{ marginTop: "0.5rem" }}>
            <div
              className="payout-kpi-bar amber"
              style={{ width: `${pendingDisbursements.progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Paid This Cycle */}
      <div
        className={`payout-kpi-card ${
          activeFilter === "settled" ? "active-filter" : ""
        }`}
        onClick={() => onFilterSelect && onFilterSelect("settled")}
        role="button"
        tabIndex={0}
      >
        <div className="payout-kpi-top">
          <span className="payout-kpi-title">Paid This Cycle</span>
          <div className="payout-kpi-icon-pod emerald">
            <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
              check_circle
            </span>
          </div>
        </div>
        <div className="payout-kpi-middle">
          <span className="payout-kpi-number">{paidThisCycle.value}</span>
          <span className="payout-kpi-tag emerald">{paidThisCycle.badge}</span>
        </div>
        <div>
          <div className="payout-kpi-subtitle">{paidThisCycle.subtitle}</div>
          <div className="payout-kpi-track" style={{ marginTop: "0.5rem" }}>
            <div
              className="payout-kpi-bar emerald"
              style={{ width: `${paidThisCycle.progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Failed / On Hold */}
      <div
        className={`payout-kpi-card ${
          activeFilter === "failed" ? "active-filter" : ""
        }`}
        onClick={() => onFilterSelect && onFilterSelect("failed")}
        role="button"
        tabIndex={0}
      >
        <div className="payout-kpi-top">
          <span className="payout-kpi-title">Failed / On Hold</span>
          <div className="payout-kpi-icon-pod danger">
            <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
              warning
            </span>
          </div>
        </div>
        <div className="payout-kpi-middle">
          <span className="payout-kpi-number danger">{failedOnHold.value}</span>
          <span className="payout-kpi-tag danger">{failedOnHold.badge}</span>
        </div>
        <div>
          <div className="payout-kpi-subtitle">{failedOnHold.subtitle}</div>
          <div className="payout-kpi-track" style={{ marginTop: "0.5rem" }}>
            <div
              className="payout-kpi-bar danger"
              style={{ width: `${failedOnHold.progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
