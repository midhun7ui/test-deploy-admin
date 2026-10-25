import PropTypes from "prop-types";

export default function AdminUsersTable({
  users,
  selectedUserId,
  onSelectUser,
  selectedUserIds = [],
  onToggleSelectUser,
  onToggleSelectAll,
  onEditUserPermissions,
  onOptionsClick,
  currentPage = 1,
  totalPages = 6,
  onPageChange,
  totalCount = 28,
}) {
  const isAllSelected =
    users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  return (
    <div className="admin-staff-directory-pane">
      <div className="admin-directory-card">
        {/* Table Container */}
        <div className="admin-table-container">
          <table className="admin-users-table" id="admin-staff-table">
            <thead>
              <tr>
                <th style={{ width: "32px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => onToggleSelectAll(e.target.checked)}
                    aria-label="Select all staff members"
                    id="checkbox-select-all-staff"
                  />
                </th>
                <th>User / Employee</th>
                <th>Role &amp; Scope</th>
                <th>2FA Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: "right", paddingRight: "16px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "32px 16px", color: "var(--admin-text-muted)" }}>
                    No administrative staff found matching the selected filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isRowSelected = selectedUserId === user.id;
                  const isChecked = selectedUserIds.includes(user.id);

                  return (
                    <tr
                      key={user.id}
                      className={isRowSelected ? "selected-row" : ""}
                      onClick={() => onSelectUser(user)}
                      id={`staff-row-${user.id}`}
                    >
                      {/* Checkbox */}
                      <td
                        style={{ textAlign: "center" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleSelectUser(user.id)}
                          aria-label={`Select ${user.name}`}
                        />
                      </td>

                      {/* User / Employee */}
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-avatar-cluster">
                            <div className={`admin-avatar-circle ${user.roleColor || "purple"}`}>
                              {user.initials}
                            </div>
                            <span
                              className={`admin-online-indicator ${
                                user.twoFactorStatus === "pending"
                                  ? "pending"
                                  : user.isOnline
                                  ? "online"
                                  : "idle"
                              }`}
                              title={user.isOnline ? "Active Now" : "Offline"}
                            />
                          </div>

                          <div className="admin-user-meta-stack">
                            <div className="admin-user-name-row">
                              <span className="admin-user-name">{user.name}</span>
                              {isRowSelected && (
                                <span className="admin-user-selected-pill">SELECTED</span>
                              )}
                            </div>
                            <span className="admin-user-email">{user.email}</span>
                            <span className="admin-user-emp-id">{user.empId}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role & Scope */}
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div>
                            <span className={`admin-role-badge ${user.roleColor || "purple"}`}>
                              {user.roleName}
                            </span>
                          </div>
                          <span className="admin-scope-hub-text">{user.hubScope}</span>
                          <span className="admin-scope-summary-text" title={user.scopeSummary}>
                            {user.scopeSummary}
                          </span>
                        </div>
                      </td>

                      {/* 2FA Status */}
                      <td>
                        <div className="admin-mfa-status-cell">
                          <span
                            className={`material-symbols-outlined ${
                              user.twoFactorStatus === "pending"
                                ? "warning"
                                : user.role === "super_admin"
                                ? "purple"
                                : "verified"
                            }`}
                          >
                            {user.twoFactorIcon}
                          </span>
                          <div>
                            {user.twoFactorStatus === "pending" ? (
                              <>
                                <span className="admin-mfa-title" style={{ color: "#d97706" }}>
                                  Pending Setup
                                </span>
                                <span className="admin-mfa-sub" style={{ color: "#b45309", fontWeight: 600 }}>
                                  Grace: {user.twoFactorGrace}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="admin-mfa-title">Enforced</span>
                                <span className="admin-mfa-sub">{user.twoFactorMethod}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td>
                        {user.isOnline ? (
                          <div className="admin-active-status-ping">
                            <span className="ping-dot" />
                            <span className="ping-text">Active Now</span>
                          </div>
                        ) : (
                          <span className="admin-inactive-time">{user.lastActive}</span>
                        )}
                        <span className="admin-ip-tag">
                          {user.lastActiveIp ? `IP: ${user.lastActiveIp}` : user.location}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right", paddingRight: "14px" }}>
                        <div
                          className="admin-actions-cell"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="admin-action-icon-btn primary-highlight"
                            title="Tune Permissions"
                            onClick={() => onEditUserPermissions(user)}
                            id={`btn-edit-perm-${user.id}`}
                          >
                            <span className="material-symbols-outlined">tune</span>
                          </button>
                          <button
                            type="button"
                            className="admin-action-icon-btn"
                            title="User Options"
                            onClick={(e) => onOptionsClick(user, e)}
                            id={`btn-opts-${user.id}`}
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="admin-pagination-bar">
          <span className="admin-pagination-info">
            Showing <strong>1 - {users.length}</strong> of <strong>{totalCount}</strong> admin staff
          </span>

          <div className="admin-pagination-pages">
            <button
              type="button"
              className="admin-page-btn"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              title="Previous Page"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_left</span>
            </button>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`admin-page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}

            {totalPages > 3 && (
              <>
                <span style={{ padding: "0 4px", color: "var(--admin-outline)", fontSize: "12px" }}>...</span>
                <button
                  type="button"
                  className={`admin-page-btn ${currentPage === totalPages ? "active" : ""}`}
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              className="admin-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              title="Next Page"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Guardrail Advisory Notice */}
      <div className="admin-consensus-advisory-card">
        <span className="material-symbols-outlined admin-advisory-icon">policy</span>
        <div>
          <h4 className="admin-advisory-title">Enterprise RBAC Consensus Guardrail</h4>
          <p className="admin-advisory-body">
            Any role privilege escalation, finance disbursement threshold modification, or deletion permission
            triggers a <strong>dual-admin consensus requirement</strong> and logs an immutable audit event directly
            to AWS CloudTrail &amp; HireD SIEM archives.
          </p>
        </div>
      </div>
    </div>
  );
}

AdminUsersTable.propTypes = {
  users: PropTypes.array.isRequired,
  selectedUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectUser: PropTypes.func.isRequired,
  selectedUserIds: PropTypes.array,
  onToggleSelectUser: PropTypes.func.isRequired,
  onToggleSelectAll: PropTypes.func.isRequired,
  onEditUserPermissions: PropTypes.func.isRequired,
  onOptionsClick: PropTypes.func.isRequired,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  totalCount: PropTypes.number,
};
