import { useState, useMemo, useRef } from "react";
import PropTypes from "prop-types";

const EMPTY_WEEK_POINTS = [
  { day: "Mon", fullDay: "Monday", val: 0, invoiced: "₹0", disbursed: "₹0", platform: "₹0" },
  { day: "Tue", fullDay: "Tuesday", val: 0, invoiced: "₹0", disbursed: "₹0", platform: "₹0" },
  { day: "Wed", fullDay: "Wednesday", val: 0, invoiced: "₹0", disbursed: "₹0", platform: "₹0" },
  { day: "Thu", fullDay: "Thursday", val: 0, invoiced: "₹0", disbursed: "₹0", platform: "₹0" },
  { day: "Fri", fullDay: "Friday", val: 0, invoiced: "₹0", disbursed: "₹0", platform: "₹0" },
  { day: "Sat", fullDay: "Saturday", val: 0, invoiced: "₹0", disbursed: "₹0", platform: "₹0" },
  { day: "Sun", fullDay: "Sunday", val: 0, invoiced: "₹0", disbursed: "₹0", platform: "₹0" },
];

// Multi-week datasets mapping Mon -> Sun initialized to clean baseline
const WEEK_DATASETS = {
  current: { id: "current", label: "Current Week", points: EMPTY_WEEK_POINTS },
  w1: { id: "w1", label: "Week 1", points: EMPTY_WEEK_POINTS },
  w2: { id: "w2", label: "Week 2", points: EMPTY_WEEK_POINTS },
  w3: { id: "w3", label: "Week 3", points: EMPTY_WEEK_POINTS },
  w4: { id: "w4", label: "Week 4", points: EMPTY_WEEK_POINTS },
};

// 7 X-coordinates evenly spaced from Mon to Sun in 620x280 viewBox
const X_COORDINATES = [75, 160, 245, 330, 415, 500, 585];
const Y_BASELINE = 240;

