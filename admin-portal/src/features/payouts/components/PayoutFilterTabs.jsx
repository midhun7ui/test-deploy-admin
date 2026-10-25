/**
 * PayoutFilterTabs Component
 * Pipeline Status Filter Tabs, Search Bar, Corridor & Batch Dropdowns
 * Modeled after Stitch reference: 9._payouts_driver_wallets
 */

export default function PayoutFilterTabs({
  activeTab,
  onTabChange,
  counts,
  searchQuery,
  onSearchChange,
  selectedCorridor,
  onCorridorChange,
  corridors = [],
  selectedBatch,
  onBatchChange,
  onReloadBatch,
}) {
  const tabs = [
    { id: "all", label: "All Payouts", count: counts.all, badgeClass: "neutral" },
    { id: "pending", label: "Pending Approval", count: counts.pending, badgeClass: "amber" },
    { id: "ready", label: "Ready for Disbursal", count: counts.ready, badgeClass: "neutral" },
    { id: "settled", label: "Settled / Paid", count: counts.settled, badgeClass: "emerald" },
    { id: "failed", label: "Failed / On Hold", count: counts.failed, badgeClass: "danger" },
  ];

  return (
    <div className="payouts-filter-bar">
      {/* 1. Status Filter Tabs */}
      <div className="payouts-status-tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`payout-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span>{tab.label}</span>
              <span className={`payout-tab-badge ${tab.badgeClass}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Search & Filter Controls Cluster */}
      <div className="payouts-search-controls-row">
        <div className="payouts-search-input-pod">
          <span className="material-symbols-outlined payouts-search-icon">
            search
          </span>
          <input
            type="text"
            className="payouts-search-input"
            placeholder="Search by Payout ID, driver name, vehicle, or bank ref..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="payouts-filters-cluster">
          {/* Corridor Dropdown */}
          <select
            className="payouts-select-control"
            value={selectedCorridor}
            onChange={(e) => onCorridorChange(e.target.value)}
          >
            <option value="all">All Corridors &amp; Hubs</option>
            {corridors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Batch Dropdown */}
          <select
            className="payouts-select-control"
            value={selectedBatch}
            onChange={(e) => onBatchChange(e.target.value)}
          >
            <option value="all">All Batches</option>
            <option value="active">Active Queue</option>
            <option value="closed">Completed Cycles</option>
          </select>

          {/* Reload Batch Button */}
          <button
            type="button"
            className="btn-reload-batch"
            title="Reload batch data"
            onClick={onReloadBatch}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
              refresh
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
