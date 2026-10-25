import { useState } from "react";
import PropTypes from "prop-types";

function generateRandomPassword(length = 12) {
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

  for (let i = pwd.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
  }

  return pwd.join("");
}

function AddCompanyModal({ isOpen, onClose, onAddCompany }) {
  const [formData, setFormData] = useState({
    name: "",
    legalEntity: "",
    industry: "Cold Chain & FMCG",
    tier: "Standard B2B",
    corridor: "Mumbai - Pune Corridor (NH-48)",
    gstin: "",
    pan: "",
    state: "Maharashtra (MH)",
    stateCode: "Code 27",
    hqAddress: "",
    creditLimit: 1500000,
    creditTerms: "Net 30 Days",
    securityDeposit: 500000,
    driverSplit: 85,
    contactName: "",
    contactDesignation: "Logistics Manager",
    contactPhone: "",
    contactEmail: "",
    createAccount: true,
    accountName: "",
    accountEmail: "",
    accountPassword: generateRandomPassword(),
  });
  const [showPassword, setShowPassword] = useState(true);


  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.gstin) {
      alert("Please provide the Company Trade Name and GSTIN.");
      return;
    }

    const initials = formData.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const limitLakh = (Number(formData.creditLimit) / 100000).toFixed(1);

    const newCompany = {
      id: `CMP-2026-00${Math.floor(Math.random() * 90) + 10}`,
      name: formData.name,
      shortName: formData.name,
      initials: initials || "CO",
      legalEntity: formData.legalEntity || formData.name,
      tier: formData.tier,
      tierType:
        formData.tier === "Enterprise Prime"
          ? "prime"
          : formData.tier === "Reefer Specialist"
          ? "reefer"
          : "standard",
      code: `CMP-2026-00${Math.floor(Math.random() * 90) + 10}`,
      activeSince: "Oct 2026",
      industry: formData.industry,
      corridor: formData.corridor,
      gstin: formData.gstin.toUpperCase(),
      pan: (formData.pan || formData.gstin.slice(2, 12)).toUpperCase(),
      state: formData.state,
      stateCode: formData.stateCode,
      hqAddress: formData.hqAddress || "Corporate Logistics Hub",
      status: "Active",
      statusType: "active",
      gstVerified: true,
      credit: {
        used: 0,
        limit: Number(formData.creditLimit),
        usedDisplay: "₹0.00",
        limitDisplay: `₹${limitLakh}L`,
        utilizationRate: 0,
        remainingDisplay: `₹${Number(formData.creditLimit).toLocaleString("en-IN")}`,
        terms: formData.creditTerms,
        overdueBalance: 0,
        securityDeposit: Number(formData.securityDeposit),
        depositType: "Bank Guarantee on file",
        splitSummary: `${formData.driverSplit}% Drv · ${100 - formData.driverSplit}% Platform`,
      },
      commission: {
        driverSplit: Number(formData.driverSplit),
        driverLabel: "Driver Partner Allocation",
        driverSubtitle: "Disbursed instantly via OTP verification",
        platformSplit: 100 - Number(formData.driverSplit),
        platformLabel: "HireD Platform Margin",
        platformSubtitle: "Includes toll routing, SLA dispatch, GPS",
        notes: "Fuel surcharges & detention allowances pass 100% directly to assigned driver.",
      },
      metrics: {
        trips30d: 0,
        inTransit: 0,
        slaRate: "100%",
        billed30d: "₹0.00",
      },
      contact: {
        name: formData.contactName || "Operations Lead",
        designation: formData.contactDesignation,
        phone: formData.contactPhone || "+91 98000 00000",
        email: formData.contactEmail || "logistics@company.in",
        initials: (formData.contactName || "OL")
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
      },
      createAccount: formData.createAccount,
      accountName: formData.accountName || formData.contactName || formData.name,
      accountEmail:
        formData.accountEmail ||
        formData.contactEmail ||
        `partner.${(formData.name || "company").toLowerCase().replace(/[^a-z0-9]/g, "")}@hired.in`,
      accountPassword: formData.accountPassword,
      accountPhone: formData.contactPhone,
    };

    onAddCompany(newCompany);
    onClose();
  };

  return (
    <div
      className="company-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id="modal-add-company"
    >
      <div className="company-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="company-modal-header">
          <h3 className="company-modal-title">Onboard Enterprise Client Account</h3>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
            id="btn-close-add-company"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="company-modal-body">
            <div className="modal-form-grid">
              <div className="form-field-group">
                <label className="form-field-label">Company Trade Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-field-input"
                  placeholder="e.g. Acme Logistics India"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Legal Registered Entity</label>
                <input
                  type="text"
                  name="legalEntity"
                  className="form-field-input"
                  placeholder="e.g. Acme Logistics Pvt Ltd"
                  value={formData.legalEntity}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">GSTIN (15 Digits) *</label>
                <input
                  type="text"
                  name="gstin"
                  className="form-field-input"
                  placeholder="e.g. 27AAACA1234F1Z9"
                  maxLength={15}
                  value={formData.gstin}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">PAN Number</label>
                <input
                  type="text"
                  name="pan"
                  className="form-field-input"
                  placeholder="e.g. AAACA1234F"
                  maxLength={10}
                  value={formData.pan}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Industry Classification</label>
                <select
                  name="industry"
                  className="form-field-select"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option value="Cold Chain & FMCG">Cold Chain & FMCG</option>
                  <option value="Cement & Heavy Goods">Cement & Heavy Goods</option>
                  <option value="Pharma & Chemicals">Pharma & Chemicals</option>
                  <option value="Automotive & Spares">Automotive & Spares</option>
                  <option value="Steel & Heavy Haulage">Steel & Heavy Haulage</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Partner Tier</label>
                <select
                  name="tier"
                  className="form-field-select"
                  value={formData.tier}
                  onChange={handleChange}
                >
                  <option value="Standard B2B">Standard B2B</option>
                  <option value="Enterprise Prime">Enterprise Prime</option>
                  <option value="Reefer Specialist">Reefer Specialist</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Base Freight Corridor</label>
                <select
                  name="corridor"
                  className="form-field-select"
                  value={formData.corridor}
                  onChange={handleChange}
                >
                  <option value="Mumbai - Pune Corridor (NH-48)">Mumbai - Pune Corridor (NH-48)</option>
                  <option value="Bengaluru - Chennai Expressway">Bengaluru - Chennai Expressway</option>
                  <option value="Delhi - Ahmedabad Corridor">Delhi - Ahmedabad Corridor</option>
                  <option value="Kochi - Coimbatore Corridor (NH-544)">Kochi - Coimbatore Corridor (NH-544)</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Credit Terms</label>
                <select
                  name="creditTerms"
                  className="form-field-select"
                  value={formData.creditTerms}
                  onChange={handleChange}
                >
                  <option value="Net 15 Days">Net 15 Days</option>
                  <option value="Net 30 Days">Net 30 Days</option>
                  <option value="Net 45 Days">Net 45 Days</option>
                  <option value="Net 60 Days">Net 60 Days</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Approved Credit Limit (INR)</label>
                <input
                  type="number"
                  name="creditLimit"
                  className="form-field-input"
                  value={formData.creditLimit}
                  onChange={handleChange}
                  min={100000}
                  step={50000}
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Security Deposit (INR)</label>
                <input
                  type="number"
                  name="securityDeposit"
                  className="form-field-input"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  min={0}
                  step={50000}
                />
              </div>

              <div className="form-field-group full-width">
                <label className="form-field-label">Operating HQ Address</label>
                <textarea
                  name="hqAddress"
                  className="form-field-textarea"
                  placeholder="Plot/Street, Industrial Area, City, State - PIN"
                  value={formData.hqAddress}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Primary Contact Person Details */}
              <div className="form-field-group">
                <label className="form-field-label">Key Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  className="form-field-input"
                  placeholder="e.g. Ramesh Patel"
                  value={formData.contactName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Designation / Role</label>
                <input
                  type="text"
                  name="contactDesignation"
                  className="form-field-input"
                  placeholder="e.g. General Manager - Logistics"
                  value={formData.contactDesignation}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Mobile Phone Number</label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="form-field-input"
                  placeholder="+91 98765 43210"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Official Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  className="form-field-input"
                  placeholder="ramesh@company.in"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 5: Partner Portal Account & Login Credentials */}
          <div className="modal-form-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="material-symbols-outlined text-[18px]" style={{ color: "var(--comp-primary)" }}>
                  badge
                </span>
                <span className="form-section-title" style={{ margin: 0 }}>
                  Partner Portal Account &amp; Access Credentials
                </span>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", cursor: "pointer", color: "var(--comp-text-main)" }}>
                <input
                  type="checkbox"
                  name="createAccount"
                  checked={formData.createAccount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, createAccount: e.target.checked }))}
                  style={{ accentColor: "var(--comp-primary)", width: "16px", height: "16px" }}
                />
                <span>Provision Login Account</span>
              </label>
            </div>

            {formData.createAccount && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "var(--comp-surface-raised, rgba(255,255,255,0.02))", padding: "0.875rem", borderRadius: "8px", border: "1px solid var(--comp-border)" }}>
                <div className="form-grid-2col">
                  <div className="form-field-group">
                    <label className="form-field-label">Associate / User Name</label>
                    <input
                      type="text"
                      name="accountName"
                      className="form-field-input"
                      placeholder={formData.contactName || "Defaults to Contact Person"}
                      value={formData.accountName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label className="form-field-label" style={{ margin: 0 }}>Portal Login Email</label>
                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--comp-primary)",
                          fontSize: "0.6875rem",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                        onClick={() => {
                          const baseName = (formData.accountName || formData.contactName || "partner").trim().toLowerCase().split(/\s+/)[0] || "partner";
                          const baseComp = (formData.name || "company").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
                          setFormData((prev) => ({
                            ...prev,
                            accountEmail: `${baseName}.${baseComp}@hired.in`,
                          }));
                        }}
                      >
                        <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>
                        <span>Generate Email</span>
                      </button>
                    </div>
                    <input
                      type="email"
                      name="accountEmail"
                      className="form-field-input"
                      placeholder={formData.contactEmail || "Auto-generated if empty"}
                      value={formData.accountEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-field-label" style={{ margin: 0 }}>Generated Access Password</label>
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--comp-primary)",
                        fontSize: "0.6875rem",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          accountPassword: generateRandomPassword(),
                        }));
                      }}
                    >
                      <span className="material-symbols-outlined text-[13px]">refresh</span>
                      <span>Generate New</span>
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="accountPassword"
                      className="form-field-input"
                      value={formData.accountPassword}
                      onChange={handleChange}
                      style={{ fontFamily: "monospace", color: "#10b981", fontWeight: 600 }}
                    />
                    <button
                      type="button"
                      className="btn-profile-action"
                      style={{ height: "38px", minWidth: "38px", borderRadius: "6px", borderColor: "var(--comp-border)" }}
                      title={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--comp-outline)", marginTop: "0.25rem" }}>
                    Upon saving, an interactive credentials dialog with 1-click copy buttons will pop up.
                  </div>
                </div>
              </div>
            )}
          </div>


          <div className="company-modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              id="btn-submit-add-company"
            >
              + Create Company Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddCompanyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddCompany: PropTypes.func.isRequired,
};

export default AddCompanyModal;
