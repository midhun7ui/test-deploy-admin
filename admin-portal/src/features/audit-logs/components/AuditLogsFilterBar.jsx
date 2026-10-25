import PropTypes from "prop-types";

export default function AuditLogsFilterBar({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
  onResetFilters,
}) {
  return (
    <div className="audit-search-filter-card" id="audit-logs-search-filter-bar">
      {/* Search Input */}
      <div className="audit-search-input-box">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          className="audit-search-input"
          placeholder="Search by Actor, IP address, Resource ID (e.g. TRP-10471, INV-2026), or Event Type..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          id="audit-search-input"
          aria-label="Search audit logs"
        />
      </div>

      {/* Granular Filters Dropdown Group */}
      <div className="audit-filter-dropdown-group">
        {/* Severity */}
        <div style={{ position: "relative" }}>
          <select
            className="audit-filter-select"
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value)}
            id="audit-filter-severity"
            aria-label="Filter by severity"
          >
            <option value="all">Severity: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <span className="material-symbols-outlined admin-select-chevron" style={{ fontSize: "16px", right: "6px" }}>
            expand_more
          </span>
        </div>

        {/* Actor Role */}
        <div style={{ position: "relative" }}>
          <select
            className="audit-filter-select"
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            id="audit-filter-role"
            aria-label="Filter by actor role"
          >
            <option value="all">Role: All</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Senior Ops Mgr">Senior Ops Mgr</option>
            <option value="Finance Auditor">Finance Auditor</option>
            <option value="Corridor Dispatcher">Corridor Dispatcher</option>
            <option value="Identity Daemon">Identity Daemon</option>
          </select>
          <span className="material-symbols-outlined admin-select-chevron" style={{ fontSize: "16px", right: "6px" }}>
            expand_more
          </span>
        </div>

        {/* Status */}
        <div style={{ position: "relative" }}>
          <select
            className="audit-filter-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            id="audit-filter-status"
            aria-label="Filter by outcome status"
          >
            <option value="all">Status: All</option>
            <option value="Dual-Signed">Success &amp; Flagged</option>
            <option value="Reconciled">Reconciled</option>
            <option value="Auto-Challenged">Security Blocked</option>
          </select>
          <span className="material-symbols-outlined admin-select-chevron" style={{ fontSize: "16px", right: "6px" }}>
            expand_more
          </span>
        </div>

        {/* Reset Filters */}
        <button
          type="button"
          className="admin-action-icon-btn"
          style={{ width: "38px", height: "38px", backgroundColor: "var(--audit-surface-low)" }}
          onClick={onResetFilters}
          title="Reset all filters"
          id="btn-reset-audit-filters"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>restart_alt</span>
        </button>
      </div>
    </div>
  );
}

AuditLogsFilterBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  severityFilter: PropTypes.string.isRequired,
  onSeverityChange: PropTypes.func.isRequired,
  roleFilter: PropTypes.string.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
};
