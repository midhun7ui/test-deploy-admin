import { useState } from "react";
import PropTypes from "prop-types";

export default function InviteUserModal({ isOpen, onClose, onInviteSubmit, roles }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    empId: "",
    phone: "",
    role: "senior_ops_mgr",
    hubScope: "West Hub (Mumbai/Pune)",
    hubCategory: "west",
    mfaGrace: "24h",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!formData.email.includes("@")) errs.email = "Valid email is required";
    if (!formData.empId.trim()) errs.empId = "Employee ID is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedRoleObj = roles.find((r) => r.id === formData.role);

    onInviteSubmit({
      ...formData,
      roleName: selectedRoleObj?.name || "Operations Staff",
      roleColor: selectedRoleObj?.badgeColor || "purple",
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
              person_add
            </span>
            <h3 className="admin-modal-title">Invite Admin User</h3>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Full Name *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. Ramesh Chandra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span style={{ color: "var(--admin-error)", fontSize: "11px" }}>{errors.name}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Employee ID *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. EMP-OPS-410"
                  value={formData.empId}
                  onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                />
                {errors.empId && <span style={{ color: "var(--admin-error)", fontSize: "11px" }}>{errors.empId}</span>}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Corporate Email *</label>
                <input
                  type="email"
                  className="admin-form-input"
                  placeholder="ramesh.c@hired.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <span style={{ color: "var(--admin-error)", fontSize: "11px" }}>{errors.email}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Contact Number</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="+91 98000 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Primary Role Template *</label>
                <select
                  className="admin-form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.clearance})
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Hub Jurisdiction *</label>
                <select
                  className="admin-form-select"
                  value={formData.hubCategory}
                  onChange={(e) => {
                    const cat = e.target.value;
                    const hubMap = {
                      west: "West Hub (Mumbai/Pune)",
                      north: "North Hub (Delhi NCR)",
                      south: "South Hub (BLR/Chennai)",
                      hq: "Executive Leadership (HQ)",
                    };
                    setFormData({
                      ...formData,
                      hubCategory: cat,
                      hubScope: hubMap[cat] || "West Hub",
                    });
                  }}
                >
                  <option value="west">West Hub (Mumbai/Pune)</option>
                  <option value="north">North Hub (Delhi NCR)</option>
                  <option value="south">South Hub (BLR/Chennai)</option>
                  <option value="hq">Executive Leadership (HQ)</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">MFA Enrollment Grace Period</label>
              <select
                className="admin-form-select"
                value={formData.mfaGrace}
                onChange={(e) => setFormData({ ...formData, mfaGrace: e.target.value })}
              >
                <option value="immediate">Immediate (Hardware key required upon 1st login)</option>
                <option value="24h">24 Hours Grace Period</option>
                <option value="48h">48 Hours Grace Period</option>
              </select>
            </div>

            <div className="admin-consensus-advisory-card" style={{ padding: "10px 12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--admin-primary-container)" }}>
                verified_user
              </span>
              <p style={{ margin: 0, fontSize: "11.5px", color: "var(--admin-text-muted)" }}>
                Invitation link with single-use cryptographic token will be dispatched to the corporate address.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary" id="btn-submit-invite">
              <span className="material-symbols-outlined">send</span>
              <span>Send Invitation &amp; Provision</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

InviteUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onInviteSubmit: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
};
