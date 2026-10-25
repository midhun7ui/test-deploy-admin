import PropTypes from "prop-types";

function CompanyStatusTabs({ activeTab, onTabChange, counts }) {
  const tabs = [
    { id: "all", label: "All Companies", count: counts.all },
    { id: "active", label: "Active", count: counts.active },
    {
      id: "pending-kyc",
      label: "Pending KYC",
      count: counts.pendingKyc,
      badgeType: "amber",
    },
    {
      id: "credit-watch",
      label: "Credit Watch",
      count: counts.creditWatch,
    },
    {
      id: "suspended",
      label: "Suspended",
      count: counts.suspended,
    },
  ];

  return (
    <div className="companies-status-tabs" role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            className={`company-tab-btn ${isActive ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            id={`tab-company-${tab.id}`}
          >
            <span>{tab.label}</span>
            <span
              className={`company-tab-badge ${
                tab.badgeType === "amber" && !isActive ? "amber" : ""
              }`}
            >
              ({tab.count})
            </span>
          </button>
        );
      })}
    </div>
  );
}

CompanyStatusTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    all: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
    pendingKyc: PropTypes.number.isRequired,
    creditWatch: PropTypes.number.isRequired,
    suspended: PropTypes.number.isRequired,
  }).isRequired,
};

export default CompanyStatusTabs;
