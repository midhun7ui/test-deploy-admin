import PropTypes from "prop-types";

export default function NotificationsHeaderToolbar({
  selectedShift,
  onSelectShift,
  onMarkAllRead,
  onOpenRulesModal,
  onOpenChannelsModal,
  onOpenBroadcastModal,
}) {
  return (
    <div className="notifications-header-card" id="notifications-header-toolbar">
      <div className="notifications-header-top">
        <div className="notifications-title-group">
          <div className="notifications-title-row">
            <h1 className="notifications-page-title">Notifications &amp; Activity Center</h1>
            <span className="notifications-badge-pill">
              Real-time Ops &amp; Compliance Telemetry
            </span>
          </div>
          <p className="notifications-page-subtitle">
            Live event stream, critical operational alerts, SLA tolerance warnings, carrier compliance expirations, and financial webhook triggers.
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="notifications-header-actions">
          {/* Shift / Timeframe Selector */}
          <div className="notifications-shift-select-box" title="Shift timeframe filter">
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--notif-outline)" }}>
              schedule
            </span>
            <select
              className="notifications-shift-select"
              value={selectedShift}
              onChange={(e) => onSelectShift(e.target.value)}
              aria-label="Filter events by shift or timeframe"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="6h">Last 6 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="shift">Current Shift (08:00 - 20:00)</option>
            </select>
            <div className="notifications-live-beacon" title="Realtime event stream active" />
          </div>

          {/* Mark All Read Button */}
          <button
            type="button"
            className="notifications-btn-secondary"
            onClick={onMarkAllRead}
            id="btn-mark-all-read-main"
            title="Mark all notifications as read"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--notif-outline)" }}>
              done_all
            </span>
            <span>Mark All Read</span>
          </button>

          {/* Channels Button */}
          <button
            type="button"
            className="notifications-btn-secondary"
            onClick={onOpenChannelsModal}
            id="btn-channels-overview"
            title="Notification delivery channels"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--notif-outline)" }}>
              alt_route
            </span>
            <span>Channels</span>
            <span
              style={{
                backgroundColor: "var(--notif-surface-low)",
                color: "var(--notif-text)",
                fontSize: "10.5px",
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: "9999px",
              }}
            >
              4
            </span>
          </button>

          {/* Broadcast Alert Button */}
          <button
            type="button"
            className="notifications-btn-secondary"
            onClick={onOpenBroadcastModal}
            id="btn-broadcast-alert"
            title="Dispatch emergency fleet broadcast"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--notif-outline)" }}>
              campaign
            </span>
            <span>Broadcast</span>
          </button>

          {/* Alert Rules & Subscriptions Primary Action Button */}
          <button
            type="button"
            className="notifications-btn-primary"
            onClick={onOpenRulesModal}
            id="btn-alert-rules"
            title="Configure automated escalation rules"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              notifications_active
            </span>
            <span>Alert Rules &amp; Subscriptions</span>
          </button>
        </div>
      </div>
    </div>
  );
}

NotificationsHeaderToolbar.propTypes = {
  selectedShift: PropTypes.string.isRequired,
  onSelectShift: PropTypes.func.isRequired,
  onMarkAllRead: PropTypes.func.isRequired,
  onOpenRulesModal: PropTypes.func.isRequired,
  onOpenChannelsModal: PropTypes.func.isRequired,
  onOpenBroadcastModal: PropTypes.func.isRequired,
};
