import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { DATE_PRESETS, CORRIDOR_PRESETS } from "../data/mockReportsData";

export default function ReportsHeaderToolbar({
  selectedDateRange,
  onSelectDateRange,
  selectedCorridor,
  onSelectCorridor,
  onExportCsv,
  onRefresh,
  isLoading = false,
  corridorOptions = [],
}) {
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [corridorDropdownOpen, setCorridorDropdownOpen] = useState(false);

  const dateRef = useRef(null);
  const corridorRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateDropdownOpen(false);
      }
      if (corridorRef.current && !corridorRef.current.contains(e.target)) {
        setCorridorDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentDateLabel =
    DATE_PRESETS.find((d) => d.id === selectedDateRange)?.label ||
    "This Month (Oct 2026)";

  const corridorsList = corridorOptions && corridorOptions.length > 0 ? corridorOptions : CORRIDOR_PRESETS;

  const currentCorridorLabel =
    corridorsList.find((c) => c.id === selectedCorridor)?.label ||
    "All Corridors & Hubs";

  return (
    <div className="reports-header-section">
      <div className="reports-header-title-pod">
        <div className="reports-header-heading-line">
          <h1 className="reports-header-h1">Reports &amp; Analytics</h1>
          <span className="reports-category-badge">
            Operational &amp; Financial Intelligence
          </span>
        </div>
        <p className="reports-header-subtitle">
          Consolidated freight revenue analysis, fleet utilization, corridor
          transit times, and carrier performance metrics.
        </p>
      </div>

      <div className="reports-header-actions-bar">
        {/* Date Preset Range Trigger */}
        <div className="reports-dropdown-trigger" ref={dateRef} onClick={() => setDateDropdownOpen((prev) => !prev)}>
          <span className="material-symbols-outlined">calendar_today</span>
          <span>{currentDateLabel}</span>
          <span className="material-symbols-outlined dropdown-chevron">
            expand_more
          </span>

          {dateDropdownOpen && (
            <div className="reports-dropdown-menu">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`reports-dropdown-item ${
                    selectedDateRange === preset.id ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDateRange(preset.id);
                    setDateDropdownOpen(false);
                  }}
                >
                  <span>{preset.label}</span>
                  {selectedDateRange === preset.id && (
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Corridor Scope Select */}
        <div
          className="reports-dropdown-trigger"
          ref={corridorRef}
          onClick={() => setCorridorDropdownOpen((prev) => !prev)}
        >
          <span className="material-symbols-outlined">alt_route</span>
          <span>{currentCorridorLabel}</span>
          <span className="material-symbols-outlined dropdown-chevron">
            arrow_drop_down
          </span>

          {corridorDropdownOpen && (
            <div className="reports-dropdown-menu">
              {corridorsList.map((corridor) => (
                <button
                  key={corridor.id}
                  type="button"
                  className={`reports-dropdown-item ${
                    selectedCorridor === corridor.id ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCorridor(corridor.id);
                    setCorridorDropdownOpen(false);
                  }}
                >
                  <span>{corridor.label}</span>
                  {selectedCorridor === corridor.id && (
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh Metrics Button */}
        {onRefresh && (
          <button
            className="reports-btn-secondary"
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh operational report metrics from database"
          >
            <span
              className="material-symbols-outlined"
              style={{
                animation: isLoading ? "repRotate 1s linear infinite" : "none",
              }}
            >
              refresh
            </span>
            <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
          </button>
        )}

        {/* Export CSV Button */}
        {onExportCsv && (
          <button
            className="reports-btn-primary"
            type="button"
            onClick={onExportCsv}
            title="Export operational report data to CSV"
          >
            <span className="material-symbols-outlined">download</span>
            <span>Export CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}

ReportsHeaderToolbar.propTypes = {
  selectedDateRange: PropTypes.string.isRequired,
  onSelectDateRange: PropTypes.func.isRequired,
  selectedCorridor: PropTypes.string.isRequired,
  onSelectCorridor: PropTypes.func.isRequired,
  onExportCsv: PropTypes.func,
  onRefresh: PropTypes.func,
  isLoading: PropTypes.bool,
  corridorOptions: PropTypes.array,
};
