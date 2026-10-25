import PropTypes from "prop-types";

export default function SettingsNavTabs({ tabs, activeTab, onSelectTab }) {
  return (
    <div className="settings-tabs-wrapper">
      <div className="settings-tabs-list" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`settings-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectTab(tab.id)}
              id={`settings-tab-${tab.id}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

SettingsNavTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onSelectTab: PropTypes.func.isRequired,
};
