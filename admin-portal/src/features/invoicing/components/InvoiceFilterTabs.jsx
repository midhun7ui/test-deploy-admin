import PropTypes from "prop-types";

/**
 * InvoiceFilterTabs - Status pipeline tabs and search/filter bar
 * Matching Stitch Reference 10:
 * - Tabs: All Invoices (38), Pending Verification (1), Draft (2), Sent / Unpaid (14), Overdue (5), Paid (16)
 * - Controls: Search box, Company selector, Status selector, Refresh/Reset button
 */
export default function InvoiceFilterTabs({
  currentTab,
  onTabChange,
  tabCounts,
  searchQuery,
  onSearchChange,
  companyFilter,
  onCompanyFilterChange,
  statusFilter,
  onStatusFilterChange,
  companyOptions,
  onResetFilters,
}) {
  const tabs = [
    { id: "all", label: "All Invoices", count: tabCounts.all },
    {
      id: "pending",
      label: "Pending Verification",
      count: tabCounts.pending,
      badgeType: "warning",
    },
    { id: "draft", label: "Draft", count: tabCounts.draft },
    { id: "sent", label: "Sent / Unpaid", count: tabCounts.sent },
    {
      id: "overdue",
      label: "Overdue",
      count: tabCounts.overdue,
      badgeType: "danger",
    },
    { id: "paid", label: "Paid", count: tabCounts.paid },
  ];

  return (
    <div className="inv-tabs-wrapper">
      {/* 6 Pipeline Status Tabs */}
      <div className="inv-tabs-bar" role="tablist" aria-label="Invoice status categories">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`inv-tab-btn ${isActive ? "inv-tab-btn--active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span>{tab.label}</span>
              <span
                className={`inv-tab-badge ${
                  tab.badgeType === "warning"
                    ? "inv-tab-badge--warning"
                    : tab.badgeType === "danger"
                    ? "inv-tab-badge--danger"
                    : "inv-tab-badge--default"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Controls Row */}
      <div className="inv-controls-row">
        {/* Search Input */}
        <div className="inv-search-box">
          <span className="material-symbols-outlined inv-search-icon">search</span>
          <input
            type="text"
            className="inv-search-input"
            placeholder="Search invoice #, company, GSTIN, period..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search invoices"
          />
          {searchQuery && (
            <button
              type="button"
              className="inv-search-clear"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
            </button>
          )}
        </div>

        {/* Company Filter Dropdown */}
        <div className="inv-select-wrapper">
          <select
            className="inv-filter-select"
            value={companyFilter}
            onChange={(e) => onCompanyFilterChange(e.target.value)}
            aria-label="Filter by client company"
          >
            <option value="ALL">All Companies</option>
            {companyOptions.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Dropdown */}
        <div className="inv-select-wrapper">
          <select
            className="inv-filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            aria-label="Filter by invoice status"
          >
            <option value="ALL">Status: All</option>
            <option value="Review Pending">Review Pending</option>
            <option value="Due in 18d">Due in 18d</option>
            <option value="Due in 24d">Due in 24d</option>
            <option value="Overdue (12d)">Overdue (12d)</option>
            <option value="Reconciled">Reconciled</option>
          </select>
        </div>

        {/* Reset / Refresh Button */}
        <button
          type="button"
          className="inv-reset-btn"
          onClick={onResetFilters}
          title="Reset all filters"
          aria-label="Reset all filters"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>refresh</span>
        </button>
      </div>
    </div>
  );
}

InvoiceFilterTabs.propTypes = {
  currentTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  tabCounts: PropTypes.shape({
    all: PropTypes.number,
    pending: PropTypes.number,
    draft: PropTypes.number,
    sent: PropTypes.number,
    overdue: PropTypes.number,
    paid: PropTypes.number,
  }).isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  companyFilter: PropTypes.string.isRequired,
  onCompanyFilterChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
  companyOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onResetFilters: PropTypes.func.isRequired,
};
