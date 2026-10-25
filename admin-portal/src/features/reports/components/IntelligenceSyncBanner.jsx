import { useState } from "react";
import PropTypes from "prop-types";

export default function IntelligenceSyncBanner({ onRefreshMetrics }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onRefreshMetrics();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="reports-sync-banner">
      <div className="reports-sync-left">
        <div className="reports-sync-icon-pod">
          <span
            className="material-symbols-outlined"
            style={{
              animation: isRefreshing ? "repRotate 1s linear infinite" : "none",
            }}
          >
            sync
          </span>
        </div>

        <div className="reports-text-pod">
          <div className="reports-sync-title-row">
            <h4 className="reports-sync-title">
              Live Operational Intelligence Synchronized
            </h4>
            <span className="reports-sync-dot" />
          </div>
          <p className="reports-sync-desc">
            Consolidated freight revenue analysis, fleet utilization, and corridor fulfillment metrics
            synchronized directly from live Order, Trip, and Invoicing records.
          </p>
        </div>
      </div>

      <div className="reports-sync-actions">
        <button
          type="button"
          className="reports-sync-btn-refresh"
          onClick={handleManualRefresh}
          disabled={isRefreshing}
        >
          <span className="material-symbols-outlined">refresh</span>
          <span>{isRefreshing ? "Refreshing..." : "Refresh Metrics Now"}</span>
        </button>
      </div>
    </div>
  );
}

IntelligenceSyncBanner.propTypes = {
  onRefreshMetrics: PropTypes.func.isRequired,
};
