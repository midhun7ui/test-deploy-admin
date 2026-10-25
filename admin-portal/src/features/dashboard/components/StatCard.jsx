function StatCard({
  id,
  label,
  value,
  change,
  changeType = "positive",
  periodText,
  icon,
  theme = "purple",
  badge,
  description,
  breakdown,
  onClick,
}) {
  return (
    <article
      id={id}
      className={`admin-stat-card theme-${theme} ${onClick ? "interactive" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : "region"}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${label}: ${value}`}
    >
      {/* Top Header: Icon & Top Badge */}
      <div className="stat-card-top">
        <div className={`stat-icon-wrapper bg-${theme}`}>
          <span className="material-symbols-outlined stat-icon">{icon}</span>
        </div>

        {badge && <span className={`stat-top-badge badge-${theme}`}>{badge}</span>}
      </div>

      {/* Main Metric Value & Label */}
      <div className="stat-card-body">
        <span className="stat-metric-label">{label}</span>
        <div className="stat-value-row">
          <span className="stat-metric-number">{value}</span>

          {change && (
            <span className={`stat-trend-chip trend-${changeType}`}>
              {changeType === "positive" && (
                <span className="material-symbols-outlined trend-icon">trending_up</span>
              )}
              {changeType === "alert" && (
                <span className="material-symbols-outlined trend-icon">priority_high</span>
              )}
              {changeType === "warning" && (
                <span className="material-symbols-outlined trend-icon">schedule</span>
              )}
              {changeType === "live" && <span className="stat-live-pulse" />}
              {changeType === "ready" && (
                <span className="material-symbols-outlined trend-icon">check</span>
              )}
              {changeType === "busy" && (
                <span className="material-symbols-outlined trend-icon">navigation</span>
              )}
              <span>{change}</span>
            </span>
          )}
        </div>

        {periodText && <span className="stat-period-text">{periodText}</span>}
      </div>

      {/* Bottom Subtext / Breakdown */}
      <div className="stat-card-footer">
        {description && <p className="stat-card-desc">{description}</p>}
        {breakdown && <span className="stat-breakdown-tag">{breakdown}</span>}
      </div>
    </article>
  );
}

export default StatCard;
