import PropTypes from "prop-types";

function CompanyKPIStats({ kpis, selectedFilter, onSelectFilter }) {
  const cards = [
    {
      id: "all",
      title: "Total Companies",
      icon: "apartment",
      iconType: "primary",
      number: kpis.total.count,
      tag: kpis.total.subtitle,
      tagType: "muted",
      footnote: kpis.total.footnote,
      hasDot: true,
    },
    {
      id: "active",
      title: "Active Accounts",
      icon: "check_circle",
      iconType: "emerald",
      number: kpis.active.count,
      tag: kpis.active.badge,
      tagType: "emerald",
      footnote: kpis.active.subtitle,
      hasDot: false,
    },
    {
      id: "pending-kyc",
      title: "Pending KYC",
      icon: "pending_actions",
      iconType: "amber",
      number: kpis.pendingKyc.count,
      tag: kpis.pendingKyc.badge,
      tagType: "amber",
      footnote: kpis.pendingKyc.subtitle,
      hasDot: false,
    },
    {
      id: "credit-breach",
      title: "Credit Breaches",
      icon: "warning",
      iconType: "danger",
      number: kpis.creditBreaches.count,
      tag: kpis.creditBreaches.badge,
      tagType: "danger",
      footnote: kpis.creditBreaches.subtitle,
      hasDot: false,
    },
  ];

  return (
    <div className="companies-kpi-grid">
      {cards.map((card) => {
        const isSelected = selectedFilter === card.id;

        return (
          <div
            key={card.id}
            className={`company-kpi-card ${isSelected ? "active-filter" : ""}`}
            onClick={() => onSelectFilter(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectFilter(card.id);
              }
            }}
            id={`kpi-card-${card.id}`}
          >
            <div className="company-kpi-top">
              <span className="company-kpi-title">{card.title}</span>
              <div className={`company-kpi-icon-pod ${card.iconType}`}>
                <span className="material-symbols-outlined text-[18px]">
                  {card.icon}
                </span>
              </div>
            </div>

            <div className="company-kpi-middle">
              <span className="company-kpi-number">{card.number}</span>
              {card.tag && (
                <span className={`company-kpi-tag ${card.tagType}`}>
                  {card.tag}
                </span>
              )}
            </div>

            <div className="company-kpi-bottom">
              {card.hasDot && <span className="dot-indicator"></span>}
              <span>{card.footnote}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

CompanyKPIStats.propTypes = {
  kpis: PropTypes.shape({
    total: PropTypes.shape({
      count: PropTypes.number.isRequired,
      subtitle: PropTypes.string.isRequired,
      footnote: PropTypes.string.isRequired,
    }).isRequired,
    active: PropTypes.shape({
      count: PropTypes.number.isRequired,
      badge: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
    }).isRequired,
    pendingKyc: PropTypes.shape({
      count: PropTypes.number.isRequired,
      badge: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
    }).isRequired,
    creditBreaches: PropTypes.shape({
      count: PropTypes.number.isRequired,
      badge: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  selectedFilter: PropTypes.string.isRequired,
  onSelectFilter: PropTypes.func.isRequired,
};

export default CompanyKPIStats;
