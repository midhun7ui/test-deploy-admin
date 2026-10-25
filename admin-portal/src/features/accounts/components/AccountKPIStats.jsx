/**
 * AccountKPIStats Component
 * 4 Financial Risk & Portfolio KPI Cards with visual track meters
 * Modeled after Stitch reference: 8._accounts_credit
 */

export default function AccountKPIStats({ kpis, activeFilter, onFilterSelect }) {
  if (!kpis) return null;

  const {
    totalOutstanding,
    portfolioUtilisation,
    delinquent90d,
    blockedAccounts,
  } = kpis;

  return (
    <div className="accounts-kpi-grid">
      {/* 1. Total Outstanding */}
      <div
        className={`account-kpi-card ${
          activeFilter === "all" ? "active-filter" : ""
        }`}
        onClick={() => onFilterSelect && onFilterSelect("all")}
        role="button"
        tabIndex={0}
      >
        <div className="account-kpi-top">
          <span className="account-kpi-title">Total Outstanding</span>
          <div className="account-kpi-icon-pod primary">
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
              payments
            </span>
          </div>
        </div>
        <div className="account-kpi-middle">
          <span className="account-kpi-number">{totalOutstanding.value}</span>
          <span className="account-kpi-tag danger">{totalOutstanding.badge}</span>
        </div>
        <div>
          <div className="account-kpi-subtitle">{totalOutstanding.subtitle}</div>
          <div className="account-kpi-track" style={{ marginTop: "0.5rem" }}>
            <div
              className="account-kpi-bar primary"
              style={{ width: `${totalOutstanding.progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Portfolio Utilisation */}
      <div
        className={`account-kpi-card ${
          activeFilter === "healthy" ? "active-filter" : ""
        }`}
        onClick={() => onFilterSelect && onFilterSelect("healthy")}
        role="button"
        tabIndex={0}
      >
        <div className="account-kpi-top">
          <span className="account-kpi-title">Portfolio Utilisation</span>
          <div className="account-kpi-icon-pod tertiary">
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
              pie_chart
            </span>
          </div>
        </div>
        <div className="account-kpi-middle">
          <span className="account-kpi-number">{portfolioUtilisation.value}</span>
          <span className="account-kpi-tag safe">{portfolioUtilisation.badge}</span>
        </div>
        <div>
          <div className="account-kpi-subtitle">{portfolioUtilisation.subtitle}</div>
          <div className="account-kpi-track" style={{ marginTop: "0.5rem" }}>
            <div
              className="account-kpi-bar primary"
              style={{ width: `${portfolioUtilisation.progress1Pct}%` }}
            />
            <div
              className="account-kpi-bar"
              style={{
                width: `${portfolioUtilisation.progress2Pct}%`,
                backgroundColor: "var(--acc-secondary-container)",
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. 90+ Days Delinquent */}
      <div
        className={`account-kpi-card ${
          activeFilter === "watchlist" ? "active-filter" : ""
        }`}
        onClick={() => onFilterSelect && onFilterSelect("watchlist")}
        role="button"
        tabIndex={0}
      >
        <div className="account-kpi-top">
          <span className="account-kpi-title">90+ Days Delinquent</span>
          <div className="account-kpi-icon-pod danger">
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
              warning
            </span>
          </div>
        </div>
        <div className="account-kpi-middle">
          <span className="account-kpi-number danger">{delinquent90d.value}</span>
          <span className="account-kpi-tag danger">{delinquent90d.badge}</span>
        </div>
        <div>
          <div className="account-kpi-subtitle">{delinquent90d.subtitle}</div>
          <div className="account-kpi-track" style={{ marginTop: "0.5rem" }}>
            <div
              className="account-kpi-bar danger"
              style={{ width: `${delinquent90d.progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Blocked Accounts */}
      <div
        className={`account-kpi-card ${
          activeFilter === "breached" ? "active-filter" : ""
        }`}
        onClick={() => onFilterSelect && onFilterSelect("breached")}
        role="button"
        tabIndex={0}
      >
        <div className="account-kpi-top">
          <span className="account-kpi-title">Blocked Accounts</span>
          <div className="account-kpi-icon-pod danger">
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
              block
            </span>
          </div>
        </div>
        <div className="account-kpi-middle">
          <span className="account-kpi-number danger">{blockedAccounts.value}</span>
          <span className="account-kpi-tag danger">{blockedAccounts.badge}</span>
        </div>
        <div>
          <div className="account-kpi-subtitle">{blockedAccounts.subtitle}</div>
          <div className="account-kpi-track" style={{ marginTop: "0.5rem" }}>
            <div
              className="account-kpi-bar danger"
              style={{ width: `${blockedAccounts.progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
