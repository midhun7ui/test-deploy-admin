import { useState, useMemo } from "react";
import PropTypes from "prop-types";

export default function FleetCategoryMixDonut({ mixData = {} }) {
  const totalTrips = mixData?.totalTrips ?? 0;
  const categories = useMemo(() => mixData?.categories || [], [mixData?.categories]);
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedId, setPinnedId] = useState(null);

  const activeId = hoveredId || pinnedId;

  // Donut geometry constants - enlarged prominent circle
  const CX = 210;
  const CY = 140;
  const RADIUS = 76;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Compute exact coordinates, slice offsets, and leader lines
  const sliceData = useMemo(() => {
    const items = [];
    let runningPct = 0;

    for (const cat of categories) {
      const startPct = runningPct;
      const endPct = runningPct + cat.pct;
      const midPct = (startPct + endPct) / 2;
      runningPct = endPct;

      const strokeLength = (cat.pct / 100) * CIRCUMFERENCE;
      const strokeOffset = -(startPct / 100) * CIRCUMFERENCE;

      // Clockwise angle starting from 12 o'clock (-90 deg)
      const angleDeg = (midPct / 100) * 360 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);

      // Arc anchor point on outer edge of donut ring (radius + stroke/2 = 76 + 10 = 86)
      const arcX = CX + (RADIUS + 10) * cos;
      const arcY = CY + (RADIUS + 10) * sin;

      // Elbow point radially outward
      const elbowRadius = RADIUS + 28;
      const elbowX = CX + elbowRadius * cos;
      const elbowY = CY + elbowRadius * sin;

      const isRight = cos >= 0;

      // Badge dimensions
      const badgeWidth = 96;
      const badgeHeight = 48;

      // Target horizontal meeting point & badge position
      let clampedBadgeX;
      let meetingX;
      if (isRight) {
        clampedBadgeX = Math.min(414 - badgeWidth, Math.max(CX + RADIUS + 15, elbowX + 16));
        meetingX = clampedBadgeX;
      } else {
        clampedBadgeX = Math.max(6, Math.min(CX - RADIUS - 15 - badgeWidth, elbowX - 16 - badgeWidth));
        meetingX = clampedBadgeX + badgeWidth;
      }

      const clampedBadgeY = Math.max(6, Math.min(274 - badgeHeight, elbowY - badgeHeight / 2));
      const meetingY = clampedBadgeY + badgeHeight / 2;

      const tripsCount = Math.round((totalTrips * cat.pct) / 100);

      // Extract short name e.g. "Heavy (32T/24T)" -> "Heavy 32T"
      const shortName = cat.name.split("/")[0].replace("Commercial", "").trim();

      items.push({
        ...cat,
        strokeLength,
        strokeOffset,
        arcX,
        arcY,
        elbowX,
        elbowY,
        meetingX,
        meetingY,
        isRight,
        clampedBadgeX,
        clampedBadgeY,
        badgeWidth,
        badgeHeight,
        tripsCount,
        shortName,
      });
    }

    return items;
  }, [categories, totalTrips, CIRCUMFERENCE]);

  const activeSlice = useMemo(
    () => sliceData.find((s) => s.id === activeId) || null,
    [sliceData, activeId]
  );

  return (
    <div className="reports-widget-card">
      <div className="reports-widget-header">
        <div>
          <div className="reports-widget-title-row">
            <h3 className="reports-widget-title">Fleet Category Mix</h3>
            <span className="reports-interactive-badge">
              <span className="material-symbols-outlined reports-interactive-icon">
                touch_app
              </span>
              Interactive
            </span>
          </div>
          <p className="reports-widget-subtitle">
            Volume &amp; GMV split by tonnage • Hover or tap slices
          </p>
        </div>
        <span className="material-symbols-outlined reports-widget-icon">
          pie_chart
        </span>
      </div>

      {/* Donut Visual Container */}
      <div className="reports-donut-container">
        <svg
          className="reports-donut-svg"
          viewBox="0 0 420 280"
          role="img"
          aria-label="Fleet category mix interactive donut chart"
        >
          <defs>
            <filter
              id="donut-badge-shadow"
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#0f172a"
                floodOpacity="0.12"
              />
            </filter>
            <filter
              id="donut-slice-glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="3"
                floodColor="#5145f5"
                floodOpacity="0.25"
              />
            </filter>
          </defs>

          {/* Slices group - rotated -90 deg so 0% starts at top (12 o'clock) */}
          <g transform={`rotate(-90 ${CX} ${CY})`}>
            {/* Background base ring */}
            <circle
              cx={CX}
              cy={CY}
              r={RADIUS}
              fill="none"
              stroke="#eef2f6"
              strokeWidth="20"
            />

            {/* Slices */}
            {sliceData.map((cat) => {
              const isSelected = activeId === cat.id;
              const isOtherHovered = activeId && !isSelected;

              return (
                <circle
                  key={cat.id}
                  cx={CX}
                  cy={CY}
                  r={RADIUS}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth={isSelected ? 25 : 20}
                  strokeDasharray={`${cat.strokeLength} ${CIRCUMFERENCE}`}
                  strokeDashoffset={cat.strokeOffset}
                  strokeLinecap="butt"
                  className="reports-donut-slice"
                  style={{
                    opacity: isOtherHovered ? 0.35 : 1,
                    transition:
                      "stroke-width 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease",
                    cursor: "pointer",
                    filter: isSelected ? "url(#donut-slice-glow)" : "none",
                  }}
                  onMouseEnter={() => setHoveredId(cat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() =>
                    setPinnedId((prev) => (prev === cat.id ? null : cat.id))
                  }
                />
              );
            })}
          </g>

          {/* Active Slice Leader Line & Connected Callout Badge (Unrotated space) */}
          {activeSlice && (
            <g
              key={activeSlice.id}
              className="reports-donut-callout-layer"
            >
              {/* Leader Line Path: Arc Anchor -> Elbow -> Badge Edge */}
              <path
                d={`M ${activeSlice.arcX.toFixed(1)} ${activeSlice.arcY.toFixed(1)} L ${activeSlice.elbowX.toFixed(1)} ${activeSlice.meetingY.toFixed(1)} L ${activeSlice.meetingX.toFixed(1)} ${activeSlice.meetingY.toFixed(1)}`}
                fill="none"
                stroke={activeSlice.color}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="reports-donut-leader-line"
              />

              {/* Anchor Glow Ripple on Circle */}
              <circle
                cx={activeSlice.arcX}
                cy={activeSlice.arcY}
                r="7.5"
                fill="none"
                stroke={activeSlice.color}
                strokeWidth="1.5"
                className="reports-donut-anchor-ripple"
              />

              {/* Anchor Dot on Circle Outer Edge */}
              <circle
                cx={activeSlice.arcX}
                cy={activeSlice.arcY}
                r="4"
                fill="#ffffff"
                stroke={activeSlice.color}
                strokeWidth="2.5"
              />

              {/* Terminal Dot at Badge Meeting Point */}
              <circle
                cx={activeSlice.meetingX}
                cy={activeSlice.meetingY}
                r="3"
                fill={activeSlice.color}
              />

              {/* Connected Data Callout Card Badge */}
              <g className="reports-donut-badge-card">
                <rect
                  x={activeSlice.clampedBadgeX}
                  y={activeSlice.clampedBadgeY}
                  width={activeSlice.badgeWidth}
                  height={activeSlice.badgeHeight}
                  rx="7"
                  fill="#ffffff"
                  stroke={activeSlice.color}
                  strokeWidth="1.6"
                  filter="url(#donut-badge-shadow)"
                />

                {/* Accent color strip on card */}
                <rect
                  x={
                    activeSlice.isRight
                      ? activeSlice.clampedBadgeX
                      : activeSlice.clampedBadgeX + activeSlice.badgeWidth - 3.5
                  }
                  y={activeSlice.clampedBadgeY}
                  width="3.5"
                  height={activeSlice.badgeHeight}
                  rx="1.5"
                  fill={activeSlice.color}
                />

                {/* Badge Data Text */}
                <text
                  x={activeSlice.clampedBadgeX + 9}
                  y={activeSlice.clampedBadgeY + 14}
                  fontSize="9.5"
                  fontWeight="700"
                  fill="#475569"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {activeSlice.shortName}
                </text>

                <text
                  x={activeSlice.clampedBadgeX + 9}
                  y={activeSlice.clampedBadgeY + 29}
                  fontSize="13"
                  fontWeight="800"
                  fill={activeSlice.color}
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {activeSlice.pct}%{" "}
                  <tspan
                    fontSize="10"
                    fontWeight="600"
                    fill="#1e293b"
                  >
                    • {activeSlice.gmv}
                  </tspan>
                </text>

                <text
                  x={activeSlice.clampedBadgeX + 9}
                  y={activeSlice.clampedBadgeY + 41}
                  fontSize="8.5"
                  fontWeight="600"
                  fill="#64748b"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {activeSlice.tripsCount.toLocaleString()} Trips
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Center Cutout Dynamic Stats */}
        <div className="reports-donut-center-text">
          <span
            className="reports-donut-center-number"
            style={{
              color: activeSlice ? activeSlice.color : undefined,
            }}
          >
            {activeSlice ? `${activeSlice.pct}%` : (totalTrips || 0).toLocaleString()}
          </span>
          <span className="reports-donut-center-label">
            {activeSlice ? activeSlice.gmv : "Total Trips"}
          </span>
          <span className="reports-donut-center-sub">
            {activeSlice
              ? `${activeSlice.tripsCount} Trips`
              : totalTrips > 0 ? "All 4 Categories" : "0 Active Trips"}
          </span>
        </div>
      </div>

      {/* Donut Legend List */}
      <div className="reports-donut-legend">
        {sliceData.map((cat) => {
          const isSelected = activeId === cat.id;

          return (
            <div
              key={cat.id}
              className={`reports-legend-row ${isSelected ? "active" : ""}`}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() =>
                setPinnedId((prev) => (prev === cat.id ? null : cat.id))
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setPinnedId((prev) => (prev === cat.id ? null : cat.id));
                }
              }}
              aria-label={`Highlight category ${cat.name}`}
            >
              <div className="reports-legend-left">
                <span
                  className="reports-legend-swatch"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="reports-legend-name">{cat.name}</span>
              </div>
              <div className="reports-legend-right">
                <span className="reports-legend-val">{cat.pct}%</span>
                <span className="reports-legend-gmv">({cat.gmv})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

FleetCategoryMixDonut.propTypes = {
  mixData: PropTypes.object,
};
