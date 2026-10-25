import PropTypes from "prop-types";

const CATEGORIES = [
  "All",
  "Orders",
  "Trips",
  "Trip Reports",
  "Invoices & Statements",
  "Account & Profile",
  "Technical Issue",
  "Other",
];

const PRIORITIES = ["All", "Urgent", "High", "Normal", "Low"];

function SupportFilterToolbar({
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  searchQuery,
  onSearchChange,
  autoSync,
  onToggleAutoSync,
  isRefreshing,
  onRefresh,
  stats,
}) {
  const statusTabs = [
    { key: "All", label: "All Tickets", count: stats?.total ?? 0 },
    { key: "Open", label: "Open", count: stats?.open ?? 0 },
    { key: "In Progress", label: "In Progress", count: stats?.in_progress ?? 0 },
    { key: "Resolved", label: "Resolved", count: stats?.resolved ?? 0 },
    { key: "Closed", label: "Closed", count: stats?.closed ?? 0 },
  ];

  const hasActiveFilters =
    statusFilter !== "All" ||
    categoryFilter !== "All" ||
    priorityFilter !== "All" ||
    Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    onStatusChange("All");
    onCategoryChange("All");
    onPriorityChange("All");
    onSearchChange("");
  };

  return (
    <div className="b2b-support-toolbar">
      {/* Top Row: Status Tabs & Search */}
      <div className="b2b-support-toolbar-top">
        <div className="b2b-support-status-tabs" role="tablist">
          {statusTabs.map((tab) => {
            const isActive = statusFilter.toLowerCase() === tab.key.toLowerCase();
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`b2b-support-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => onStatusChange(tab.key)}
              >
                <span>{tab.label}</span>
                <span className="b2b-support-tab-count">{tab.count}</span>
              </button>
            );
          })}
        </div>

        <div className="b2b-support-search-wrapper">
          <span className="b2b-support-search-icon material-symbols-outlined">
            search
          </span>
          <input
            type="search"
            className="b2b-support-search-input"
            placeholder="Search by ticket ID, company name, contact, or subject..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Bottom Row: Category, Priority, Reset & Sync controls */}
      <div className="b2b-support-toolbar-bottom">
        <div className="b2b-support-filter-group">
          <label htmlFor="select-category" style={{ fontSize: "0.775rem", fontWeight: 700, color: "#64748b" }}>
            Category:
          </label>
          <select
            id="select-category"
            className="b2b-support-select"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          <label htmlFor="select-priority" style={{ fontSize: "0.775rem", fontWeight: 700, color: "#64748b", marginLeft: "0.5rem" }}>
            Priority:
          </label>
          <select
            id="select-priority"
            className="b2b-support-select"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            {PRIORITIES.map((prio) => (
              <option key={prio} value={prio}>
                {prio === "All" ? "All Priorities" : `${prio} Priority`}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                background: "transparent",
                border: "none",
                color: "#2563eb",
                fontSize: "0.775rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: "0.25rem 0.5rem",
                textDecoration: "underline",
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <label className="b2b-support-auto-sync-toggle">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => onToggleAutoSync(e.target.checked)}
            />
            <span>Live Stream (10s)</span>
          </label>

          <button
            type="button"
            className="b2b-support-sync-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh tickets from server"
          >
            <span className={`material-symbols-outlined b2b-support-sync-icon ${isRefreshing ? "spinning" : ""}`} style={{ fontSize: "1rem" }}>
              refresh
            </span>
            <span>{isRefreshing ? "Syncing..." : "Sync Now"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

SupportFilterToolbar.propTypes = {
  statusFilter: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  categoryFilter: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  priorityFilter: PropTypes.string.isRequired,
  onPriorityChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  autoSync: PropTypes.bool.isRequired,
  onToggleAutoSync: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  stats: PropTypes.object,
};

export default SupportFilterToolbar;
