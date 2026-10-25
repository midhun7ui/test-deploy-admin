import PropTypes from "prop-types";

const NAV_TABS = [
  { id: "velocity", label: "Velocity & Demand Curves", icon: "trending_up" },
  { id: "tonnage", label: "Fleet Tonnage & Deadhead", icon: "local_shipping" },
  { id: "dwell", label: "Hub Dwell & Turnaround", icon: "schedule" },
  { id: "retention", label: "Enterprise Booking Retention", icon: "hub" },
];

export default function AnalyticsSegmentedNav({ activeTab, onSelectTab }) {
  return (
    <div className="analytics-segmented-nav">
      <div className="analytics-nav-tabs">
        {NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`analytics-nav-tab ${isActive ? "active" : ""}`}
              onClick={() => onSelectTab(tab.id)}
            >
              <span className="material-symbols-outlined analytics-nav-icon">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="analytics-nav-engine-status">
        <span className="analytics-sync-dot" />
        <span>Telemetry Frequency: 30s Realtime</span>
      </div>
    </div>
  );
}

AnalyticsSegmentedNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onSelectTab: PropTypes.func.isRequired,
};
