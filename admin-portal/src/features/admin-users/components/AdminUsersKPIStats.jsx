import PropTypes from "prop-types";

export default function AdminUsersKPIStats({ kpis }) {
  return (
    <div className="admin-users-kpi-grid" id="admin-users-kpi-bento">
      {/* Card 1: Total Admins */}
      <div className="admin-kpi-card" id="kpi-total-admins">
        <div>
          <div className="admin-kpi-top-row">
            <div>
              <p className="admin-kpi-label">Total Admin Users</p>
              <div className="admin-kpi-metrics-row">
                <span className="admin-kpi-value">{kpis.totalAdmins.value}</span>
                <span className="admin-kpi-unit">{kpis.totalAdmins.label}</span>
                <span className="admin-kpi-pill success">
                  <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>trending_up</span>
                  {kpis.totalAdmins.trend}
                </span>
              </div>
            </div>
            <div className="admin-kpi-icon-box indigo">
              <span className="material-symbols-outlined">group</span>
            </div>
          </div>
          <div className="admin-kpi-bottom-meta">
            <span className="material-symbols-outlined">apartment</span>
            <span>{kpis.totalAdmins.subtitle}</span>
          </div>
        </div>
        <div className="admin-kpi-progress-bar">
          <div
            className="admin-kpi-progress-fill primary"
            style={{ width: `${kpis.totalAdmins.capacity}%` }}
          />
        </div>
      </div>

      {/* Card 2: System Roles */}
      <div className="admin-kpi-card" id="kpi-system-roles">
        <div>
          <div className="admin-kpi-top-row">
            <div>
              <p className="admin-kpi-label">System Roles Defined</p>
              <div className="admin-kpi-metrics-row">
                <span className="admin-kpi-value">{kpis.systemRoles.value}</span>
                <span className="admin-kpi-unit">{kpis.systemRoles.label}</span>
                <span className="admin-kpi-pill secondary">
                  {kpis.systemRoles.badge}
                </span>
              </div>
            </div>
            <div className="admin-kpi-icon-box secondary">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
          </div>
          <div className="admin-kpi-bottom-meta" title="Super Admin, Ops Mgr, Auditor, Dispatcher +2">
            <span className="material-symbols-outlined">shield_person</span>
            <span className="truncate">{kpis.systemRoles.subtitle}</span>
          </div>
        </div>
        <div className="admin-kpi-progress-bar">
          <div
            className="admin-kpi-progress-fill secondary"
            style={{ width: `${kpis.systemRoles.capacity}%` }}
          />
        </div>
      </div>

      {/* Card 3: Privileged Admins */}
      <div className="admin-kpi-card" id="kpi-privileged-admins">
        <div>
          <div className="admin-kpi-top-row">
            <div>
              <p className="admin-kpi-label">Privileged Admins</p>
              <div className="admin-kpi-metrics-row">
                <span className="admin-kpi-value">{kpis.privilegedAdmins.value}</span>
                <span className="admin-kpi-unit">{kpis.privilegedAdmins.label}</span>
                <span className="admin-kpi-pill purple">
                  {kpis.privilegedAdmins.badge}
                </span>
              </div>
            </div>
            <div className="admin-kpi-icon-box purple">
              <span className="material-symbols-outlined">key</span>
            </div>
          </div>
          <div className="admin-kpi-bottom-meta">
            <span className="material-symbols-outlined">verified_user</span>
            <span>{kpis.privilegedAdmins.subtitle}</span>
          </div>
        </div>
        <div className="admin-kpi-progress-bar">
          <div
            className="admin-kpi-progress-fill purple"
            style={{ width: `${kpis.privilegedAdmins.capacity}%` }}
          />
        </div>
      </div>

      {/* Card 4: MFA Compliance */}
      <div className="admin-kpi-card" id="kpi-mfa-compliance">
        <div>
          <div className="admin-kpi-top-row">
            <div>
              <p className="admin-kpi-label">MFA Compliance</p>
              <div className="admin-kpi-metrics-row">
                <span className="admin-kpi-value">{kpis.mfaCompliance.value}</span>
                <span className="admin-kpi-pill warning">
                  {kpis.mfaCompliance.badge}
                </span>
              </div>
            </div>
            <div className="admin-kpi-icon-box amber">
              <span className="material-symbols-outlined">lock_reset</span>
            </div>
          </div>
          <div className="admin-kpi-bottom-meta">
            <span className="material-symbols-outlined" style={{ color: "#d97706" }}>timer</span>
            <span>{kpis.mfaCompliance.subtitle}</span>
          </div>
        </div>
        <div className="admin-kpi-progress-bar">
          <div
            className="admin-kpi-progress-fill emerald"
            style={{ width: `${kpis.mfaCompliance.capacity}%` }}
          />
        </div>
      </div>
    </div>
  );
}

AdminUsersKPIStats.propTypes = {
  kpis: PropTypes.shape({
    totalAdmins: PropTypes.object.isRequired,
    systemRoles: PropTypes.object.isRequired,
    privilegedAdmins: PropTypes.object.isRequired,
    mfaCompliance: PropTypes.object.isRequired,
  }).isRequired,
};
