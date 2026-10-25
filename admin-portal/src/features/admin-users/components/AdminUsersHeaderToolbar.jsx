import PropTypes from "prop-types";

export default function AdminUsersHeaderToolbar({
  selectedRoleFilter,
  onRoleFilterChange,
  onExportClick,
  onInviteClick,
  mfaComplianceRate = "96%",
}) {
  return (
    <div className="admin-users-header-card" id="admin-users-header">
      {/* Title Cluster */}
      <div className="admin-users-title-cluster">
        <div className="admin-users-title-row">
          <h1 className="admin-users-page-title">Admin Users &amp; Access Control</h1>
          <span className="admin-users-category-tag">
            Enterprise RBAC &amp; Governance
          </span>
        </div>
        <p className="admin-users-subtitle">
          Configure role-based access control (RBAC), multi-factor authentication policies,
          administrative staff permissions, and departmental role templates across logistics operations.
        </p>
      </div>

      {/* Quick Toolbars & CTAs */}
      <div className="admin-users-toolbar-actions">
        {/* MFA Compliance Status Pill */}
        <div className="admin-mfa-compliance-pill" title="Hardware key and TOTP enforcement across active staff">
          <span className="admin-pulse-dot" />
          <span>MFA Policy Enforced ({mfaComplianceRate} Compliant)</span>
        </div>

        {/* Role Quick Filter */}
        <div className="admin-role-select-wrapper">
          <select
            className="admin-role-select"
            value={selectedRoleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            id="role-filter-dropdown"
            aria-label="Filter by admin role"
          >
            <option value="all">All Roles (6 Active)</option>
            <option value="super_admin">Super Admin (4)</option>
            <option value="senior_ops_mgr">Senior Ops Manager (7)</option>
            <option value="finance_auditor">Finance Auditor (5)</option>
            <option value="corridor_dispatcher">Corridor Dispatcher (8)</option>
            <option value="compliance_officer">Compliance Officer (4)</option>
            <option value="support_lead">Support Lead (3)</option>
          </select>
          <span className="material-symbols-outlined admin-select-chevron">expand_more</span>
        </div>

        {/* Export Access Log Button */}
        <button
          type="button"
          className="admin-btn-secondary"
          id="btn-export-access-log"
          onClick={onExportClick}
          title="Export audit access logs in CSV, JSON or PDF"
        >
          <span className="material-symbols-outlined">file_download</span>
          <span>Export Access Log</span>
        </button>

        {/* Invite Admin User Primary CTA */}
        <button
          type="button"
          className="admin-btn-primary"
          id="btn-invite-admin-user"
          onClick={onInviteClick}
          title="Invite new administrator or hub staff"
        >
          <span className="material-symbols-outlined">person_add</span>
          <span>Invite Admin User</span>
        </button>
      </div>
    </div>
  );
}

AdminUsersHeaderToolbar.propTypes = {
  selectedRoleFilter: PropTypes.string.isRequired,
  onRoleFilterChange: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
  onInviteClick: PropTypes.func.isRequired,
  mfaComplianceRate: PropTypes.string,
};
