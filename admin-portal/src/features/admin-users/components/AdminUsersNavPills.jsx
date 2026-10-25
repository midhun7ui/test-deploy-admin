import PropTypes from "prop-types";

export default function AdminUsersNavPills({
  activeTab,
  onTabChange,
  counts = { users: 28, roles: 6, services: 4 },
}) {
  const tabs = [
    { id: "users", label: `Admin Users (${counts.users})`, icon: "badge" },
    { id: "matrix", label: `Roles & Permission Matrix (${counts.roles})`, icon: "view_timeline" },
    { id: "policies", label: "Security & MFA Policies", icon: "security" },
    { id: "services", label: `API & Service Accounts (${counts.services})`, icon: "api" },
  ];

  return (
    <div className="admin-users-tabs-bar" id="admin-users-nav-pills">
      <div className="admin-tabs-pill-group" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`admin-tab-pill-btn ${isActive ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
              id={`tab-btn-${tab.id}`}
            >
              <span className="material-symbols-outlined">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right side policy metadata */}
      <div className="admin-policy-sync-indicator" title="Active directory federated via AWS Cognito & Okta">
        <span className="material-symbols-outlined verified-icon">verified</span>
        <span>Policy Version: <strong>2026.3-Gov</strong></span>
        <span style={{ color: "var(--admin-outline)" }}>•</span>
        <span>Sync: <strong>AWS Cognito Okta Bridge</strong></span>
      </div>
    </div>
  );
}

AdminUsersNavPills.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    users: PropTypes.number,
    roles: PropTypes.number,
    services: PropTypes.number,
  }),
};