export default function FreightVelocityChart({ velocityData }) {
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [activeSeries, setActiveSeries] = useState("gross");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const svgRef = useRef(null);

  const title = velocityData?.title || "Freight Billing vs Net Payout Velocity";
  const subtitle = velocityData?.subtitle || "Weekly billing pace against driver disbursals across active billing cycles";
  const footerMetrics = velocityData?.footerMetrics || {
    avgFreightTicket: { label: "Average Freight Ticket", value: "₹28,500" },
    peakRevenueDay: { label: "Peak Day Rate", value: "Sun 19 Oct (470 Trips / ₹4.70L)" },
    netRetainedMargin: { label: "Net Retained Margin", value: "15.0% Fixed Platform Fee" },
  };

  const availableDatasets = useMemo(() => {
    if (velocityData?.weeklyDatasets && Object.keys(velocityData.weeklyDatasets).length > 0) {
      return velocityData.weeklyDatasets;
    }
    return WEEK_DATASETS;
  }, [velocityData]);

  const currentDataset = availableDatasets[selectedWeek] || availableDatasets.current || Object.values(availableDatasets)[0] || WEEK_DATASETS.current;
  const currentPoints = currentDataset?.points || WEEK_DATASETS.current.points;

  const yMax = useMemo(() => {
    const vals = currentPoints.map((p) => p.val || 0);
    const maxVal = Math.max(...vals, 100);
    return Math.max(500, Math.ceil(maxVal / 100) * 100);
  }, [currentPoints]);

  // Calculate coordinates matching the uploaded reference image
  const chartCoordinates = useMemo(() => {
    return currentPoints.map((item, index) => {
      // Linear scaling: 0 at y=240, yMax at y=40 (step 40px per 100 units when yMax is 500)
      let displayVal = item.val;
      if (activeSeries === "driver") {
        displayVal = Math.round(item.val * 0.85); // 85% driver take
      } else if (activeSeries === "platform") {
        displayVal = Math.round(item.val * 0.15); // 15% platform take
      }

      const x = X_COORDINATES[index];
      const y = Y_BASELINE - (displayVal / yMax) * 200;

      return {
        index,
        x,
        y: Number(y.toFixed(1)),
        val: displayVal,
        item,
      };
    });
  }, [currentPoints, activeSeries, yMax]);

  // Construct crisp straight line and area fill paths matching screenshot
  const linePath = useMemo(() => {
    return chartCoordinates.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");
  }, [chartCoordinates]);

  const areaPath = useMemo(() => {
    if (chartCoordinates.length === 0) return "";
    const firstX = chartCoordinates[0].x;
    const lastX = chartCoordinates[chartCoordinates.length - 1].x;
    return `M ${firstX} ${Y_BASELINE} L ${linePath.slice(2)} L ${lastX} ${Y_BASELINE} Z`;
  }, [chartCoordinates, linePath]);

  // Mouse move handler for canvas-wide cursor scrubbing (matching performance analytics)
  const handleMouseMove = (e) => {
    if (!svgRef.current || chartCoordinates.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * 620;

    // Find closest point by X coordinate
    let closestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < chartCoordinates.length; i++) {
      const diff = Math.abs(chartCoordinates[i].x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    setHoveredIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const activePoint = hoveredIndex !== null && chartCoordinates[hoveredIndex] ? chartCoordinates[hoveredIndex] : null;
  const activeItem = activePoint?.item;

  // Choose stroke color according to series
  const seriesColor =
    activeSeries === "driver"
      ? "#535d82"
      : activeSeries === "platform"
      ? "#777588"
      : "#00a8ff"; // Vibrant electric cyan from the reference image

  return (
    <div className="reports-chart-card">
      <div className="reports-chart-card-header">
        <div>
          <h2 className="reports-chart-title">{title}</h2>
          <p className="reports-chart-subtitle">{subtitle}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          {/* Week Filter Bar */}
          <div className="reports-chart-timeframe-bar">
            {Object.values(availableDatasets).map((w) => (
              <button
                key={w.id}
                type="button"
                className={`reports-chart-timeframe-btn ${selectedWeek === w.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedWeek(w.id);
                  setHoveredIndex(null);
                }}
              >
                {w.label}
              </button>
            ))}
          </div>

          {/* Series Toggle Buttons */}
          <div className="reports-chart-series-filters">
            <button
              type="button"
              className={`reports-chart-filter-btn ${activeSeries === "gross" ? "active" : ""}`}
              onClick={() => setActiveSeries("gross")}
            >
              <span className="reports-series-dot" style={{ backgroundColor: "#00a8ff" }} />
              <span>Gross Invoiced</span>
            </button>

            <button
              type="button"
              className={`reports-chart-filter-btn ${activeSeries === "driver" ? "active" : ""}`}
              onClick={() => setActiveSeries("driver")}
            >
              <span className="reports-series-dot secondary" />
              <span>Driver Net</span>
            </button>

            <button
              type="button"
              className={`reports-chart-filter-btn ${activeSeries === "platform" ? "active" : ""}`}
              onClick={() => setActiveSeries("platform")}
            >
              <span className="reports-series-dot outline" />
              <span>Platform Take (15%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-fidelity Vector Visual Chart Matching Reference Screenshot */}
      <div
        className="reports-chart-viewport"
        style={{
          backgroundColor: "#ffffff",
          padding: "16px 12px 14px",
          position: "relative",
        }}
      >
        <svg
          ref={svgRef}
          className="reports-chart-svg"
          preserveAspectRatio="none"
          viewBox="0 0 620 280"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: "100%", height: "260px", overflow: "visible", cursor: "crosshair" }}
          role="img"
          aria-label="Operational Freight Velocity Chart"
        >
          <defs>
            {/* Soft Cyan Area Gradient Under Line */}
            <linearGradient id="referenceCyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00a8ff" stopOpacity="0.16" />
              <stop offset="85%" stopColor="#00a8ff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#00a8ff" stopOpacity="0.01" />
            </linearGradient>

            <linearGradient id="referenceDriverAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#535d82" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#535d82" stopOpacity="0.01" />
            </linearGradient>

            <linearGradient id="referencePlatformAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#777588" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#777588" stopOpacity="0.01" />
            </linearGradient>

            <filter id="opNodeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={seriesColor} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Horizontal Dashed Gridlines at 500, 400, 300, 200, 100 */}
          {[40, 80, 120, 160, 200].map((yVal) => (
            <line
              key={`grid-${yVal}`}
              x1="55"
              y1={yVal}
              x2="600"
              y2={yVal}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ))}

          {/* Left Y-Axis Values: 500, 400, 300, 200, 100, 0 */}
          {[
            { val: "500", y: 44 },
            { val: "400", y: 84 },
            { val: "300", y: 124 },
            { val: "200", y: 164 },
            { val: "100", y: 204 },
            { val: "0", y: 244 },
          ].map((item) => (
            <text
              key={`label-${item.val}`}
              x="45"
              y={item.y}
              textAnchor="end"
              fill="#64748b"
              fontSize="12"
              fontWeight="500"
              fontFamily="Inter, sans-serif"
            >
              {item.val}
            </text>
          ))}

          {/* Solid Left Y-Axis Line */}
          <line
            x1="55"
            y1="35"
            x2="55"
            y2="240"
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />

          {/* Solid Bottom Baseline at y=240 */}
          <line
            x1="45"
            y1="240"
            x2="605"
            y2="240"
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />

          {/* Bottom X-Axis Ticks & Day Labels (Mon, Tue, Wed, Thu, Fri, Sat, Sun) */}
          {chartCoordinates.map((pt) => (
            <g key={`axis-${pt.item.day}`}>
              {/* Tick Mark */}
              <line
                x1={pt.x}
                y1="240"
                x2={pt.x}
                y2="246"
                stroke="#94a3b8"
                strokeWidth="1.2"
              />
              {/* Day Label */}
              <text
                x={pt.x}
                y="262"
                textAnchor="middle"
                fill="#64748b"
                fontSize="12"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
              >
                {pt.item.day}
              </text>
            </g>
          ))}

          {/* Soft Tint Area Under Line */}
          <path
            d={areaPath}
            fill={
              activeSeries === "driver"
                ? "url(#referenceDriverAreaGrad)"
                : activeSeries === "platform"
                ? "url(#referencePlatformAreaGrad)"
                : "url(#referenceCyanAreaGrad)"
            }
          />

          {/* Connecting Crisp Straight Line (Electric Cyan) */}
          <path
            d={linePath}
            fill="none"
            stroke={seriesColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical Crosshair Line on Hover matching Performance Analytics */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1="35"
              x2={activePoint.x}
              y2="240"
              stroke={seriesColor}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.75"
              pointerEvents="none"
            />
          )}

          {/* 7 Circle Nodes with Outer Halo on Scrub/Hover */}
          {chartCoordinates.map((pt, idx) => {
            const isHovered = activePoint && activePoint.index === idx;

            return (
              <g key={`node-${pt.item.day}`} pointerEvents="none">
                {/* Glowing Outer Halo on Active Point */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="8.5"
                    fill="none"
                    stroke={seriesColor}
                    strokeWidth="2"
                    opacity="0.55"
                    filter="url(#opNodeGlow)"
                  />
                )}

                {/* Circle Node Matching Image */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : pt.item.isPeak ? 5 : 4.5}
                  fill="#ffffff"
                  stroke={pt.item.isPeak ? "#ef4444" : seriesColor}
                  strokeWidth={isHovered ? 3 : 2.5}
                />
                {pt.item.isPeak && !isHovered && (
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill="#ef4444"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    PEAK ({pt.val})
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Interactive Tooltip matching BookingVelocityChart */}
        {activePoint && activeItem && (() => {
          const isNearRight = activePoint.x > 380;
          const isNearLeft = activePoint.x < 140;
          const isNearTop = activePoint.y < 100;

          // Dynamically compute transform so the tooltip is NEVER cut off on top or right edge
          const xTransform = isNearRight ? "-92%" : isNearLeft ? "-8%" : "-50%";
          const yTransform = isNearTop ? "18px" : "-120%";

          return (
            <div
              className="reports-chart-tooltip"
              style={{
                left: `${(activePoint.x / 620) * 100}%`,
                top: `${(activePoint.y / 280) * 100}%`,
                transform: `translate(${xTransform}, ${yTransform})`,
                zIndex: 50,
              }}
            >
              <div className="reports-tooltip-date">{activeItem.fullDay}</div>
              <div className="reports-tooltip-row">
                <span>Gross Invoiced:</span>
                <span className="reports-tooltip-val">{activeItem.invoiced}</span>
              </div>
              <div className="reports-tooltip-row">
                <span>Driver Net Disbursal:</span>
                <span style={{ color: "#a5b4fc", fontWeight: 700 }}>{activeItem.disbursed}</span>
              </div>
              <div className="reports-tooltip-row">
                <span>Platform Take (15%):</span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>{activeItem.platform}</span>
              </div>
              <div className="reports-tooltip-row">
                <span>Completed Trips:</span>
                <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{activePoint.val} Trips</span>
              </div>
              {activeItem.isPeak && (
                <div className="reports-tooltip-peak">
                  ★ Weekly Peak Volume ({activePoint.val} Loads)
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Chart Metadata Footer KPI Strip */}
      <div className="reports-chart-footer-strip" style={{ marginTop: "12px" }}>
        <div className="reports-footer-stat">
          <span className="reports-footer-stat-label">
            {footerMetrics?.avgFreightTicket?.label || "Average Freight Ticket"}
          </span>
          <span className="reports-footer-stat-val">
            {footerMetrics?.avgFreightTicket?.value || "₹28,500"}
          </span>
        </div>

        <div className="reports-footer-stat divider">
          <span className="reports-footer-stat-label">
            {footerMetrics?.peakRevenueDay?.label || "Peak Day Rate"}
          </span>
          <span className="reports-footer-stat-val primary" style={{ color: "#00a8ff" }}>
            {footerMetrics?.peakRevenueDay?.value || "Sun 19 Oct (470 Trips / ₹4.70L)"}
          </span>
        </div>

        <div className="reports-footer-stat">
          <span className="reports-footer-stat-label">
            {footerMetrics?.netRetainedMargin?.label || "Net Retained Margin"}
          </span>
          <span className="reports-footer-stat-val">
            {footerMetrics?.netRetainedMargin?.value || "15.0% Fixed Platform Fee"}
          </span>
        </div>
      </div>
    </div>
  );
}

FreightVelocityChart.propTypes = {
  velocityData: PropTypes.object,
};
