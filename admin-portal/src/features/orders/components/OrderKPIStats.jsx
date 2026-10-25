import PropTypes from "prop-types";

/**
 * Summary KPI Cards Ribbon (4 cards matching Stitch UI reference)
 * Displays Total Orders, Pending Review, Accepted, and Rejected / Cancelled
 */
export default function OrderKPIStats({ stats, activeFilter, onFilterSelect }) {
  const cards = [
    {
      id: "all",
      label: "Total Orders",
      value: stats.totalOrders,
      badgeText: stats.totalOrdersTrending,
      badgeIcon: "trending_up",
      badgeClass: "badge-trending-up",
      icon: "local_shipping",
      podClass: "pod-blue",
      dotClass: "dot-blue",
      footerText: stats.totalOrdersSubtitle,
    },
    {
      id: "pending",
      label: "Pending Review",
      value: stats.pendingReview,
      badgeText: stats.pendingActionBadge,
      badgeIcon: null,
      badgeClass: "badge-requires-action",
      icon: "hourglass_top",
      podClass: "pod-amber",
      dotClass: "dot-amber",
      footerText: stats.pendingSubtitle,
    },
    {
      id: "accepted",
      label: "Accepted",
      value: stats.acceptedOrders,
      badgeText: stats.acceptedBadge,
      badgeIcon: null,
      badgeClass: "badge-active-status",
      icon: "check_circle",
      podClass: "pod-teal",
      dotClass: "dot-teal",
      footerText: stats.acceptedSubtitle,
    },
    {
      id: "rejected",
      label: "Rejected / Cancelled",
      value: stats.rejectedOrders,
      badgeText: stats.rejectedRateBadge,
      badgeIcon: null,
      badgeClass: "badge-rejected-rate",
      icon: "cancel",
      podClass: "pod-red",
      dotClass: "dot-red",
      footerText: stats.rejectedSubtitle,
    },
  ];

  return (
    <div className="orders-kpi-grid" id="orders-kpi-ribbon" role="region" aria-label="Orders KPI Summary">
      {cards.map((card) => {
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            className={`order-kpi-card ${isSelected ? "selected" : ""}`}
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
            <div className="order-kpi-header">
              <span className="order-kpi-label">{card.label}</span>
              <div className={`order-kpi-icon-pod ${card.podClass}`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
            </div>

            <div className="order-kpi-value-row">
              <span className="order-kpi-big-number">{card.value}</span>
              <span className={`order-kpi-badge ${card.badgeClass}`}>
                {card.badgeIcon && (
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                    {card.badgeIcon}
                  </span>
                )}
                <span>{card.badgeText}</span>
              </span>
            </div>

            <div className="order-kpi-footer-row">
              <span className={`order-kpi-dot ${card.dotClass}`} />
              <span>{card.footerText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

OrderKPIStats.propTypes = {
  stats: PropTypes.shape({
    totalOrders: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    totalOrdersTrending: PropTypes.string,
    totalOrdersSubtitle: PropTypes.string,
    pendingReview: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    pendingActionBadge: PropTypes.string,
    pendingSubtitle: PropTypes.string,
    acceptedOrders: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    acceptedBadge: PropTypes.string,
    acceptedSubtitle: PropTypes.string,
    rejectedOrders: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    rejectedRateBadge: PropTypes.string,
    rejectedSubtitle: PropTypes.string,
  }).isRequired,
  activeFilter: PropTypes.string,
  onFilterSelect: PropTypes.func,
};
