import PropTypes from "prop-types";

export default function SettingsKPIStats({ kpiData }) {
  return (
    <div className="settings-kpi-grid">
      {kpiData.map((kpi) => (
        <div key={kpi.id} className="settings-kpi-card">
          <div className="settings-kpi-top">
            <span className="settings-kpi-label">{kpi.label}</span>
            <div className={`settings-kpi-icon-pod ${kpi.badgeType || ""}`}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                {kpi.icon}
              </span>
            </div>
          </div>

          <div>
            <div className="settings-kpi-value-row">
              <span className="settings-kpi-value">{kpi.value}</span>
              <span className={`settings-kpi-badge ${kpi.badgeType || ""}`}>
                {kpi.badge}
              </span>
            </div>
            <p className="settings-kpi-subtitle" title={kpi.subtitle}>
              {kpi.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

SettingsKPIStats.propTypes = {
  kpiData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      badge: PropTypes.string.isRequired,
      badgeType: PropTypes.string,
      subtitle: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
};
