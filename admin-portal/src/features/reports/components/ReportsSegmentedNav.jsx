import PropTypes from "prop-types";
import { REPORT_NAV_TABS } from "../data/mockReportsData";

export default function ReportsSegmentedNav({ activeTab, onSelectTab }) {
  return (
    <div className="reports-nav-bar">
      <div className="reports-nav-tabs-group">
        {REPORT_NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`reports-nav-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectTab(tab.id)}
            >
              <span className="material-symbols-outlined">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="reports-live-pipeline-pod">
        <span className="reports-pulse-dot" />
        <span>Live Pipeline Mode</span>
      </div>
    </div>
  );
}

ReportsSegmentedNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onSelectTab: PropTypes.func.isRequired,
};
