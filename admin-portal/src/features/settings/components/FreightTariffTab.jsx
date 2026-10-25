import PropTypes from "prop-types";

export default function FreightTariffTab({ freight, onChangeFreight }) {
  return (
    <section className="settings-section-card">
      <div className="settings-section-header">
        <div className="settings-section-title-wrap">
          <div className="settings-section-title-row">
            <span className="material-symbols-outlined">tune</span>
            <h2 className="settings-section-title">
              Global Freight Commission & Tariff Rules
            </h2>
          </div>
          <p className="settings-section-desc">
            Parameters driving billing rate generation, dynamic dispatch quotes, and driver net settlements.
          </p>
        </div>
        <span className="settings-tag-pill primary">Auto-Enforced</span>
      </div>

      {/* Slider Control */}
      <div className="settings-slider-card">
        <div className="settings-slider-top">
          <div>
            <div className="settings-slider-title">
              Default Platform Commission Cut
            </div>
            <div className="settings-slider-sub">
              Retained by HireD Operations per standard B2B load order
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span className="settings-slider-val">
              {Number(freight.platformCommission).toFixed(1)}%
            </span>
            <span className="settings-slider-sub">(Standard Tier)</span>
          </div>
        </div>

        <input
          type="range"
          min="8"
          max="25"
          step="0.5"
          className="settings-range-input"
          value={freight.platformCommission}
          onChange={(e) => onChangeFreight("platformCommission", parseFloat(e.target.value))}
          id="slider-platform-commission"
        />

        <div className="settings-slider-markers">
          <span>Min Baseline (8.0%)</span>
          <span>Nominal Average (15.0%)</span>
          <span>Enterprise Max (25.0%)</span>
        </div>
      </div>

      {/* Parameter Grid */}
      <div className="settings-form-grid">
        <div className="settings-form-group">
          <label className="settings-label" htmlFor="tds-deduction">
            Driver Wallet Instant TDS Deductions
          </label>
          <input
            id="tds-deduction"
            type="text"
            className="settings-input"
            value={freight.tdsDeductionText}
            onChange={(e) => onChangeFreight("tdsDeductionText", e.target.value)}
          />
          <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
            Automated filing under individual driver PAN
          </span>
        </div>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="min-base-fare">
            Minimum Corridor Base Fare
          </label>
          <input
            id="min-base-fare"
            type="text"
            className="settings-input mono"
            value={freight.minBaseFareText}
            onChange={(e) => onChangeFreight("minBaseFareText", e.target.value)}
          />
          <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
            Minimum gross commercial freight allocation
          </span>
        </div>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="detention-surcharge">
            En-Route Detention / Dwell Surcharge
          </label>
          <input
            id="detention-surcharge"
            type="text"
            className="settings-input mono"
            value={freight.detentionSurchargeText}
            onChange={(e) => onChangeFreight("detentionSurchargeText", e.target.value)}
          />
          <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
            Auto-calculated using GPS Geo-fence arrival & exit
          </span>
        </div>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="heavy-haul">
            Heavy Haul Multiplier Surcharge
          </label>
          <input
            id="heavy-haul"
            type="text"
            className="settings-input"
            value={freight.heavyHaulMultiplier}
            onChange={(e) => onChangeFreight("heavyHaulMultiplier", e.target.value)}
          />
          <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
            Applied when freight weight exceeds statutory axle weight limits
          </span>
        </div>

        {/* Auto-indexing Toggle Card */}
        <div className="settings-toggle-card" style={{ gridColumn: "1 / -1" }}>
          <div className="settings-toggle-card-info">
            <span className="settings-toggle-card-title">
              Fuel Price Surcharge Auto-Indexing
            </span>
            <span className="settings-toggle-card-desc">
              Recalibrate freight rates dynamically when regional diesel benchmark fluctuates ±3%
            </span>
          </div>
          <label className="switch-container">
            <input
              type="checkbox"
              checked={freight.fuelAutoIndexing}
              onChange={(e) => onChangeFreight("fuelAutoIndexing", e.target.checked)}
              id="switch-fuel-auto-indexing"
            />
            <span className="switch-slider" />
          </label>
        </div>
      </div>
    </section>
  );
}

FreightTariffTab.propTypes = {
  freight: PropTypes.shape({
    platformCommission: PropTypes.number.isRequired,
    tdsDeductionText: PropTypes.string.isRequired,
    minBaseFareText: PropTypes.string.isRequired,
    detentionSurchargeText: PropTypes.string.isRequired,
    fuelAutoIndexing: PropTypes.bool.isRequired,
    heavyHaulMultiplier: PropTypes.string.isRequired,
    nightTransitAllowance: PropTypes.string.isRequired,
  }).isRequired,
  onChangeFreight: PropTypes.func.isRequired,
};
