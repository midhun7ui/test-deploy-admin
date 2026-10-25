import PropTypes from "prop-types";

export default function AdminUsersFilterBar({
  searchQuery,
  onSearchChange,
  selectedHub,
  onHubChange,
  selectedStatus,
  onStatusChange,
}) {
  return (
    <div className="admin-directory-filter-row" id="admin-directory-filters">
      {/* Search Input */}
      <div className="admin-search-input-box">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search admin by name, email, employee ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          id="admin-search-field"
          aria-label="Search admin staff"
        />
      </div>

      {/* Hub & Status Filters */}
      <div className="admin-filter-select-group">
        <div style={{ position: "relative" }}>
          <select
            className="admin-filter-select"
            value={selectedHub}
            onChange={(e) => onHubChange(e.target.value)}
            id="hub-scope-select"
            aria-label="Filter by Hub Scope"
          >
            <option value="all">All Hubs &amp; HQ</option>
            <option value="west">West Hub (Mumbai/Pune)</option>
            <option value="north">North Hub (Delhi NCR)</option>
            <option value="south">South Hub (BLR/Chennai)</option>
            <option value="hq">HQ Executive</option>
          </select>
          <span className="material-symbols-outlined admin-select-chevron" style={{ fontSize: "16px", right: "6px" }}>
            expand_more
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <select
            className="admin-filter-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            id="user-status-select"
            aria-label="Filter by User Status"
          >
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="2fa_pending">2FA Pending</option>
          </select>
          <span className="material-symbols-outlined admin-select-chevron" style={{ fontSize: "16px", right: "6px" }}>
            filter_list
          </span>
        </div>
      </div>
    </div>
  );
}

AdminUsersFilterBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedHub: PropTypes.string.isRequired,
  onHubChange: PropTypes.func.isRequired,
  selectedStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};
