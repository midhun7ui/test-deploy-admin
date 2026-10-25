import PropTypes from "prop-types";

function SupportKPIStats({ stats, activeStatusFilter = "All", onSelectStatusFilter }) {
  const cards = [
    {
      id: "total",
      label: "Total Tickets",
      filterValue: "All",
      value: stats?.total ?? 0,
      sub: "All partner requests",
      type: "total",
      icon: "support_agent",
    },
    {
      id: "open",
      label: "Open / Pending",
      filterValue: "Open",
      value: stats?.open ?? 0,
      sub: "Awaiting ops assignment",
      type: "open",
      icon: "pending_actions",
    },
    {
      id: "in_progress",
      label: "In Progress",
      filterValue: "In Progress",
      value: stats?.in_progress ?? 0,
      sub: "Active operational review",
      type: "progress",
      icon: "sync",
    },
    {
      id: "resolved",
      label: "Resolved & Closed",
      filterValue: "Resolved",
      value: (stats?.resolved ?? 0) + (stats?.closed ?? 0),
      sub: "Successfully fixed",
      type: "resolved",
      icon: "check_circle",
    },
    {
      id: "urgent",
      label: "Urgent Attention",
      filterValue: "Urgent",
      value: stats?.urgent ?? 0,
      sub: "Critical priority issues",
      type: "urgent",
      icon: "priority_high",
    },
  ];

  return (
    <section className="b2b-support-kpi-grid" aria-label="B2B Support KPI Summary">
      {cards.map((card) => {
        const isActive =
          card.filterValue === activeStatusFilter ||
          (card.id === "urgent" && activeStatusFilter === "Urgent");

        return (
          <div
            key={card.id}
            className={`b2b-support-kpi-card type-${card.type} ${isActive ? "active" : ""}`}
            onClick={() => onSelectStatusFilter && onSelectStatusFilter(card.filterValue)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectStatusFilter && onSelectStatusFilter(card.filterValue);
              }
            }}
          >
            <div className="b2b-support-kpi-header">
              <span className="b2b-support-kpi-label">{card.label}</span>
              <span className="b2b-support-kpi-icon material-symbols-outlined">
                {card.icon}
              </span>
            </div>

            <div className="b2b-support-kpi-value">{card.value}</div>
            <div className="b2b-support-kpi-sub">{card.sub}</div>
          </div>
        );
      })}
    </section>
  );
}

SupportKPIStats.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    open: PropTypes.number,
    in_progress: PropTypes.number,
    resolved: PropTypes.number,
    closed: PropTypes.number,
    urgent: PropTypes.number,
  }),
  activeStatusFilter: PropTypes.string,
  onSelectStatusFilter: PropTypes.func,
};

export default SupportKPIStats;
