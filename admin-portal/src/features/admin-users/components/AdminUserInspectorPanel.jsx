import { useState } from "react";
import PropTypes from "prop-types";

export default function AdminUserInspectorPanel({
  user,
  onSaveAdjustments,
  onReset,
  onSuspendToggle,
  onRevokeSession,
  onSwitchTemplate,
}) {
  const [activeSubTab, setActiveSubTab] = useState("permissions"); // "permissions" | "corridors" | "audit"
  const [localPermissions, setLocalPermissions] = useState(() => user?.permissions || {});
  const [hasChanges, setHasChanges] = useState(false);

  if (!user) {
    return (
      <div className="admin-inspector-pane">
        <div className="admin-inspector-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "var(--admin-outline)" }}>
            account_circle
          </span>
          <p style={{ color: "var(--admin-text-muted)", marginTop: "12px", fontSize: "13px" }}>
            Select an admin staff member from the directory to inspect permissions and security attributes.
          </p>
        </div>
      </div>
    );
  }

  const handleTogglePerm = (moduleKey, permKey) => {
    setLocalPermissions((prev) => {
      const updated = {
        ...prev,
        [moduleKey]: {
          ...prev[moduleKey],
          [permKey]: !prev[moduleKey]?.[permKey],
        },
      };
      setHasChanges(true);
      return updated;
    });
  };

  const handleResetToBaseline = () => {
    if (user.permissions) {
      setLocalPermissions(JSON.parse(JSON.stringify(user.permissions)));
      setHasChanges(false);
      onReset?.(user.id);
    }
  };

  const handleSave = () => {
    onSaveAdjustments?.(user.id, localPermissions);
    setHasChanges(false);
  };

  const isSuspended = user.status === "suspended";

  return (
    <div className="admin-inspector-pane" id="admin-user-inspector-panel">
      <div className="admin-inspector-card">
        {/* Top Header & Identity Card */}
        <div className="admin-inspector-identity-header">
          <div className="admin-inspector-user-info">
            <div className={`admin-inspector-avatar ${user.roleColor || "purple"}`}>
              {user.initials}
            </div>
            <div className="admin-inspector-name-block">
              <div className="admin-inspector-title-row">
                <h3 className="admin-inspector-full-name">{user.name}</h3>
                <span className={`admin-inspector-status-badge ${isSuspended ? "suspended" : "active"}`}>
                  {isSuspended ? "Suspended" : "Active Staff"}
                </span>
              </div>
              <p className="admin-inspector-id-text">
                {user.email} • ID: {user.empId}
              </p>
              <div className="admin-inspector-role-row">
                <span className={`admin-role-badge ${user.roleColor || "purple"}`}>
                  {user.roleName}
                </span>
                <span className="admin-inspector-hub-text">• Assigned: {user.hubScope}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Menu */}
          <div className="admin-inspector-top-actions">
            <button
              type="button"
              className="admin-btn-revoke"
              onClick={() => onRevokeSession(user)}
              title="Force terminate all active browser and API sessions"
              id="btn-revoke-session"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="hidden sm:inline">Revoke Session</span>
            </button>
            <button
              type="button"
              className="admin-action-icon-btn"
              title="More Inspector Actions"
              onClick={() => onSwitchTemplate(user)}
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>

        {/* Inspector Sub-Tabs */}
        <div className="admin-inspector-subtabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === "permissions"}
            className={`admin-inspector-subtab-btn ${activeSubTab === "permissions" ? "active" : ""}`}
            onClick={() => setActiveSubTab("permissions")}
          >
            Assigned Permissions
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === "corridors"}
            className={`admin-inspector-subtab-btn ${activeSubTab === "corridors" ? "active" : ""}`}
            onClick={() => setActiveSubTab("corridors")}
          >
            Hubs &amp; Corridors ({user.corridors?.length || 0})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === "audit"}
            className={`admin-inspector-subtab-btn ${activeSubTab === "audit" ? "active" : ""}`}
            onClick={() => setActiveSubTab("audit")}
          >
            Audit Trail
          </button>
        </div>

        {/* TAB 1: Assigned Permissions */}
        {activeSubTab === "permissions" && (
          <>
            {/* Active Role Template Bar */}
            <div className="admin-role-template-bar">
              <div>
                <span className="admin-template-label">Active Role Template</span>
                <span className="admin-template-name">{user.activeTemplate || "Template: Custom Matrix"}</span>
              </div>
              <button
                type="button"
                className="admin-btn-switch-template"
                onClick={() => onSwitchTemplate(user)}
                title="Change or reassign role template"
              >
                Switch Template
              </button>
            </div>

            {/* Granular Permissions Matrix Modules */}
            <div className="admin-permissions-scroll-container">
              {/* Module 1: B2B Trips & Control Room */}
              <div className="admin-permission-module-box">
                <div className="admin-perm-module-header">
                  <div className="admin-perm-module-title-cluster">
                    <span className="material-symbols-outlined">local_shipping</span>
                    <span className="admin-perm-module-name">B2B Trips &amp; Control Room</span>
                  </div>
                  <span className="admin-perm-module-badge emerald">Full Dispatch</span>
                </div>
                <div className="admin-checkbox-grid">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.trips?.view)}
                      onChange={() => handleTogglePerm("trips", "view")}
                    />
                    <span>View</span>
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.trips?.create)}
                      onChange={() => handleTogglePerm("trips", "create")}
                    />
                    <span>Create</span>
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.trips?.edit)}
                      onChange={() => handleTogglePerm("trips", "edit")}
                    />
                    <span>Edit</span>
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.trips?.dispatch)}
                      onChange={() => handleTogglePerm("trips", "dispatch")}
                    />
                    <span>Dispatch</span>
                  </label>
                  <label
                    className={`admin-checkbox-label ${user.role !== "super_admin" ? "disabled" : ""}`}
                    title={user.role !== "super_admin" ? "Delete capability restricted to Super Admin" : ""}
                  >
                    <input
                      type="checkbox"
                      disabled={user.role !== "super_admin"}
                      checked={Boolean(localPermissions.trips?.delete)}
                      onChange={() => handleTogglePerm("trips", "delete")}
                    />
                    <span>Delete</span>
                  </label>
                </div>
                <div className="admin-perm-scope-note">
                  <span className="material-symbols-outlined">route</span>
                  <span>Scope: Mumbai, Pune, Surat, Nashik corridor sectors</span>
                </div>
              </div>

              {/* Module 2: Orders & Enquiries CRM */}
              <div className="admin-permission-module-box">
                <div className="admin-perm-module-header">
                  <div className="admin-perm-module-title-cluster">
                    <span className="material-symbols-outlined">contact_page</span>
                    <span className="admin-perm-module-name">Orders &amp; Enquiries CRM</span>
                  </div>
                  <span className="admin-perm-module-badge blue">Commercial Lead</span>
                </div>
                <div className="admin-checkbox-grid">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.crm?.view)}
                      onChange={() => handleTogglePerm("crm", "view")}
                    />
                    <span>View</span>
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.crm?.create)}
                      onChange={() => handleTogglePerm("crm", "create")}
                    />
                    <span>Create</span>
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.crm?.edit)}
                      onChange={() => handleTogglePerm("crm", "edit")}
                    />
                    <span>Edit</span>
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.crm?.approveQuotes)}
                      onChange={() => handleTogglePerm("crm", "approveQuotes")}
                    />
                    <span>Approve Quotes</span>
                  </label>
                </div>
              </div>

              {/* Module 3: Driver & Fleet Management */}
              <div className="admin-permission-module-box">
                <div className="admin-perm-module-header">
                  <div className="admin-perm-module-title-cluster">
                    <span className="material-symbols-outlined">sports_motorsports</span>
                    <span className="admin-perm-module-name">Driver &amp; Fleet Management</span>
                  </div>
                  <span className="admin-perm-module-badge amber">Ops Allocated</span>
                </div>
                <div className="admin-checkbox-grid">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.fleet?.view)}
                      onChange={() => handleTogglePerm("fleet", "view")}
                    />
                    <span>View</span>
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.fleet?.onboard)}
                      onChange={() => handleTogglePerm("fleet", "onboard")}
                    />
                    <span>Onboard</span>
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.fleet?.assign)}
                      onChange={() => handleTogglePerm("fleet", "assign")}
                    />
                    <span>Assign</span>
                  </label>
                  <label
                    className={`admin-checkbox-label ${
                      user.role !== "compliance_officer" && user.role !== "super_admin" ? "disabled" : ""
                    }`}
                    title="Blacklisting restricted exclusively to Compliance Officer"
                  >
                    <input
                      type="checkbox"
                      disabled={user.role !== "compliance_officer" && user.role !== "super_admin"}
                      checked={Boolean(localPermissions.fleet?.blacklist)}
                      onChange={() => handleTogglePerm("fleet", "blacklist")}
                    />
                    <span>Blacklist</span>
                  </label>
                </div>
                {user.role !== "compliance_officer" && user.role !== "super_admin" && (
                  <div className="admin-perm-scope-note" style={{ color: "#b45309" }}>
                    <span className="material-symbols-outlined" style={{ color: "#d97706" }}>info</span>
                    <span>Blacklisting restricted exclusively to Compliance Officer</span>
                  </div>
                )}
              </div>

              {/* Module 4: Invoicing & Financial Settlements */}
              <div className="admin-permission-module-box">
                <div className="admin-perm-module-header">
                  <div className="admin-perm-module-title-cluster">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    <span className="admin-perm-module-name">Invoicing &amp; Settlements</span>
                  </div>
                  <span className="admin-perm-module-badge purple">2-Step Verifier</span>
                </div>
                <div className="admin-checkbox-grid">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.finance?.view)}
                      onChange={() => handleTogglePerm("finance", "view")}
                    />
                    <span>View Invoices</span>
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(localPermissions.finance?.draftReview)}
                      onChange={() => handleTogglePerm("finance", "draftReview")}
                    />
                    <span>Draft Review</span>
                  </label>
                  <label
                    className={`admin-checkbox-label ${
                      user.role !== "finance_auditor" && user.role !== "super_admin" ? "disabled" : ""
                    }`}
                    title="Final disbursement requires Level 3 Financial Clearance"
                  >
                    <input
                      type="checkbox"
                      disabled={user.role !== "finance_auditor" && user.role !== "super_admin"}
                      checked={Boolean(localPermissions.finance?.finalDisburse)}
                      onChange={() => handleTogglePerm("finance", "finalDisburse")}
                    />
                    <span>Final Disburse</span>
                  </label>
                </div>
                <div className="admin-perm-limit-box">
                  <span>Secondary Verifier Limit:</span>
                  <strong>{user.permissions?.finance?.secondaryLimit || "≤ ₹15,00,000 / batch"}</strong>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: Hubs & Corridors */}
        {activeSubTab === "corridors" && (
          <div className="admin-permissions-scroll-container">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span className="admin-template-label">Primary Operational Jurisdiction</span>
              <div className="admin-perm-limit-box">
                <span style={{ fontWeight: 600, color: "var(--admin-text)" }}>{user.hubScope}</span>
                <span className="admin-kpi-pill success">Authorized</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              <span className="admin-template-label">Assigned Route Corridors &amp; Geofences</span>
              {user.corridors && user.corridors.length > 0 ? (
                user.corridors.map((corridor, idx) => (
                  <div key={idx} className="admin-perm-module-box" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--admin-primary-container)" }}>
                        alt_route
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--admin-text)" }}>
                        {corridor}
                      </span>
                    </div>
                    <span className="admin-perm-module-badge blue">Active</span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                  No corridor restrictions applied. User has nationwide clearance.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Audit Trail */}
        {activeSubTab === "audit" && (
          <div className="admin-permissions-scroll-container">
            <span className="admin-template-label">Recent Administrative &amp; Security Events</span>
            {user.auditTrail && user.auditTrail.length > 0 ? (
              user.auditTrail.map((item) => (
                <div key={item.id} className="admin-perm-module-box">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--admin-primary-container)" }}>
                      {item.time}
                    </span>
                    <span style={{ fontSize: "10.5px", fontFamily: "monospace", color: "var(--admin-outline)" }}>
                      IP: {item.ip}
                    </span>
                  </div>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--admin-text)", lineHeight: 1.4 }}>
                    {item.event}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                No recorded audit events in the current 24-hour log buffer.
              </p>
            )}
          </div>
        )}

        {/* Staff Security Parameters Box */}
        <div className="admin-inspector-security-box">
          <div className="admin-security-box-header">
            <span className="admin-security-box-title">Staff Security Parameters</span>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#059669" }}>lock</span>
          </div>
          <div className="admin-security-grid">
            <div className="admin-security-card">
              <span className="admin-security-tag-label">Password Rotation</span>
              <span className="admin-security-tag-value">{user.passwordRotation || "Rotated 14 days ago"}</span>
            </div>
            <div className="admin-security-card">
              <span className="admin-security-tag-label">Session Timeout</span>
              <span className="admin-security-tag-value">{user.sessionTimeout || "30 min idle lock"}</span>
            </div>
            <div className="admin-security-card full-width">
              <div>
                <span className="admin-security-tag-label">IP Whitelist / Boundary</span>
                <span className="admin-security-tag-value mono">{user.ipWhitelist || "103.21.54.0/24 (Corporate VPN)"}</span>
              </div>
              <span className="admin-kpi-pill success">Strict</span>
            </div>
          </div>
        </div>

        {/* Inspector Action Footer */}
        <div className="admin-inspector-footer">
          <div className="admin-inspector-primary-actions">
            <button
              type="button"
              className="admin-btn-save"
              onClick={handleSave}
              disabled={!hasChanges}
              style={{ opacity: hasChanges ? 1 : 0.7 }}
              id="btn-save-inspector-adjustments"
            >
              <span className="material-symbols-outlined">save</span>
              <span>Save Adjustments</span>
            </button>
            <button
              type="button"
              className="admin-btn-reset"
              onClick={handleResetToBaseline}
              disabled={!hasChanges}
              id="btn-reset-inspector"
            >
              Reset
            </button>
          </div>

          <button
            type="button"
            className="admin-btn-suspend"
            onClick={() => onSuspendToggle(user)}
            id="btn-suspend-user-toggle"
          >
            <span className="material-symbols-outlined">
              {isSuspended ? "check_circle" : "block"}
            </span>
            <span>{isSuspended ? "Reactivate Account" : "Suspend Account"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

AdminUserInspectorPanel.propTypes = {
  user: PropTypes.object,
  onSaveAdjustments: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onSuspendToggle: PropTypes.func.isRequired,
  onRevokeSession: PropTypes.func.isRequired,
  onSwitchTemplate: PropTypes.func.isRequired,
};
