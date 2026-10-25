import { useState } from "react";
import PropTypes from "prop-types";

export default function EditUserModal({ isOpen, onClose, user, onUpdateSubmit, roles }) {
  const [formData, setFormData] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "senior_ops_mgr",
    hubScope: user?.hubScope || "West Hub (Mumbai/Pune)",
    status: user?.status || "active",
  }));

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedRoleObj = roles.find((r) => r.id === formData.role);

    onUpdateSubmit(user.id, {
      ...formData,
      roleName: selectedRoleObj?.name || user.roleName,
      roleColor: selectedRoleObj?.badgeColor || user.roleColor,
      activeTemplate: `Template: ${selectedRoleObj?.name || user.roleName} v2.5`,
    });

    onClose();
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--admin-primary-container)" }}>
              manage_accounts
            </span>
            <h3 className="admin-modal-title">Edit Staff Permissions &amp; Scope</h3>
          </div>
          <button
            type="button"
            className="admin-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "var(--admin-surface-low)", borderRadius: "var(--admin-radius-md)" }}>
              <div className={`admin-avatar-circle ${user.roleColor || "purple"}`}>
                {user.initials}
              </div>
              <div>
                <strong style={{ fontSize: "13px", color: "var(--admin-text)" }}>{user.name}</strong>
                <span style={{ fontSize: "11px", color: "var(--admin-outline)", display: "block" }}>
                  {user.email} • {user.empId}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Full Name</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Contact Number</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Assigned Role Template</label>
                <select
                  className="admin-form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Account Status</label>
                <select
                  className="admin-form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active Staff</option>
                  <option value="suspended">Suspended / On Leave</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Primary Operational Jurisdiction</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.hubScope}
                onChange={(e) => setFormData({ ...formData, hubScope: e.target.value })}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary" id="btn-submit-update-user">
              <span className="material-symbols-outlined">save</span>
              <span>Update Profile &amp; Role</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  onUpdateSubmit: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
};
