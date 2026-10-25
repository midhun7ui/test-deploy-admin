import PropTypes from "prop-types";

/**
 * Filter Tabs Bar for Driver Register
 * All Drivers, Active, Available, On Trip, Pending KYC, Inactive
 */
export default function DriverStatusTabs({ activeTab, onSelectTab, counts }) {
  const tabs = [
    { id: "all", label: "All Drivers", count: counts.all },
    { id: "active", label: "Active", count: counts.active },
    { id: "available", label: "Available", count: counts.available },
    { id: "ontrip", label: "On Trip", count: counts.onTrip },
    { id: "pending", label: "Pending KYC", count: counts.pendingKyc, isAmberPill: true },
    { id: "bank", label: "Management Bank", count: counts.pendingBank || 0, isAmberPill: (counts.pendingBank || 0) > 0 },
    { id: "inactive", label: "Inactive", count: counts.inactive },
  ];

  return (
    <div className="driver-pipeline-tabs" role="tablist" aria-label="Driver filter tabs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`driver-pipeline-tab-btn ${isActive ? "active" : ""}`}
            onClick={() => onSelectTab(tab.id)}
            id={`tab-driver-${tab.id}`}
          >
            <span>{tab.label}</span>
            {tab.isAmberPill ? (
              <span className="driver-tab-badge-amber">{tab.count}</span>
            ) : (
              <span className="driver-tab-count">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

DriverStatusTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onSelectTab: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    all: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
    available: PropTypes.number.isRequired,
    onTrip: PropTypes.number.isRequired,
    pendingKyc: PropTypes.number.isRequired,
    pendingBank: PropTypes.number,
    inactive: PropTypes.number.isRequired,
  }).isRequired,
};
