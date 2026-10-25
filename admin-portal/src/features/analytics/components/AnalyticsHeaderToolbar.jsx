import PropTypes from "prop-types";

export default function AnalyticsHeaderToolbar({
  selectedTimeframe,
  onSelectTimeframe,
  selectedComparison,
  onSelectComparison,
  selectedCategory,
  onSelectCategory,
  onOpenSimulateModal,
  onOpenExportModal,
  timePresets,
  comparisonModels,
  fleetCategories,
}) {
  return (
    <div className="analytics-header-card">
      <div className="analytics-header-top">
        <div className="analytics-title-group">
          <div className="analytics-title-row">
            <h1 className="analytics-page-title">Performance Analytics</h1>
            <span className="analytics-badge-engine">
              <span className="material-symbols-outlined analytics-badge-icon">
                insights
              </span>
              Intelligence &amp; Capacity Engine
            </span>
          </div>
          <p className="analytics-page-subtitle">
            Client booking velocity, tonnage payload density &amp; warehouse dwell cycle intelligence
          </p>
        </div>

        <div className="analytics-header-actions">
          <button
            type="button"
            className="analytics-btn-export"
            onClick={onOpenExportModal}
            aria-label="Export cohort analytics"
          >
            <span className="material-symbols-outlined">file_download</span>
            <span>Export Cohort Analytics</span>
          </button>

          {onOpenSimulateModal && (
            <button
              type="button"
              className="analytics-btn-simulate"
              onClick={onOpenSimulateModal}
              aria-label="Launch surge capacity simulation"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              <span>Simulate Demand Surge</span>
            </button>
          )}
        </div>
      </div>

      <div className="analytics-filter-toolbar">
        <div className="analytics-filter-group">
          {/* Timeframe Horizon Preset */}
          <div className="analytics-select-control">
            <span className="material-symbols-outlined analytics-filter-icon">
              calendar_today
            </span>
            <select
              value={selectedTimeframe}
              onChange={(e) => onSelectTimeframe(e.target.value)}
              aria-label="Select timeframe horizon"
            >
              {timePresets.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.label}
                </option>
              ))}
            </select>
          </div>

          {/* Comparison Baseline */}
          <div className="analytics-select-control">
            <span className="material-symbols-outlined analytics-filter-icon">
              compare_arrows
            </span>
            <select
              value={selectedComparison}
              onChange={(e) => onSelectComparison(e.target.value)}
              aria-label="Select comparison baseline"
            >
              {comparisonModels.map((cm) => (
                <option key={cm.id} value={cm.id}>
                  {cm.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fleet Category Filter */}
          <div className="analytics-select-control">
            <span className="material-symbols-outlined analytics-filter-icon">
              local_shipping
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              aria-label="Select fleet tonnage category"
            >
              {fleetCategories.map((fc) => (
                <option key={fc.id} value={fc.id}>
                  {fc.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time Telemetry Indicator */}
        <div className="analytics-sync-pill">
          <span className="analytics-sync-dot" />
          <span>Realtime Telemetry Engine • 30s Auto-Sync</span>
        </div>
      </div>
    </div>
  );
}

AnalyticsHeaderToolbar.propTypes = {
  selectedTimeframe: PropTypes.string.isRequired,
  onSelectTimeframe: PropTypes.func.isRequired,
  selectedComparison: PropTypes.string.isRequired,
  onSelectComparison: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  onOpenSimulateModal: PropTypes.func.isRequired,
  onOpenExportModal: PropTypes.func.isRequired,
  timePresets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  comparisonModels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  fleetCategories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
