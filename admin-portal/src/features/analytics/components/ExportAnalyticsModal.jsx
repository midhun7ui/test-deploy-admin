import { useState } from "react";
import PropTypes from "prop-types";

export default function ExportAnalyticsModal({
  isOpen,
  onClose,
  dailyData = [],
  hubMetrics = [],
  deadheadData = {},
  cohorts = [],
}) {
  const [format, setFormat] = useState("csv");
  const [sections, setSections] = useState({
    velocity: true,
    dwell: true,
    deadhead: true,
    cohorts: true,
  });

  if (!isOpen) return null;

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    const csvRows = [];
    csvRows.push(["HIRED PERFORMANCE ANALYTICS EXPORT"]);
    csvRows.push([`Generated At`, new Date().toISOString()]);
    csvRows.push([]);

    if (sections.velocity) {
      csvRows.push(["--- SECTION 1: BOOKING VELOCITY & DISPATCH PACING ---"]);
      csvRows.push(["Day", "Date", "Week", "Confirmed Loads", "Dispatched Loads", "Capacity Ceiling", "Gross Value", "Latency"]);
      dailyData.forEach((d) => {
        csvRows.push([
          d.day,
          d.dateStr,
          d.weekId,
          d.confirmed,
          d.fulfilled,
          d.capacity,
          `"${d.gmv}"`,
          d.dispatchLatency,
        ]);
      });
      csvRows.push([]);
    }

    if (sections.dwell) {
      csvRows.push(["--- SECTION 2: REGIONAL HUB DWELL & TURNAROUND LATENCY ---"]);
      csvRows.push(["Hub ID", "Hub Name", "City", "Dwell Hours", "Target Hours", "Status", "Queue Mins", "Loading Mins", "Gate Out Mins", "Throughput Trips", "Efficiency %"]);
      hubMetrics.forEach((h) => {
        csvRows.push([
          h.hubId,
          `"${h.hubName}"`,
          h.city,
          h.dwellHours,
          h.targetHours,
          h.statusLabel,
          h.queueMins,
          h.loadingMins,
          h.gateMins,
          h.throughputTrips,
          `${h.efficiencyScore}%`,
        ]);
      });
      csvRows.push([]);
    }

    if (sections.deadhead) {
      csvRows.push(["--- SECTION 3: FLEET DEADHEAD & EMPTY MILES OPTIMIZATION ---"]);
      csvRows.push([`Overall Deadhead Rate`, `${deadheadData.overallDeadheadRate || 4.8}%`]);
      csvRows.push([`Fuel Savings Value`, `"${deadheadData.fuelSavingsValue || "₹2,40,000"}"`]);
      csvRows.push([`Backhaul Matches`, deadheadData.backhaulMatches || 2]);
      csvRows.push(["Category ID", "Category Name", "Deadhead %", "Baseline %", "Saved GMV"]);
      (deadheadData.categories || []).forEach((c) => {
        csvRows.push([c.id, `"${c.name}"`, `${c.deadheadPct}%`, `${c.baselinePct}%`, `"${c.savedGmv}"`]);
      });
      csvRows.push([]);
    }

    if (sections.cohorts) {
      csvRows.push(["--- SECTION 4: ENTERPRISE DEMAND VELOCITY COHORTS ---"]);
      csvRows.push(["Account ID", "Company Name", "Industry", "Weekly Loads", "Allocated Tonnage MT", "Avg Dispatch Time", "Fulfillment SLA", "Retention", "Tier Status"]);
      cohorts.forEach((c) => {
        csvRows.push([
          c.id,
          `"${c.name}"`,
          `"${c.industry}"`,
          c.weeklyLoads,
          c.capacityAllocatedMt,
          c.avgDispatchTime,
          c.fulfillmentSla,
          c.retentionScore,
          c.status,
        ]);
      });
      csvRows.push([]);
    }

    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hired_analytics_${format}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onClose();
  };

  return (
    <div className="analytics-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="analytics-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="analytics-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--an-primary-container)" }}>
              file_download
            </span>
            <h2 className="analytics-modal-title">Export Cohort Analytics Package</h2>
          </div>
          <button
            type="button"
            className="analytics-modal-close-btn"
            onClick={onClose}
            aria-label="Close export modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="analytics-modal-body">
          {/* Format selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--an-text)" }}>
              Export File Format:
            </label>
            <div className="analytics-sim-pills">
              {[
                { id: "csv", label: "CSV Dataset (.csv)" },
                { id: "xlsx", label: "Excel Data (.csv/xlsx)" },
                { id: "pdf", label: "Audit Format (.csv)" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`analytics-sim-pill ${format === f.id ? "active" : ""}`}
                  onClick={() => setFormat(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section dimensions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--an-text)" }}>
              Include Dimension Datasets:
            </label>

            {[
              { id: "velocity", label: "Client Booking Velocity Timeseries (Daily & Hourly)", icon: "trending_up" },
              { id: "dwell", label: "Hub Turnaround Times & Yard Dwell Breakdown", icon: "warehouse" },
              { id: "deadhead", label: "Fleet Payload Density & Empty Miles Audit", icon: "alt_route" },
              { id: "cohorts", label: "Enterprise Concentration & Account Retention Matrix", icon: "corporate_fare" },
            ].map((item) => (
              <label
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: "var(--an-surface-low)",
                  border: "1px solid var(--an-border-light)",
                }}
              >
                <input
                  type="checkbox"
                  checked={sections[item.id]}
                  onChange={() => toggleSection(item.id)}
                  style={{ accentColor: "var(--an-primary-container)" }}
                />
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--an-secondary)" }}>
                  {item.icon}
                </span>
                <span style={{ fontWeight: 600, color: "var(--an-text)" }}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="analytics-modal-footer">
          <button type="button" className="analytics-btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="analytics-btn-modal-primary"
            onClick={handleExport}
          >
            Generate &amp; Download Data Package
          </button>
        </div>
      </div>
    </div>
  );
}

ExportAnalyticsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dailyData: PropTypes.array,
  hubMetrics: PropTypes.array,
  deadheadData: PropTypes.object,
  cohorts: PropTypes.array,
};
