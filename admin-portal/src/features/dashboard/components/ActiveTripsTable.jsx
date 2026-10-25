import PropTypes from "prop-types";

function ActiveTripsTable({ trips, onTrackTrip, onViewAllTrips }) {
  const hasTrips = trips && trips.length > 0;

  return (
    <article className="dashboard-card live-trips-card" id="card-active-trips">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon-pill icon-blue">
            <span className="material-symbols-outlined">route</span>
          </div>
          <div>
            <h3 className="card-title">Live Corridor Telemetry &amp; Active Trips</h3>
            <p className="card-subtitle">
              GPS tracked transit corridors, driver milestones &amp; on-time SLA adherence
            </p>
          </div>
        </div>

        <div className="card-header-actions">
          <button
            type="button"
            className="action-btn secondary-btn"
            id="btn-view-control-room"
            onClick={onViewAllTrips}
          >
            <span>Trip Control Room</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Trip ID &amp; Route</th>
              <th>B2B Enterprise Client</th>
              <th>Assigned Driver &amp; Vehicle</th>
              <th>Transit Progress</th>
              <th>ETA &amp; SLA Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!hasTrips ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: "#3b82f6" }}>
                      local_shipping
                    </span>
                    <strong style={{ color: "#1e293b", fontSize: "1rem" }}>No Active Trips in Transit</strong>
                    <span style={{ fontSize: "0.875rem" }}>
                      Dispatched vehicles and GPS monitored highway corridors will appear here in real time.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip.id} className="table-row">
                  {/* Trip ID & Route */}
                  <td>
                    <div className="trip-id-cell">
                      <strong className="cell-code">{trip.id}</strong>
                      <div className="route-flow">
                        <span className="route-text">{trip.route}</span>
                        <span className="distance-pill">{trip.distance}</span>
                      </div>
                    </div>
                  </td>

                  {/* Partner */}
                  <td>
                    <div className="partner-cell">
                      <strong className="partner-name">{trip.partner}</strong>
                      <span className="cargo-tag">{trip.cargo}</span>
                    </div>
                  </td>

                  {/* Driver & Vehicle */}
                  <td>
                    <div className="driver-vehicle-cell">
                      <div className="driver-avatar-mini">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      <div>
                        <strong className="driver-name">{trip.driverName}</strong>
                        <span className="vehicle-info">
                          {trip.vehicleNo} · {trip.vehicleType}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Progress */}
                  <td>
                    <div className="progress-cell">
                      <div className="progress-meta">
                        <span className="progress-percentage">{trip.progressPct}%</span>
                        <span className="progress-status-label">{trip.status}</span>
                      </div>
                      <div className="mini-progress-track">
                        <div
                          className={`mini-progress-bar ${
                            trip.slaStatus === "warning" ? "bar-warning" : "bar-healthy"
                          }`}
                          style={{ width: `${trip.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* ETA & SLA */}
                  <td>
                    <div className="eta-cell">
                      <span className="eta-timestamp">{trip.eta}</span>
                      <span
                        className={`sla-status-badge ${
                          trip.slaStatus === "warning" ? "sla-warning" : "sla-healthy"
                        }`}
                      >
                        {trip.slaStatus === "warning" ? "Delay Alert" : "On-Time SLA"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td>
                    <button
                      type="button"
                      className="action-btn small-btn secondary-btn"
                      onClick={() => onTrackTrip?.(trip)}
                      id={`btn-track-${trip.id}`}
                    >
                      <span className="material-symbols-outlined">map</span>
                      <span>Track</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}

ActiveTripsTable.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object),
  onTrackTrip: PropTypes.func,
  onViewAllTrips: PropTypes.func,
};

export default ActiveTripsTable;
