import PropTypes from "prop-types";

function TripStatusTabs({ activeTab, onSelectTab, counts }) {
  const tabs = [
    { id: "all", label: "All Trips", count: counts.all ?? 48 },
    { id: "scheduled", label: "Scheduled", count: counts.scheduled ?? 16 },
    { id: "in_transit", label: "In Transit", count: counts.inTransit ?? 24 },
    { id: "at_pickup", label: "At Pickup", count: counts.atPickup ?? 4 },
    { id: "delivered", label: "Delivered", count: counts.delivered ?? 128 },
    { id: "delayed", label: "Delayed", count: counts.delayed ?? 4, isError: true },
  ];

  return (
    <div className="trip-status-tabs-container">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const buttonClass = `trip-status-tab-btn ${
          isActive
            ? "trip-status-tab-active"
            : tab.isError
            ? "trip-status-tab-delayed"
            : "trip-status-tab-inactive"
        }`;

        const badgeClass = `trip-tab-badge ${
          isActive
            ? "trip-tab-badge-active"
            : tab.isError
            ? "trip-tab-badge-error"
            : "trip-tab-badge-muted"
        }`;

        return (
          <button
            key={tab.id}
            type="button"
            className={buttonClass}
            onClick={() => onSelectTab(tab.id)}
            id={`tab-trip-status-${tab.id}`}
          >
            <span>{tab.label}</span>
            <span className={badgeClass}>{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}

TripStatusTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onSelectTab: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    all: PropTypes.number,
    scheduled: PropTypes.number,
    inTransit: PropTypes.number,
    atPickup: PropTypes.number,
    delivered: PropTypes.number,
    delayed: PropTypes.number,
  }),
};

TripStatusTabs.defaultProps = {
  counts: {
    all: 48,
    scheduled: 16,
    inTransit: 24,
    atPickup: 4,
    delivered: 128,
    delayed: 4,
  },
};

export default TripStatusTabs;
