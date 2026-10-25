import { useState, useMemo, useRef } from "react";
import PropTypes from "prop-types";

export default function BookingVelocityChart({ dailyData, footerMetrics }) {
  const [selectedRange, setSelectedRange] = useState("all"); // 'all' | 'w1' | 'w2' | 'w3' | 'w4'
  const [activeSeries, setActiveSeries] = useState({
    confirmed: true,
    fulfilled: true,
    capacity: true,
  });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const svgRef = useRef(null);

  // Filter dataset by range
  const visibleData = useMemo(() => {
    if (!dailyData || dailyData.length === 0) return [];
    if (selectedRange === "all") return dailyData;
    return dailyData.filter((d) => d.weekId === selectedRange);
  }, [dailyData, selectedRange]);

  // Coordinate geometry
  const VIEW_WIDTH = 680;
  const VIEW_HEIGHT = 220;
  const MARGIN_LEFT = 42;
  const MARGIN_RIGHT = 24;
  const MARGIN_TOP = 25;
  const MARGIN_BOTTOM = 35;

  const plotWidth = VIEW_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  const plotHeight = VIEW_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

  // Dynamic Y-axis ceiling based on visible data
  const maxY = useMemo(() => {
    if (!visibleData || visibleData.length === 0) return 10;
    const peak = Math.max(
      ...visibleData.map((d) => Math.max(d.confirmed || 0, d.fulfilled || 0, d.capacity || 0)),
      0
    );
    if (peak <= 5) return 8;
    if (peak <= 10) return 15;
    if (peak <= 25) return 30;
    if (peak <= 50) return 60;
    return Math.ceil((peak * 1.25) / 10) * 10;
  }, [visibleData]);

  const yGridValues = useMemo(() => {
    return [0, 0.25, 0.5, 0.75, 1].map((pct) => Math.round(maxY * pct));
  }, [maxY]);

  // Compute point coordinates
  const points = useMemo(() => {
    const totalPoints = visibleData.length;
    return visibleData.map((d, i) => {
      const x =
        totalPoints <= 1
          ? MARGIN_LEFT + plotWidth / 2
          : MARGIN_LEFT + (i / (totalPoints - 1)) * plotWidth;

      const yConfirmed = MARGIN_TOP + plotHeight - ((d.confirmed || 0) / maxY) * plotHeight;
      const yFulfilled = MARGIN_TOP + plotHeight - ((d.fulfilled || 0) / maxY) * plotHeight;
      const yCapacity = MARGIN_TOP + plotHeight - ((d.capacity || 0) / maxY) * plotHeight;

      return {
        ...d,
        index: i,
        x,
        yConfirmed,
        yFulfilled,
        yCapacity,
      };
    });
  }, [visibleData, plotWidth, plotHeight, maxY]);

  // SVG Paths
  const confirmedPath = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce(
      (acc, pt, i) => (i === 0 ? `M ${pt.x.toFixed(1)} ${pt.yConfirmed.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.yConfirmed.toFixed(1)}`),
      ""
    );
  }, [points]);

  const confirmedAreaPath = useMemo(() => {
    if (points.length === 0) return "";
    const firstX = points[0].x.toFixed(1);
    const lastX = points[points.length - 1].x.toFixed(1);
    const bottomY = (MARGIN_TOP + plotHeight).toFixed(1);
    return `${confirmedPath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [confirmedPath, points, plotHeight]);

  const fulfilledPath = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce(
      (acc, pt, i) => (i === 0 ? `M ${pt.x.toFixed(1)} ${pt.yFulfilled.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.yFulfilled.toFixed(1)}`),
      ""
    );
  }, [points]);

  const capacityPath = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce(
      (acc, pt, i) => (i === 0 ? `M ${pt.x.toFixed(1)} ${pt.yCapacity.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.yCapacity.toFixed(1)}`),
      ""
    );
  }, [points]);

  // Mouse move handler for scrubbing
  const handleMouseMove = (e) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * VIEW_WIDTH;

    // Find closest point by X coordinate
    let closestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < points.length; i++) {
      const diff = Math.abs(points[i].x - svgX);
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

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <div className="analytics-widget-card" id="widget-velocity">
      <div className="analytics-widget-header">
        <div>
          <h3 className="analytics-widget-title">Client Booking Velocity &amp; Fulfillment Pacing</h3>
          <p className="analytics-widget-subtitle">
            Daily booking load demand against dispatch capacity across Oct 2026
          </p>
        </div>

        <div className="analytics-chart-controls">
          {/* Series Toggles */}
          <button
            type="button"
            className={`analytics-series-btn ${activeSeries.confirmed ? "active" : ""}`}
            onClick={() => setActiveSeries((prev) => ({ ...prev, confirmed: !prev.confirmed }))}
            aria-label="Toggle Confirmed Bookings Series"
          >
            <span className="analytics-series-dot" style={{ backgroundColor: "#00a8ff" }} />
            <span>Confirmed Loads</span>
          </button>

          <button
            type="button"
            className={`analytics-series-btn ${activeSeries.fulfilled ? "active" : ""}`}
            onClick={() => setActiveSeries((prev) => ({ ...prev, fulfilled: !prev.fulfilled }))}
            aria-label="Toggle Fulfilled Series"
          >
            <span className="analytics-series-dot" style={{ backgroundColor: "#5145f5" }} />
            <span>Dispatched</span>
          </button>

          <button
            type="button"
            className={`analytics-series-btn ${activeSeries.capacity ? "active" : ""}`}
            onClick={() => setActiveSeries((prev) => ({ ...prev, capacity: !prev.capacity }))}
            aria-label="Toggle Capacity Ceiling Series"
          >
            <span className="analytics-series-dot" style={{ backgroundColor: "#94a3b8" }} />
            <span>Ceiling (Max)</span>
          </button>

          {/* Time range switcher */}
          <div className="analytics-time-pills">
            {[
              { id: "all", label: "All 31D" },
              { id: "w1", label: "W1" },
              { id: "w2", label: "W2" },
              { id: "w3", label: "W3 (Surge)" },
              { id: "w4", label: "W4" },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                className={`analytics-time-pill ${selectedRange === btn.id ? "active" : ""}`}
                onClick={() => setSelectedRange(btn.id)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="analytics-svg-container">
        <svg
          ref={svgRef}
          className="analytics-svg-chart"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="img"
          aria-label="Client booking velocity interactive chart"
        >
          <defs>
            <linearGradient id="anCyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00a8ff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#00a8ff" stopOpacity="0.0" />
            </linearGradient>

            <filter id="anNodeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#00a8ff" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Gridlines & Y-Axis Labels */}
          {yGridValues.map((val) => {
            const y = MARGIN_TOP + plotHeight - (val / maxY) * plotHeight;
            return (
              <g key={val}>
                <line
                  x1={MARGIN_LEFT}
                  y1={y}
                  x2={VIEW_WIDTH - MARGIN_RIGHT}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? "none" : "3 3"}
                  opacity="0.8"
                />
                <text
                  x={MARGIN_LEFT - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="9.5"
                  fill="#94a3b8"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Target Capacity Ceiling Line */}
          {activeSeries.capacity && (
            <path
              d={capacityPath}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.6"
              strokeDasharray="4 3"
              opacity="0.8"
            />
          )}

          {/* Area Under Confirmed Series */}
          {activeSeries.confirmed && (
            <path d={confirmedAreaPath} fill="url(#anCyanAreaGrad)" />
          )}

          {/* Secondary Fulfilled Series */}
          {activeSeries.fulfilled && (
            <path
              d={fulfilledPath}
              fill="none"
              stroke="#5145f5"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
          )}

          {/* Primary Confirmed Loads Series */}
          {activeSeries.confirmed && (
            <path
              d={confirmedPath}
              fill="none"
              stroke="#00a8ff"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Nodes */}
          {activeSeries.confirmed &&
            points.map((pt, i) => {
              const isSurgePeak = pt.isPeak;
              const isWeekMarker = selectedRange === "all" && (i === 0 || i === 7 || i === 14 || i === 21 || i === 30);
              const isHovered = activePoint && activePoint.index === i;

              // Render nodes if hovered, or peak, or week marker, or in weekly view
              if (!isHovered && !isSurgePeak && !isWeekMarker && selectedRange === "all") {
                return null;
              }

              return (
                <g key={i}>
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.yConfirmed}
                      r="8"
                      fill="none"
                      stroke="#00a8ff"
                      strokeWidth="2"
                      opacity="0.5"
                      filter="url(#anNodeGlow)"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.yConfirmed}
                    r={isHovered ? 5.5 : isSurgePeak ? 5 : 4}
                    fill="#ffffff"
                    stroke={isSurgePeak ? "#ef4444" : "#00a8ff"}
                    strokeWidth={isHovered ? 3 : 2.5}
                  />
                  {isSurgePeak && !isHovered && (
                    <text
                      x={pt.x}
                      y={pt.yConfirmed - 9}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="800"
                      fill="#ef4444"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {pt.confirmed > 0 ? `PEAK (${pt.confirmed})` : ""}
                    </text>
                  )}
                </g>
              );
            })}

          {/* Vertical Crosshair Line on Hover */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={MARGIN_TOP}
              x2={activePoint.x}
              y2={MARGIN_TOP + plotHeight}
              stroke="#00a8ff"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.75"
            />
          )}

          {/* X-Axis Date Labels */}
          {points.map((pt, i) => {
            const showLabel =
              selectedRange !== "all" ||
              i === 0 ||
              i === 7 ||
              i === 14 ||
              i === 21 ||
              i === 30;

            if (!showLabel) return null;

            return (
              <text
                key={i}
                x={pt.x}
                y={MARGIN_TOP + plotHeight + 18}
                textAnchor="middle"
                fontSize="9.5"
                fill="#64748b"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {selectedRange !== "all" ? pt.dateStr.split(" ")[0] : `${pt.day} Oct`}
              </text>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint && (
          <div
            className="analytics-chart-tooltip"
            style={{
              left: `${(activePoint.x / VIEW_WIDTH) * 100}%`,
              top: `${(activePoint.yConfirmed / VIEW_HEIGHT) * 100}%`,
            }}
          >
            <div className="analytics-tooltip-date">{activePoint.dateStr}</div>
            <div className="analytics-tooltip-row">
              <span>Confirmed Loads:</span>
              <span className="analytics-tooltip-val">{activePoint.confirmed} Loads</span>
            </div>
            <div className="analytics-tooltip-row">
              <span>Dispatched:</span>
              <span style={{ color: "#a5b4fc", fontWeight: 700 }}>{activePoint.fulfilled} Loads</span>
            </div>
            <div className="analytics-tooltip-row">
              <span>Capacity Ceiling:</span>
              <span style={{ color: "#94a3b8", fontWeight: 600 }}>{activePoint.capacity} Loads</span>
            </div>
            <div className="analytics-tooltip-row">
              <span>Gross Value:</span>
              <span style={{ color: "#34d399", fontWeight: 700 }}>{activePoint.gmv}</span>
            </div>
            <div className="analytics-tooltip-row">
              <span>Dispatch Latency:</span>
              <span style={{ color: "#e2e8f0" }}>{activePoint.dispatchLatency}</span>
            </div>
            {activePoint.isPeak && (
              <div
                style={{
                  marginTop: "4px",
                  paddingTop: "4px",
                  borderTop: "1px solid #334155",
                  color: "#f87171",
                  fontWeight: 700,
                  fontSize: "10px",
                }}
              >
                ★ {activePoint.surgeTag}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart Footer KPI Strip */}
      <div className="analytics-chart-footer-strip">
        <div className="analytics-strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "var(--an-primary-container)" }}>
            speed
          </span>
          <span className="analytics-strip-label">Peak Velocity:</span>
          <span className="analytics-strip-val">
            {footerMetrics?.peakVelocity || "2 loads/day (Fri 23 Oct)"}
          </span>
        </div>

        <div className="analytics-strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "var(--an-green)" }}>
            check_circle
          </span>
          <span className="analytics-strip-label">Fulfillment SLA:</span>
          <span className="analytics-strip-val">
            {footerMetrics?.fulfillmentSla || "100.0% (31-Day Avg)"}
          </span>
        </div>

        <div className="analytics-strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "var(--an-cyan)" }}>
            timer
          </span>
          <span className="analytics-strip-label">Dispatch Latency:</span>
          <span className="analytics-strip-val">
            {footerMetrics?.dispatchLatency || "2.0 mins"}
          </span>
        </div>
      </div>
    </div>
  );
}

BookingVelocityChart.propTypes = {
  dailyData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number.isRequired,
      dateStr: PropTypes.string.isRequired,
      weekId: PropTypes.string.isRequired,
      confirmed: PropTypes.number.isRequired,
      fulfilled: PropTypes.number.isRequired,
      capacity: PropTypes.number.isRequired,
      gmv: PropTypes.string.isRequired,
      dispatchLatency: PropTypes.string.isRequired,
      isPeak: PropTypes.bool.isRequired,
      surgeTag: PropTypes.string,
    })
  ).isRequired,
  footerMetrics: PropTypes.shape({
    peakVelocity: PropTypes.string,
    fulfillmentSla: PropTypes.string,
    dispatchLatency: PropTypes.string,
  }),
};
