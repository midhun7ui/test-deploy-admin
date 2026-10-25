import PropTypes from "prop-types";

export default function RolesPermissionMatrixWidget({
  matrixModules,
  roles,
  onAddRoleClick,
  onEditRoleClick,
}) {
  const getBadgeClass = (perms) => {
    if (!perms || perms.includes("none")) return "none";
    if (perms.includes("delete") || perms.includes("disburse") || perms.includes("revoke")) return "auth";
    if (perms.includes("create") || perms.includes("edit") || perms.includes("dispatch")) return "write";
    return "view";
  };

  const formatPermLabel = (perms) => {
    if (!perms || perms.includes("none")) return "No Access";
    if (perms.includes("delete") && perms.includes("dispatch")) return "Full Access";
    if (perms.includes("disburse")) return "Authorize & Disburse";
    if (perms.includes("dispatch")) return "Write & Dispatch";
    if (perms.includes("approve")) return "Create & Approve";
    if (perms.includes("create") || perms.includes("edit")) return "Write & Edit";
    if (perms.includes("export")) return "Read & Export";
    return "View Only";
  };

  return (
    <div className="admin-matrix-view-card" id="roles-permission-matrix-widget">
      {/* Header Row */}
      <div className="admin-matrix-header-row">
        <div>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--admin-text)" }}>
            Roles &amp; Permission Matrix
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--admin-text-muted)" }}>
            Cross-module comparison across 6 operational roles and 14 logistics subsystems.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => onEditRoleClick?.(roles[0])}
            title="Edit permission parameters"
          >
            <span className="material-symbols-outlined">tune</span>
            <span>Configure Roles</span>
          </button>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={onAddRoleClick}
            id="btn-add-custom-role"
          >
            <span className="material-symbols-outlined">add_moderator</span>
            <span>Define Custom Role</span>
          </button>
        </div>
      </div>

      {/* Roles Cards Summary Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
        {roles.map((role) => (
          <div
            key={role.id}
            className="admin-kpi-card"
            style={{ padding: "12px 14px", cursor: "pointer" }}
            onClick={() => onEditRoleClick?.(role)}
            title="Click to edit role definition"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className={`admin-role-badge ${role.badgeColor || "purple"}`}>
                {role.name}
              </span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--admin-text)" }}>
                {role.userCount} Users
              </span>
            </div>
            <p style={{ fontSize: "11px", color: "var(--admin-text-muted)", margin: "6px 0 0 0", lineHeight: 1.3 }}>
              {role.clearance}
            </p>
          </div>
        ))}
      </div>

      {/* Dense Matrix Table */}
      <div className="admin-table-container">
        <table className="admin-matrix-table" id="matrix-comparison-table">
          <thead>
            <tr>
              <th>Subsystem / Module</th>
              <th>Super Admin (4)</th>
              <th>Senior Ops Mgr (7)</th>
              <th>Finance Auditor (5)</th>
              <th>Corridor Dispatcher (8)</th>
              <th>Compliance Officer (4)</th>
              <th>Support Lead (3)</th>
            </tr>
          </thead>
          <tbody>
            {matrixModules.map((mod) => (
              <tr key={mod.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--admin-primary-container)" }}>
                      {mod.icon}
                    </span>
                    <div>
                      <strong style={{ display: "block", color: "var(--admin-text)" }}>{mod.name}</strong>
                      <span style={{ fontSize: "10.5px", color: "var(--admin-outline)", textTransform: "uppercase" }}>
                        {mod.category}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Super Admin */}
                <td>
                  <span className={`admin-perm-tag ${getBadgeClass(mod.super_admin)}`}>
                    {formatPermLabel(mod.super_admin)}
                  </span>
                </td>

                {/* Senior Ops Mgr */}
                <td>
                  <span className={`admin-perm-tag ${getBadgeClass(mod.senior_ops_mgr)}`}>
                    {formatPermLabel(mod.senior_ops_mgr)}
                  </span>
                </td>

                {/* Finance Auditor */}
                <td>
                  <span className={`admin-perm-tag ${getBadgeClass(mod.finance_auditor)}`}>
                    {formatPermLabel(mod.finance_auditor)}
                  </span>
                </td>

                {/* Corridor Dispatcher */}
                <td>
                  <span className={`admin-perm-tag ${getBadgeClass(mod.corridor_dispatcher)}`}>
                    {formatPermLabel(mod.corridor_dispatcher)}
                  </span>
                </td>

                {/* Compliance Officer */}
                <td>
                  <span className={`admin-perm-tag ${getBadgeClass(mod.compliance_officer)}`}>
                    {formatPermLabel(mod.compliance_officer)}
                  </span>
                </td>

                {/* Support Lead */}
                <td>
                  <span className={`admin-perm-tag ${getBadgeClass(mod.support_lead)}`}>
                    {formatPermLabel(mod.support_lead)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

RolesPermissionMatrixWidget.propTypes = {
  matrixModules: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  onAddRoleClick: PropTypes.func.isRequired,
  onEditRoleClick: PropTypes.func.isRequired,
};
