import PropTypes from "prop-types";

export default function CarrierQualityWidget({ qualityData = {} }) {
  const tier1Drivers = qualityData?.tier1Drivers || {
    label: "Active Driver Fleet",
    value: "98.4%",
    subtext: "Onboarded commercial drivers with verified documents",
  };
  const fleetRating = qualityData?.fleetRating || {
    label: "Delivery SLA Fulfillment",
    value: "4.92",
    star: "★",
    subtext: "Across verified closed consignments",
  };
  const instantDisbursal = qualityData?.instantDisbursal || {
    label: "Wallet Credit Reliability",
    value: "100%",
    subtext: "Accrued to driver wallets upon OTP trip closure",
  };
  const transitIncident = qualityData?.transitIncident || {
    label: "Discrepancy / Incident Ratio",
    value: "0.0%",
    subtext: "Verified against electronic proof of delivery (ePOD)",
  };

  return (
    <div className="reports-widget-card">
      <div className="reports-widget-header">
        <h3 className="reports-widget-title">
          Carrier Earning &amp; Quality Index
        </h3>
        <span className="material-symbols-outlined reports-widget-icon verified">
          verified_user
        </span>
      </div>

      <div className="reports-quality-grid">
        {/* Box 1 */}
        <div className="reports-quality-box">
          <span className="reports-quality-label">{tier1Drivers.label}</span>
          <span className="reports-quality-val">{tier1Drivers.value}</span>
          <span className="reports-quality-subtext">{tier1Drivers.subtext}</span>
        </div>

        {/* Box 2 */}
        <div className="reports-quality-box">
          <span className="reports-quality-label">{fleetRating.label}</span>
          <div className="reports-quality-val-row">
            <span className="reports-quality-val">{fleetRating.value}</span>
            <span className="reports-quality-star">{fleetRating.star}</span>
          </div>
          <span className="reports-quality-subtext">{fleetRating.subtext}</span>
        </div>

        {/* Box 3 */}
        <div className="reports-quality-box">
          <span className="reports-quality-label">{instantDisbursal.label}</span>
          <span className="reports-quality-val">{instantDisbursal.value}</span>
          <span className="reports-quality-subtext">
            {instantDisbursal.subtext}
          </span>
        </div>

        {/* Box 4 */}
        <div className="reports-quality-box">
          <span className="reports-quality-label">{transitIncident.label}</span>
          <span className="reports-quality-val incident">
            {transitIncident.value}
          </span>
          <span className="reports-quality-subtext">
            {transitIncident.subtext}
          </span>
        </div>
      </div>
    </div>
  );
}

CarrierQualityWidget.propTypes = {
  qualityData: PropTypes.shape({
    tier1Drivers: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      subtext: PropTypes.string.isRequired,
    }).isRequired,
    fleetRating: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      star: PropTypes.string.isRequired,
      subtext: PropTypes.string.isRequired,
    }).isRequired,
    instantDisbursal: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      subtext: PropTypes.string.isRequired,
    }).isRequired,
    transitIncident: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      subtext: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
