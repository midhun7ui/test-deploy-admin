import PropTypes from "prop-types";

/**
 * Filter Tabs Bar for the Orders Pipeline
 * All Orders, Pending Review, Accepted, Converted to Trip, Rejected
 */
export default function OrderStatusTabs({ activeTab, onSelectTab, counts }) {
  const tabs = [
    { id: "all", label: "All Orders", count: counts.all },
    { id: "pending", label: "Pending Review", count: counts.pending, hasPill: true },
    { id: "accepted", label: "Accepted", count: counts.accepted },
    { id: "converted", label: "Converted to Trip", count: counts.converted },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="orders-pipeline-tabs" role="tablist" aria-label="Orders status filters">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`order-pipeline-tab-btn ${isActive ? "active" : ""}`}
            onClick={() => onSelectTab(tab.id)}
            id={`tab-order-${tab.id}`}
          >
            <span>{tab.label}</span>
            {tab.hasPill ? (
              <span className="tab-badge">{tab.count}</span>
            ) : (
              <span className="tab-count-parens">({tab.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

OrderStatusTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onSelectTab: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    all: PropTypes.number.isRequired,
    pending: PropTypes.number.isRequired,
    accepted: PropTypes.number.isRequired,
    converted: PropTypes.number.isRequired,
    rejected: PropTypes.number.isRequired,
  }).isRequired,
};
