import { useState } from "react";
import PropTypes from "prop-types";

function generateSecureRandomPassword(length = 12) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*";
  const all = upper + lower + digits + symbols;

  let pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  for (let i = pwd.length; i < length; i++) {
    pwd.push(all[Math.floor(Math.random() * all.length)]);
  }

  // Shuffle
  for (let i = pwd.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
  }

  return pwd.join("");
}

function generateCleanEmail(name, companyName) {
  const parts = (name || "associate").trim().toLowerCase().split(/\s+/);
  const first = parts[0]?.replace(/[^a-z0-9]/g, "") || "associate";
  const last = parts[1]?.replace(/[^a-z0-9]/g, "") || "";
  const userPart = last ? `${first}.${last}` : first;
  const compClean = (companyName || "partner").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  return `${userPart}.${compClean || "partner"}@hired.in`;
}

function AddAssociateModal({ isOpen, onClose, company, onAssociateCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailCustomized, setIsEmailCustomized] = useState(false);
  const [password, setPassword] = useState(() => generateSecureRandomPassword());
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("Operations Lead");
  const [showPassword, setShowPassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !company) return null;

  const handleNameChange = (val) => {
    setName(val);
    if (!isEmailCustomized) {
      setEmail(generateCleanEmail(val, company.name));
    }
  };

  const handleGenerateEmail = () => {
    const generated = generateCleanEmail(name, company.name);
    setEmail(generated);
    setIsEmailCustomized(false);
  };

  const handleGeneratePassword = () => {
    setPassword(generateSecureRandomPassword());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide the associate's full name.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim() || undefined,
        autoGenerateEmail: !email.trim(),
        password: password.trim() || undefined,
        autoGeneratePassword: !password.trim(),
        phone: phone.trim() || undefined,
        designation: designation.trim() || undefined,
      };

      await onAssociateCreated(payload);
      onClose();
    } catch (err) {
      console.error("Failed to create associate:", err);
      setError(err.response?.data?.error || err.message || "Failed to create associate account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="company-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id="modal-add-associate"
    >
      <div
        className="company-modal-card associate-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Enterprise Icon Branding */}
        <div className="company-modal-header associate-modal-header">
          <div className="associate-header-branding">
            <div className="associate-header-icon-box">
              <span className="material-symbols-outlined text-[24px]">person_add</span>
            </div>
            <div>
              <h3 className="associate-modal-title">
                Add Company Associate
              </h3>
              <div className="associate-header-subtitle">
                <span>Provision B2B portal login account for</span>
                <span className="associate-company-chip">
                  <span className="material-symbols-outlined text-[14px]">domain</span>
                  <span>{company.name}</span>
                  {company.code && <span className="associate-code-tag">{company.code}</span>}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
            id="btn-close-add-associate"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="company-modal-body">
            {error && (
              <div className="associate-error-banner" role="alert">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Associate Full Name */}
            <div className="company-form-group form-field-group">
              <label className="company-form-label form-field-label" htmlFor="associate-name">
                <span className="company-form-label-title">
                  Full Name <span style={{ color: "var(--comp-primary)" }}>*</span>
                </span>
              </label>
              <div className="associate-input-wrapper">
                <span className="material-symbols-outlined associate-input-icon">person</span>
                <input
                  id="associate-name"
                  type="text"
                  className="company-form-input form-field-input has-prefix"
                  placeholder="e.g. Ramesh Sharma"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Designation & Phone Grid */}
            <div className="modal-form-grid" style={{ gap: "0.875rem" }}>
              <div className="company-form-group form-field-group">
                <label className="company-form-label form-field-label" htmlFor="associate-designation">
                  <span className="company-form-label-title">Designation / Role</span>
                </label>
                <div className="associate-input-wrapper">
                  <span className="material-symbols-outlined associate-input-icon">badge</span>
                  <select
                    id="associate-designation"
                    className="company-form-select form-field-select has-prefix"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  >
                    <option value="Operations Lead">Operations Lead</option>
                    <option value="Logistics Manager">Logistics Manager</option>
                    <option value="Fleet Coordinator">Fleet Coordinator</option>
                    <option value="Finance & Billing">Finance &amp; Billing</option>
                    <option value="Executive Sponsor">Executive Sponsor</option>
                  </select>
                </div>
              </div>

              <div className="company-form-group form-field-group">
                <label className="company-form-label form-field-label" htmlFor="associate-phone">
                  <span className="company-form-label-title">Phone Number</span>
                </label>
                <div className="associate-input-wrapper">
                  <span className="material-symbols-outlined associate-input-icon">call</span>
                  <input
                    id="associate-phone"
                    type="tel"
                    className="company-form-input form-field-input has-prefix"
                    placeholder="+91 98000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Email Address with Generate Button */}
            <div className="company-form-group form-field-group">
              <label className="company-form-label form-field-label" htmlFor="associate-email">
                <span className="company-form-label-title">
                  Login Email (B2B Account Username) <span style={{ color: "var(--comp-primary)" }}>*</span>
                </span>
                <button
                  type="button"
                  className="associate-action-pill-btn"
                  onClick={handleGenerateEmail}
                  title="Generate email from name and company code"
                >
                  <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>
                  <span>Auto-Generate</span>
                </button>
              </label>
              <div className="associate-input-wrapper">
                <span className="material-symbols-outlined associate-input-icon">mail</span>
                <input
                  id="associate-email"
                  type="email"
                  className="company-form-input form-field-input has-prefix"
                  placeholder="name.company@hired.in"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsEmailCustomized(true);
                  }}
                  required
                />
              </div>
              <div className="company-form-hint form-field-hint">
                <span className="material-symbols-outlined">info</span>
                <span>Will be used by the associate to authenticate into the HireD B2B Portal.</span>
              </div>
            </div>

            {/* Password with Generate and Show/Hide */}
            <div className="company-form-group form-field-group">
              <label className="company-form-label form-field-label" htmlFor="associate-password">
                <span className="company-form-label-title">
                  Temporary Access Password <span style={{ color: "var(--comp-primary)" }}>*</span>
                </span>
                <button
                  type="button"
                  className="associate-action-pill-btn"
                  onClick={handleGeneratePassword}
                  title="Generate a cryptographically secure random password"
                >
                  <span className="material-symbols-outlined text-[13px]">refresh</span>
                  <span>Generate Strong</span>
                </button>
              </label>
              <div className="associate-input-wrapper">
                <span className="material-symbols-outlined associate-input-icon">lock</span>
                <input
                  id="associate-password"
                  type={showPassword ? "text" : "password"}
                  className="company-form-input form-field-input has-prefix has-suffix"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ fontFamily: "monospace", letterSpacing: "0.04em", fontSize: "0.9375rem" }}
                  required
                />
                <button
                  type="button"
                  className="associate-btn-eye-toggle"
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              <div className="company-form-hint form-field-hint">
                <span className="material-symbols-outlined">lock_clock</span>
                <span>Minimum 8 characters. Contains letters, numbers, and symbols.</span>
              </div>
            </div>

            {/* Instant Access Callout Banner */}
            <div className="associate-info-banner">
              <span className="material-symbols-outlined associate-info-icon">verified_user</span>
              <div>
                <h4 className="associate-info-title">Immediate B2B Portal Access</h4>
                <p className="associate-info-desc">
                  Upon account provisioning, credentials will be displayed for one-click copying and direct dispatch to the client associate.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="company-modal-footer">
            <button
              type="button"
              className="btn-modal-cancel btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit btn-submit"
              disabled={isSubmitting || !name.trim()}
              id="btn-submit-associate"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSubmitting ? "progress_activity" : "person_add"}
              </span>
              <span>{isSubmitting ? "Provisioning..." : "Provision Associate Account"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddAssociateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  company: PropTypes.object,
  onAssociateCreated: PropTypes.func.isRequired,
};

export default AddAssociateModal;
