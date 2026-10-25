import PropTypes from "prop-types";

export default function NotificationsFilterBar({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  channelFilter,
  onChannelChange,
  isAutoPolling,
  onToggleAutoPoll,
}) {
  return (
    <div className="notifications-filters-row" id="notifications-filter-controls">
      {/* Search Bar */}
      <div className="notifications-search-box">
        <span className="material-symbols-outlined notifications-search-icon">
          search
        </span>
        <input
          type="text"
          className="notifications-search-input"
          placeholder="Search trip #, driver name, KYC ref, or error..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search notifications"
        />
      </div>

      {/* Select Filter Dropdowns & Polling Control */}
      <div className="notifications-filter-selects">
        <select
          className="notifications-select"
          value={severityFilter}
          onChange={(e) => onSeverityChange(e.target.value)}
          aria-label="Filter by severity level"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical Only</option>
          <option value="warning">Warnings</option>
          <option value="info">Informational</option>
        </select>

        <select
          className="notifications-select"
          value={channelFilter}
          onChange={(e) => onChannelChange(e.target.value)}
          aria-label="Filter by notification channel"
        >
          <option value="all">All Channels</option>
          <option value="system">System UI</option>
          <option value="whatsapp">WhatsApp Ops</option>
          <option value="sms">SMS Gateway</option>
          <option value="webhooks">REST Webhooks</option>
        </select>

        <button
          type="button"
          className={`notifications-poll-btn ${isAutoPolling ? "polling" : ""}`}
          onClick={onToggleAutoPoll}
          title={isAutoPolling ? "Live 10s polling active (click to pause)" : "Click to enable live 10s polling"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            sync
          </span>
          <span>{isAutoPolling ? "Auto-poll 10s" : "Poll Paused"}</span>
        </button>
      </div>
    </div>
  );
}

NotificationsFilterBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  severityFilter: PropTypes.string.isRequired,
  onSeverityChange: PropTypes.func.isRequired,
  channelFilter: PropTypes.string.isRequired,
  onChannelChange: PropTypes.func.isRequired,
  isAutoPolling: PropTypes.bool.isRequired,
  onToggleAutoPoll: PropTypes.func.isRequired,
};
