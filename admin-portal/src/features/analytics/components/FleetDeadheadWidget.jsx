import PropTypes from "prop-types";

export default function FleetDeadheadWidget({ deadheadData = {} }) {
  const overallDeadheadRate = deadheadData?.overallDeadheadRate ?? deadheadData?.overallDeadheadPct ?? 4.8;
  const industryBenchmarkRate = deadheadData?.industryBenchmarkRate ?? deadheadData?.industryAvgPct ?? 12.0;
  const fuelSavingsValue = deadheadData?.fuelSavingsValue ?? deadheadData?.savingsAmount ?? "₹2,40,000";
  const backhaulMatches = deadheadData?.backhaulMatches ?? 142;
  const unmatchedEmptyMiles = deadheadData?.unmatchedEmptyMiles ?? "18.4 km/day";
  const categories = deadheadData?.categories || [
    { id: "c1", name: "32 FT Multi-Axle", deadheadPct: 4.2, baselinePct: 11.5, savedGmv: "₹1,12,000", color: "#5145f5" },
    { id: "c2", name: "20 FT Container Box", deadheadPct: 5.1, baselinePct: 12.8, savedGmv: "₹68,000", color: "#8b5cf6" },
    { id: "c3", name: "24 FT Cold-Chain Reefer", deadheadPct: 3.8, baselinePct: 9.6, savedGmv: "₹42,000", color: "#06b6d4" },
    { id: "c4", name: "40T Trailer", deadheadPct: 6.2, baselinePct: 14.2, savedGmv: "₹18,000", color: "#f59e0b" },
  ];

  return (
    <div className="analytics-widget-card analytics-deadhead-card" id="widget-tonnage">
      <div className="analytics-widget-header">
        <div>
          <h3 className="analytics-widget-title">Fleet Deadhead &amp; Empty Miles</h3>
          <p className="analytics-widget-subtitle">
            Triangulated backhaul optimization vs {industryBenchmarkRate}% industry benchmark
          </p>
        </div>

        <span className="material-symbols-outlined" style={{ color: "var(--an-primary-container)" }}>
          alt_route
        </span>
      </div>

      {/* Summary Highlight Box */}
      <div className="analytics-deadhead-summary-box">
        <div>
          <div className="analytics-deadhead-big-val">{overallDeadheadRate}%</div>
          <div className="analytics-deadhead-label">Empty Miles Ratio</div>
        </div>

        <div className="analytics-deadhead-savings-badge">
          <div className="analytics-savings-amount">{fuelSavingsValue}</div>
          <div className="analytics-savings-note">Fuel Burn Saved • {backhaulMatches} Matches</div>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="analytics-deadhead-categories">
        {categories.map((cat) => (
          <div key={cat.id} className="analytics-deadhead-cat-row">
            <div className="analytics-cat-meta">
              <span className="analytics-cat-name">{cat.name}</span>
              <span className="analytics-cat-val">
                {cat.deadheadPct}%{" "}
                <span style={{ fontSize: "10.5px", fontWeight: 400, color: "var(--an-outline)" }}>
                  (Saved {cat.savedGmv})
                </span>
              </span>
            </div>

            <div className="analytics-cat-track">
              <div
                className="analytics-cat-fill"
                style={{
                  width: `${(cat.deadheadPct / 15) * 100}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--an-outline)", paddingTop: "4px", borderTop: "1px solid var(--an-border-light)" }}>
        <span>Remaining empty haulage: {unmatchedEmptyMiles}</span>
        <span style={{ fontWeight: 600, color: "var(--an-green)" }}>+38 Backhauls Queued</span>
      </div>
    </div>
  );
}

FleetDeadheadWidget.propTypes = {
  deadheadData: PropTypes.shape({
    overallDeadheadRate: PropTypes.number.isRequired,
    previousMonthRate: PropTypes.number.isRequired,
    industryBenchmarkRate: PropTypes.number.isRequired,
    fuelSavingsValue: PropTypes.string.isRequired,
    backhaulMatches: PropTypes.number.isRequired,
    unmatchedEmptyMiles: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        deadheadPct: PropTypes.number.isRequired,
        baselinePct: PropTypes.number.isRequired,
        savedGmv: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
