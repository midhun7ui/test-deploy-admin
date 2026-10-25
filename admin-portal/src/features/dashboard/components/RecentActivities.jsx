import { useState, useMemo } from "react";
import PropTypes from "prop-types";

function RecentActivities({ activities, onActivityClick, onViewAll }) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = useMemo(() => {
    if (!activities) return [];

    return activities.filter((act) => {
      const matchesCategory =
        activeTab === "all" || act.category === activeTab;

      const matchesSearch =
        searchQuery === "" ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.entityCode?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activities, activeTab, searchQuery]);

  return (
    <article className="dashboard-card activities-feed-card" id="card-recent-activities">
      {/* Card Header */}
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon-pill icon-indigo">
            <span className="material-symbols-outlined">notifications_active</span>
          </div>
          <div>
            <h3 className="card-title">Recent Operational Activities</h3>
            <p className="card-subtitle">
              Live audit stream of order assignments, driver onboarding, telemetry, and payouts
            </p>
          </div>
        </div>

        <div className="card-header-actions">
          <button
            type="button"
            className="action-btn secondary-btn"
            id="btn-view-all-activities"
            onClick={onViewAll}
          >
            <span>Audit Trail</span>
            <span className="material-symbols-outlined">open_in_new</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="activities-controls-row">
        <div className="activities-tabs-pill">
          <button
            type="button"
            className={`tab-pill-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Activity
          </button>
          <button
            type="button"
            className={`tab-pill-btn ${activeTab === "order" ? "active" : ""}`}
            onClick={() => setActiveTab("order")}
          >
            Orders
          </button>
          <button
            type="button"
            className={`tab-pill-btn ${activeTab === "trip" ? "active" : ""}`}
            onClick={() => setActiveTab("trip")}
          >
            Trips
          </button>
          <button
            type="button"
            className={`tab-pill-btn ${activeTab === "driver" ? "active" : ""}`}
            onClick={() => setActiveTab("driver")}
          >
            Drivers &amp; KYC
          </button>
          <button
            type="button"
            className={`tab-pill-btn ${activeTab === "payout" ? "active" : ""}`}
            onClick={() => setActiveTab("payout")}
          >
            Payouts
          </button>
        </div>

        <div className="activities-search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Filter events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="activity-search-input"
            id="input-filter-activities"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Activities Timeline List */}
      <div className="activities-timeline-container">
        {filteredActivities.length === 0 ? (
          <div className="activities-empty-state">
            <span className="material-symbols-outlined empty-icon">event_busy</span>
            <p>No operational activities matching your filter criteria.</p>
          </div>
        ) : (
          <div className="activities-list">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={`activity-item severity-${activity.severity || "info"}`}
                onClick={() => onActivityClick?.(activity)}
                role="button"
                tabIndex={0}
              >
                {/* Icon box */}
                <div className={`activity-icon-node icon-${activity.category}`}>
                  <span className="material-symbols-outlined">
                    {activity.icon || "info"}
                  </span>
                </div>

                {/* Main description */}
                <div className="activity-body">
                  <div className="activity-title-line">
                    <strong className="activity-title">{activity.title}</strong>
                    {activity.entityCode && (
                      <span className="activity-entity-chip">
                        {activity.entityCode}
                      </span>
                    )}
                    {activity.badge && (
                      <span className={`activity-badge badge-${activity.severity || "info"}`}>
                        {activity.badge}
                      </span>
                    )}
                  </div>

                  <p className="activity-description">{activity.description}</p>
                </div>

                {/* Timestamp */}
                <div className="activity-meta">
                  <span className="activity-timestamp">
                    <span className="material-symbols-outlined meta-icon">schedule</span>
                    <span>{activity.timestamp}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

RecentActivities.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onActivityClick: PropTypes.func,
  onViewAll: PropTypes.func,
};

export default RecentActivities;
