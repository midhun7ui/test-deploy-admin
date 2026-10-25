import { useState } from "react";
import PropTypes from "prop-types";

export default function SimulateDemandModal({ isOpen, onClose, corridors = [], totalBookings = 2 }) {
  const [surgePct, setSurgePct] = useState(40);
  const [selectedLane, setSelectedLane] = useState("all");

  if (!isOpen) return null;

  // Real-time calculation based on selected surge percentage
  const multiplier = surgePct / 100;
  const baseLoads = Math.max(2, totalBookings);
  const additionalLoads = Math.round(baseLoads * multiplier * 10) / 10;
  const trucksNeeded = Math.max(1, Math.round(additionalLoads * 1.2));
  const estimatedTicket = 48000;
  const marginExpansion = Math.round(additionalLoads * estimatedTicket * 0.15).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
  const simulatedDeadhead = (4.8 + multiplier * 2.5).toFixed(1);

  const selectedCorridorObj = corridors.find((c) => c.id === selectedLane);
  const laneLabel = selectedCorridorObj ? selectedCorridorObj.corridor : "Network-Wide";

  return (
    <div className="analytics-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="analytics-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="analytics-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--an-primary-container)" }}>
              rocket_launch
            </span>
            <h2 className="analytics-modal-title">Simulate Corridor Demand Surge</h2>
          </div>
          <button
            type="button"
            className="analytics-modal-close-btn"
            onClick={onClose}
            aria-label="Close simulation modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="analytics-modal-body">
          <p style={{ fontSize: "13px", color: "var(--an-text-muted)", margin: 0, lineHeight: 1.5 }}>
            Simulate the operational and financial impact of sudden demand spikes across client booking cohorts to calculate needed driver capacity and mitigate bottleneck risks.
          </p>

          {/* Surge Level Selector */}
          <div className="analytics-sim-slider-group">
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--an-text)" }}>
              Surge Magnitude Level:
            </label>
            <div className="analytics-sim-pills">
              {[
                { val: 20, label: "+20% Moderate Peak" },
                { val: 40, label: "+40% Festive Surge" },
                { val: 60, label: "+60% Extreme Strain" },
              ].map((pill) => (
                <button
                  key={pill.val}
                  type="button"
                  className={`analytics-sim-pill ${surgePct === pill.val ? "active" : ""}`}
                  onClick={() => setSurgePct(pill.val)}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corridor Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--an-text)" }}>
              Target Corridor Focus:
            </label>
            <select
              value={selectedLane}
              onChange={(e) => setSelectedLane(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--an-radius-sm)",
                border: "1px solid var(--an-border)",
                backgroundColor: "var(--an-surface-low)",
                fontSize: "13px",
                color: "var(--an-text)",
                outline: "none",
              }}
            >
              <option value="all">Network-Wide (All Hubs &amp; Corridors)</option>
              {corridors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.corridor} ({c.saturationPct}% sat • {c.statusLabel})
                </option>
              ))}
            </select>
          </div>

          {/* Simulation Output Forecast */}
          <div className="analytics-sim-results-grid">
            <div className="analytics-sim-box">
              <span className="analytics-sim-box-title">Additional Loads / Day</span>
              <span className="analytics-sim-box-val">+{additionalLoads} Loads</span>
              <span style={{ fontSize: "11px", color: "var(--an-outline)" }}>
                From {baseLoads} to {(baseLoads + additionalLoads).toFixed(1)}/day
              </span>
            </div>

            <div className="analytics-sim-box">
              <span className="analytics-sim-box-title">Incremental Trucks Needed</span>
              <span className="analytics-sim-box-val" style={{ color: "var(--an-danger)" }}>
                +{trucksNeeded} Vehicles
              </span>
              <span style={{ fontSize: "11px", color: "var(--an-outline)" }}>
                Active driver recall required
              </span>
            </div>

            <div className="analytics-sim-box">
              <span className="analytics-sim-box-title">Simulated Margin Gain</span>
              <span className="analytics-sim-box-val" style={{ color: "var(--an-green)" }}>
                +₹{marginExpansion}
              </span>
              <span style={{ fontSize: "11px", color: "var(--an-outline)" }}>
                Net revenue capture at 15% platform cut
              </span>
            </div>

            <div className="analytics-sim-box">
              <span className="analytics-sim-box-title">Simulated Deadhead Ratio</span>
              <span className="analytics-sim-box-val" style={{ color: "var(--an-amber)" }}>
                {simulatedDeadhead}%
              </span>
              <span style={{ fontSize: "11px", color: "var(--an-outline)" }}>
                Baseline 4.8% (Backhaul matched)
              </span>
            </div>
          </div>
        </div>

        <div className="analytics-modal-footer">
          <button type="button" className="analytics-btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="analytics-btn-modal-primary"
            onClick={() => {
              alert(`Simulated Surge Scenario (+${surgePct}% for ${laneLabel}) saved to Dispatch Operational Template.`);
              onClose();
            }}
          >
            Apply Scenario as Template
          </button>
        </div>
      </div>
    </div>
  );
}

SimulateDemandModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  corridors: PropTypes.array,
  totalBookings: PropTypes.number,
};
