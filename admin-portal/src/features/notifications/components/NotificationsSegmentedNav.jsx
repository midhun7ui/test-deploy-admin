import PropTypes from "prop-types";

export default function NotificationsSegmentedNav({ activeTab, onSelectTab, counts }) {
  const tabs = [
    { id: "all", label: "All Notifications", count: counts.all ?? 0 },
    { id: "critical", label: "Critical & SLA", count: counts.critical ?? 0, badgeType: "urgent" },
    { id: "compliance", label: "Compliance & KYC", count: counts.compliance ?? 0, badgeType: "warning" },
    { id: "finance", label: "Finance & Payouts", count: counts.finance ?? 0 },
    { id: "telemetry", label: "Trip Telemetry", count: counts.telemetry ?? 0 },
    { id: "webhooks", label: "Webhooks", count: counts.webhooks ?? 0 },
  ];

  return (
    <div className="notifications-tabs-bar" role="tablist" aria-label="Notification Categories">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`notifications-tab-btn ${isActive ? "active" : ""}`}
            onClick={() => onSelectTab(tab.id)}
            id={`tab-notif-${tab.id}`}
          >
            <span>{tab.label}</span>
            <span
              className={`notifications-tab-count ${
                tab.badgeType === "urgent"
                  ? "urgent"
                  : tab.badgeType === "warning"
                  ? "warning"
                  : ""
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

NotificationsSegmentedNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onSelectTab: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    all: PropTypes.number,
    critical: PropTypes.number,
    compliance: PropTypes.number,
    finance: PropTypes.number,
    telemetry: PropTypes.number,
    webhooks: PropTypes.number,
  }).isRequired,
};
