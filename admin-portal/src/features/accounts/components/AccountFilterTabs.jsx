/**
 * AccountFilterTabs Component
 * Pipeline Filter Tabs & Quick Action Buttons (Column config, refresh)
 * Modeled after Stitch reference: 8._accounts_credit
 */

export default function AccountFilterTabs({
  activeTab,
  onTabChange,
  counts,
  onRefresh,
  onToggleColumns,
}) {
  const tabs = [
    { id: "all", label: `All (${counts.all})` },
    { id: "active", label: `Active (${counts.active})` },
    { id: "watchlist", label: `Watchlist (${counts.watchlist})` },
    {
      id: "breached",
      label: "Breached",
      badgeCount: counts.breached,
      badgeColor: "danger",
    },
    { id: "healthy", label: `Healthy (${counts.healthy})` },
  ];

  return (
    <div className="accounts-filter-bar">
      <div className="accounts-status-tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`account-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span>{tab.label}</span>
              {tab.badgeCount !== undefined && (
                <span className="account-tab-badge-circle">
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="accounts-quick-icons">
        <button
          type="button"
          className="btn-quick-icon"
          title="Column Customization"
          onClick={onToggleColumns}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
            view_column
          </span>
        </button>
        <button
          type="button"
          className="btn-quick-icon"
          title="Refresh Ledger"
          onClick={onRefresh}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
            refresh
          </span>
        </button>
      </div>
    </div>
  );
}
