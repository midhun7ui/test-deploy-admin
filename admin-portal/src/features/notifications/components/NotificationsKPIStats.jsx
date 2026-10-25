import PropTypes from "prop-types";

export default function NotificationsKPIStats({ kpiData, onFilterByKPI }) {
  const { critical, compliance, financial, broadcasts } = kpiData;

  const cards = [
    {
      key: "critical",
      data: critical,
      accentClass: "critical",
      icon: "warning",
      filterTab: "critical",
    },
    {
      key: "compliance",
      data: compliance,
      accentClass: "warning",
      icon: "shield_with_heart",
      filterTab: "compliance",
    },
    {
      key: "financial",
      data: financial,
      accentClass: "financial",
      icon: "account_balance_wallet",
      filterTab: "finance",
    },
    {
      key: "broadcasts",
      data: broadcasts,
      accentClass: "broadcast",
      icon: "campaign",
      filterTab: "all",
    },
  ];

  return (
    <div className="notifications-kpi-grid" id="notifications-kpi-grid">
      {cards.map((c) => (
        <div
          key={c.key}
          className="notifications-kpi-card"
          onClick={() => onFilterByKPI?.(c.filterTab)}
          style={{ cursor: "pointer" }}
          title={`Click to filter: ${c.data.label}`}
        >
          {/* Vertical Color Accent Edge */}
          <div className={`notifications-kpi-accent-bar ${c.accentClass}`} />

          <div>
            <div className="notifications-kpi-top">
              <span className="notifications-kpi-label">{c.data.label}</span>
              <div className={`notifications-kpi-icon-circle ${c.accentClass}`}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "18px",
                    fontVariationSettings: c.key === "critical" || c.key === "compliance" ? "'FILL' 1" : "none",
                  }}
                >
                  {c.icon}
                </span>
              </div>
            </div>

            <div className="notifications-kpi-metric-row">
              <span className={`notifications-kpi-count ${c.accentClass}`}>
                {c.data.formattedCount}
              </span>
              <span className={`notifications-kpi-tag ${c.accentClass}`}>
                {c.data.badge}
              </span>
            </div>

            <p className="notifications-kpi-subtext">{c.data.subtext}</p>
          </div>

          <div className="notifications-kpi-footer-strip">
            <span>{c.data.footerText}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

NotificationsKPIStats.propTypes = {
  kpiData: PropTypes.shape({
    critical: PropTypes.object.isRequired,
    compliance: PropTypes.object.isRequired,
    financial: PropTypes.object.isRequired,
    broadcasts: PropTypes.object.isRequired,
  }).isRequired,
  onFilterByKPI: PropTypes.func,
};
