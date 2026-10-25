import PropTypes from "prop-types";

function EnquiryStats({ stats, onStatClick }) {
  if (!stats) return null;

  const cardList = [
    {
      id: "open",
      title: "OPEN ENQUIRIES",
      value: stats.openEnquiries.value,
      badge: stats.openEnquiries.badge,
      badgeType: "blue",
      label: stats.openEnquiries.label,
      icon: stats.openEnquiries.icon || "description",
      iconBg: "icon-bg-blue",
      iconColor: "icon-text-blue",
      isAlert: false,
    },
    {
      id: "followup",
      title: "NEEDS FOLLOW-UP",
      value: stats.needsFollowUp.value,
      badge: stats.needsFollowUp.badge,
      badgeType: "blue",
      label: stats.needsFollowUp.label,
      icon: stats.needsFollowUp.icon || "phone_in_talk",
      iconBg: "icon-bg-blue",
      iconColor: "icon-text-blue",
      isAlert: false,
    },
    {
      id: "qualified",
      title: "QUALIFIED PIPELINE",
      value: stats.qualifiedPipeline.value,
      badge: stats.qualifiedPipeline.badge,
      badgeType: "purple",
      label: stats.qualifiedPipeline.label,
      icon: stats.qualifiedPipeline.icon || "filter_alt",
      iconBg: "icon-bg-purple",
      iconColor: "icon-text-purple",
      isAlert: false,
    },
    {
      id: "unassigned",
      title: "UNASSIGNED OWNER",
      value: stats.unassignedOwner.value,
      badge: stats.unassignedOwner.badge,
      badgeType: "red",
      label: stats.unassignedOwner.label,
      icon: stats.unassignedOwner.icon || "person_alert",
      iconBg: "icon-bg-red",
      iconColor: "icon-text-red",
      isAlert: true,
    },
  ];

  return (
    <section className="enquiry-stats-row" aria-label="Key Enquiry Performance Metrics">
      {cardList.map((card) => (
        <div
          key={card.id}
          className={`enquiry-stat-card ${card.isAlert ? "alert-stat" : ""}`}
          onClick={() => onStatClick?.(card.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onStatClick?.(card.id);
            }
          }}
          title={`Click to filter by ${card.title}`}
        >
          <div className="stat-card-top">
            <span className="stat-card-title">{card.title}</span>
            <div className={`stat-card-icon-bubble ${card.iconBg}`}>
              <span className={`material-symbols-outlined ${card.iconColor}`}>
                {card.icon}
              </span>
            </div>
          </div>

          <div className="stat-card-mid">
            <span className={`stat-main-number ${card.isAlert ? "alert-number" : ""}`}>
              {card.value}
            </span>
            {card.badge && (
              <span className={`stat-pill-badge badge-${card.badgeType}`}>
                {card.badge}
              </span>
            )}
          </div>

          <div className="stat-card-bottom">
            <span className="stat-bottom-label">{card.label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

EnquiryStats.propTypes = {
  stats: PropTypes.shape({
    openEnquiries: PropTypes.object.isRequired,
    needsFollowUp: PropTypes.object.isRequired,
    qualifiedPipeline: PropTypes.object.isRequired,
    unassignedOwner: PropTypes.object.isRequired,
  }),
  onStatClick: PropTypes.func,
};

export default EnquiryStats;
