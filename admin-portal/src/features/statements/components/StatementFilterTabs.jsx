import PropTypes from "prop-types";

/**
 * StatementFilterTabs - Filter tabs, sync tools, and search/entity/status filter controls
 * Matching Stitch Reference 11:
 * - Tabs: All Statements (128), B2B Companies (84), Driver & Fleets (44), Pending (12), Disputed (4)
 * - Header icons: Sync live status (sync), Columns & export (tune)
 * - Search: Search by Statement ID, GSTIN, Company...
 * - Entity dropdown & Status dropdown
 */
export default function StatementFilterTabs({
  currentTab,
  onTabChange,
  counts,
  searchQuery,
  onSearchChange,
  entityFilter,
  onEntityFilterChange,
  statusFilter,
  onStatusFilterChange,
  onSyncLiveStatus,
  onOpenTuneColumns,
}) {
  const tabs = [
    { id: "all", label: `All Statements (${counts.all})` },
    { id: "b2b", label: `B2B Companies (${counts.b2b})` },
    { id: "fleet", label: `Driver & Fleets (${counts.fleet})` },
    { id: "pending", label: `Pending (${counts.pending})` },
    { id: "disputed", label: `Disputed (${counts.disputed})` },
  ];

  return (
    <div className="stmt-filter-wrapper">
      {/* Filter Tabs Bar + Sync / Tune actions */}
      <div className="stmt-filter-tabs-bar">
        <div className="stmt-tab-btn-group" role="tablist">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                className={`stmt-tab-btn ${isActive ? "stmt-tab-btn--active" : ""}`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="stmt-tab-actions-group">
          <button
            type="button"
            className="stmt-icon-btn"
            title="Sync live status"
            onClick={onSyncLiveStatus}
            aria-label="Sync live status"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>sync</span>
          </button>
          <button
            type="button"
            className="stmt-icon-btn"
            title="Columns & export"
            onClick={onOpenTuneColumns}
            aria-label="Columns and export settings"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>tune</span>
          </button>
        </div>
      </div>

      {/* Search and Dropdowns Row */}
      <div className="stmt-search-controls-row">
        {/* Search Input */}
        <div className="stmt-search-box">
          <span className="material-symbols-outlined stmt-search-icon">search</span>
          <input
            type="text"
            className="stmt-search-input"
            placeholder="Search by Statement ID, GSTIN, Company..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search statements"
          />
          {searchQuery && (
            <button
              type="button"
              className="stmt-search-clear"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
            </button>
          )}
        </div>

        {/* Entity Type Dropdown */}
        <div>
          <select
            className="stmt-filter-select"
            value={entityFilter}
            onChange={(e) => onEntityFilterChange(e.target.value)}
            aria-label="Filter by entity type"
          >
            <option value="ALL">Entity: All Types</option>
            <option value="B2B Corporate">B2B Corporate</option>
            <option value="Fleet Operator">Fleet Operator</option>
            <option value="Individual Driver">Individual Driver</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            className="stmt-filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            aria-label="Filter by statement status"
          >
            <option value="ALL">Status: All</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Draft Ready">Draft Ready</option>
            <option value="Reconciled">Reconciled</option>
            <option value="Disputed (POD)">Disputed (POD)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

StatementFilterTabs.propTypes = {
  currentTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    all: PropTypes.number,
    b2b: PropTypes.number,
    fleet: PropTypes.number,
    pending: PropTypes.number,
    disputed: PropTypes.number,
  }).isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  entityFilter: PropTypes.string.isRequired,
  onEntityFilterChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
  onSyncLiveStatus: PropTypes.func.isRequired,
  onOpenTuneColumns: PropTypes.func.isRequired,
};
