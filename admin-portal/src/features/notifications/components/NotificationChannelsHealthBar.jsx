import PropTypes from "prop-types";

export default function NotificationChannelsHealthBar({
  channelsHealth,
  onOpenWebhookLogs,
  onOpenChannelConfig,
}) {
  const { summary, channels } = channelsHealth;

  return (
    <div className="notifications-health-bar" id="notifications-dispatcher-health-bar">
      <div className="notifications-health-left">
        <div className="notifications-health-status-cluster">
          <div className="notifications-health-dot" />
          <span className="notifications-health-title">{summary}</span>
        </div>

        <div className="notifications-health-metrics">
          {channels.map((ch, idx) => (
            <span key={ch.name} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              {idx > 0 && <span>•</span>}
              <span>
                <strong style={{ color: "var(--notif-text)" }}>{ch.name}:</strong>{" "}
                {ch.metric} ({ch.latency})
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="notifications-health-actions">
        <button
          type="button"
          className="notifications-health-btn ghost"
          onClick={onOpenWebhookLogs}
          id="btn-open-webhook-logs"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--notif-primary)" }}>
            terminal
          </span>
          <span>Webhook Logs</span>
        </button>

        <button
          type="button"
          className="notifications-health-btn accent"
          onClick={onOpenChannelConfig}
          id="btn-configure-dispatch-webhooks"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            settings_input_component
          </span>
          <span>Configure Dispatch Webhooks</span>
        </button>
      </div>
    </div>
  );
}

NotificationChannelsHealthBar.propTypes = {
  channelsHealth: PropTypes.shape({
    status: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    channels: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        metric: PropTypes.string.isRequired,
        latency: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onOpenWebhookLogs: PropTypes.func.isRequired,
  onOpenChannelConfig: PropTypes.func.isRequired,
};
