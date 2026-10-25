import PropTypes from "prop-types";

export default function ApiWebhooksTab({
  telemetryAdapters,
  onPingDevices,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* AIS-140 GPS Telemetry Section */}
      <section className="settings-section-card">
        <div className="settings-section-header">
          <div className="settings-section-title-wrap">
            <div className="settings-section-title-row">
              <span className="material-symbols-outlined">sensors</span>
              <h2 className="settings-section-title">
                Fleet Telemetry & AIS-140 GPS Gateways
              </h2>
            </div>
            <p className="settings-section-desc">
              Government-mandated AIS-140 tracking adapters for National Permit (NP) commercial trucks.
            </p>
          </div>
          <button
            type="button"
            className="settings-btn-secondary"
            onClick={onPingDevices}
            style={{ height: "34px" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              refresh
            </span>
            <span>Ping Devices</span>
          </button>
        </div>

        <div className="telemetry-cards-grid">
          {telemetryAdapters.map((tel) => (
            <div key={tel.id} className="telemetry-card-item">
              <div className="telemetry-card-left">
                <div className="telemetry-card-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
                    {tel.icon}
                  </span>
                </div>
                <div className="telemetry-card-text">
                  <h5>{tel.name}</h5>
                  <p>{tel.desc}</p>
                </div>
              </div>
              <span className="settings-tag-pill success">{tel.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

ApiWebhooksTab.propTypes = {
  telemetryAdapters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
  onPingDevices: PropTypes.func.isRequired,
};
