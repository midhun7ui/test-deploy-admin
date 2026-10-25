import { useState } from "react";
import PropTypes from "prop-types";

export default function ManageRoleModal({ isOpen, onClose, role, onSaveRole }) {
  const [roleData, setRoleData] = useState(() => ({
    name: role?.name || "",
    clearance: role?.clearance || "Level 2 (Hub Operations)",
    badgeColor: role?.badgeColor || "indigo",
    description: role?.description || "",
  }));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roleData.name.trim()) return;

    onSaveRole({
      id: role?.id || `role_${Date.now()}`,
      ...roleData,
      userCount: role?.userCount || 0,
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
              admin_panel_settings
            </span>
            <h3 className="admin-modal-title">
              {role ? `Configure Role: ${role.name}` : "Define Custom Role"}
            </h3>
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
            <div className="admin-form-group">
              <label className="admin-form-label">Role Title *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. Regional Freight Controller"
                value={roleData.name}
                onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Security Clearance Level</label>
                <select
                  className="admin-form-select"
                  value={roleData.clearance}
                  onChange={(e) => setRoleData({ ...roleData, clearance: e.target.value })}
                >
                  <option value="Level 1 (Read-Only)">Level 1 (Read-Only)</option>
                  <option value="Level 2 (Hub Operations)">Level 2 (Hub Operations)</option>
                  <option value="Level 3 (Regional Scoped)">Level 3 (Regional Scoped)</option>
                  <option value="Level 4 (Hardware Key)">Level 4 (Hardware Key - Privileged)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Badge Color Accent</label>
                <select
                  className="admin-form-select"
                  value={roleData.badgeColor}
                  onChange={(e) => setRoleData({ ...roleData, badgeColor: e.target.value })}
                >
                  <option value="indigo">Indigo (Executive)</option>
                  <option value="purple">Purple (Ops Management)</option>
                  <option value="blue">Blue (Finance)</option>
                  <option value="amber">Amber (Dispatch)</option>
                  <option value="emerald">Emerald (Compliance)</option>
                  <option value="cyan">Cyan (Support)</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Role Description &amp; Scope Summary</label>
              <textarea
                className="admin-form-textarea"
                placeholder="Summarize modules and operational jurisdiction granted by this template..."
                value={roleData.description}
                onChange={(e) => setRoleData({ ...roleData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary" id="btn-save-role-definition">
              <span className="material-symbols-outlined">save</span>
              <span>Save Role Template</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ManageRoleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  role: PropTypes.object,
  onSaveRole: PropTypes.func.isRequired,
};
