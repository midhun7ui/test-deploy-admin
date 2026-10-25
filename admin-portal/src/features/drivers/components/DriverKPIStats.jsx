import PropTypes from "prop-types";

/**
 * Summary KPI Ribbon (4 Cards in a row with progress indicators)
 * Total Drivers, Active / On Trip, Available, and Pending Verification
 */
export default function DriverKPIStats({ kpis, activeFilter, onFilterSelect }) {
  const cards = [
    {
      id: "all",
      label: "Total Drivers",
      value: kpis.totalDrivers,
      badgeText: kpis.totalBadge,
      badgeClass: "badge-neutral",
      icon: "badge",
      podClass: "pod-primary",
      subtitle: kpis.totalSubtitle,
      barClass: "bar-primary",
      barWidth: "100%",
    },
    {
      id: "active",
      label: "Active / On Trip",
      value: kpis.activeCount,
      badgeText: kpis.activePercentage,
      badgeIcon: "trending_up",
      badgeClass: "badge-emerald",
      icon: "local_shipping",
      podClass: "pod-emerald",
      subtitle: kpis.activeSubtitle,
      barClass: "bar-emerald",
      barWidth: kpis.activePercentage,
    },
    {
      id: "available",
      label: "Available",
      value: kpis.availableCount,
      badgeText: kpis.availablePercentage,
      badgeClass: "badge-blue",
      icon: "check_circle",
      podClass: "pod-blue",
      subtitle: kpis.availableSubtitle,
      barClass: "bar-primary",
      barWidth: kpis.availablePercentage,
    },
    {
      id: "pending",
      label: "Pending Verification",
      value: kpis.pendingKycCount,
      badgeText: kpis.pendingBadge,
      badgeClass: "badge-amber",
      icon: "pending_actions",
      podClass: "pod-amber",
      subtitle: kpis.pendingSubtitle,
      barClass: "bar-amber",
      barWidth: "20%",
    },
  ];

  return (
    <div className="driver-kpi-grid" role="region" aria-label="Driver KPI Metrics">
      {cards.map((card) => {
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            className={`driver-kpi-card ${isSelected ? "selected" : ""}`}
            onClick={() => onFilterSelect?.(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onFilterSelect?.(card.id);
              }
            }}
            title={`Filter by ${card.label}`}
          >
            <div className="driver-kpi-header">
              <span className="driver-kpi-label">{card.label}</span>
              <div className={`driver-kpi-icon-pod ${card.podClass}`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
            </div>

            <div className="driver-kpi-middle">
              <div className="driver-kpi-value-row">
                <span className="driver-kpi-big-number">{card.value}</span>
                <span className={`driver-kpi-badge ${card.badgeClass}`}>
                  {card.badgeIcon && (
                    <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>
                      {card.badgeIcon}
                    </span>
                  )}
                  <span>{card.badgeText}</span>
                </span>
              </div>
              <p className="driver-kpi-subtitle">{card.subtitle}</p>
            </div>

            <div className="driver-kpi-progress-bar-track">
              <div
                className={`driver-kpi-progress-bar-fill ${card.barClass}`}
                style={{ width: card.barWidth }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

DriverKPIStats.propTypes = {
  kpis: PropTypes.shape({
    totalDrivers: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    totalBadge: PropTypes.string,
    totalSubtitle: PropTypes.string,
    activeCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    activePercentage: PropTypes.string,
    activeSubtitle: PropTypes.string,
    availableCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    availablePercentage: PropTypes.string,
    availableSubtitle: PropTypes.string,
    pendingKycCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    pendingBadge: PropTypes.string,
    pendingSubtitle: PropTypes.string,
  }).isRequired,
  activeFilter: PropTypes.string,
  onFilterSelect: PropTypes.func,
};
