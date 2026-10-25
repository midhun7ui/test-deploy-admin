import { useRef } from "react";
import PropTypes from "prop-types";

export default function GeneralProfileTab({
  entity,
  onChangeEntity,
  onAddHub,
  onRemoveHub,
  onChangeLogo,
  onRemoveLogo,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChangeLogo(file.name);
    }
  };

  return (
    <section className="settings-section-card">
      <div className="settings-section-header">
        <div className="settings-section-title-wrap">
          <div className="settings-section-title-row">
            <span className="material-symbols-outlined">corporate_fare</span>
            <h2 className="settings-section-title">
              Corporate Entity & Operational Profile
            </h2>
          </div>
          <p className="settings-section-desc">
            Primary legal identity printed on consolidated freight invoices, waybills, and driver payment vouchers.
          </p>
        </div>
        <span className="settings-tag-pill success">PAN Verified</span>
      </div>

      {/* Entity Logo Branding Box */}
      <div className="settings-logo-box">
        <div className="settings-logo-preview-group">
          <div className="settings-logo-pod">
            <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
              local_shipping
            </span>
            <span className="brand-text">HireD</span>
          </div>
          <div className="settings-logo-info">
            <h4>{entity.logoName || "HireD Logistics Brand Mark"}</h4>
            <p>SVG, PNG or WEBP (Max 2MB, 512x512 recommended for high-DPI PDFs)</p>
          </div>
        </div>
        <div className="settings-logo-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.svg"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="settings-btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            style={{ height: "34px" }}
          >
            Change Logo
          </button>
          <button
            type="button"
            className="settings-btn-secondary"
            onClick={onRemoveLogo}
            title="Remove Logo"
            style={{ height: "34px", padding: "0 10px", color: "var(--settings-error)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              delete
            </span>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="settings-form-grid">
        <div className="settings-form-group">
          <label className="settings-label" htmlFor="company-legal-name">
            Company Legal Name
          </label>
          <input
            id="company-legal-name"
            type="text"
            className="settings-input"
            value={entity.legalName}
            onChange={(e) => onChangeEntity("legalName", e.target.value)}
          />
        </div>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="registered-gstin">
            Registered GSTIN (India)
          </label>
          <input
            id="registered-gstin"
            type="text"
            className="settings-input mono"
            value={entity.gstin}
            onChange={(e) => onChangeEntity("gstin", e.target.value)}
          />
        </div>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="billing-email">
            Support & Billing Email
          </label>
          <input
            id="billing-email"
            type="email"
            className="settings-input"
            value={entity.email}
            onChange={(e) => onChangeEntity("email", e.target.value)}
          />
        </div>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="dispatch-hotline">
            Central Dispatch Hotline
          </label>
          <input
            id="dispatch-hotline"
            type="tel"
            className="settings-input mono"
            value={entity.phone}
            onChange={(e) => onChangeEntity("phone", e.target.value)}
          />
        </div>

        <div className="settings-form-group full-width">
          <label className="settings-label" htmlFor="hq-address">
            Registered HQ Address
          </label>
          <textarea
            id="hq-address"
            className="settings-textarea"
            rows="2"
            value={entity.hqAddress}
            onChange={(e) => onChangeEntity("hqAddress", e.target.value)}
          />
        </div>

        {/* Active Regional Logistics Hubs */}
        <div className="settings-form-group full-width">
          <label className="settings-label">
            Active Regional Logistics Hubs
          </label>
          <div className="settings-hub-tags-wrapper">
            {entity.hubs.map((hub) => (
              <span key={hub.id} className="hub-tag-item">
                <span className="hub-dot" />
                <span>{hub.name}</span>
                <button
                  type="button"
                  className="remove-hub-btn"
                  onClick={() => onRemoveHub(hub.id)}
                  aria-label={`Remove ${hub.name}`}
                  title="Remove Hub"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                    close
                  </span>
                </button>
              </span>
            ))}
            <button
              type="button"
              className="add-hub-btn"
              onClick={onAddHub}
              id="btn-add-corridor-node"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                add
              </span>
              <span>Add Corridor Node</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

GeneralProfileTab.propTypes = {
  entity: PropTypes.shape({
    legalName: PropTypes.string.isRequired,
    gstin: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    hqAddress: PropTypes.string.isRequired,
    logoName: PropTypes.string,
    hubs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onChangeEntity: PropTypes.func.isRequired,
  onAddHub: PropTypes.func.isRequired,
  onRemoveHub: PropTypes.func.isRequired,
  onChangeLogo: PropTypes.func.isRequired,
  onRemoveLogo: PropTypes.func.isRequired,
};
