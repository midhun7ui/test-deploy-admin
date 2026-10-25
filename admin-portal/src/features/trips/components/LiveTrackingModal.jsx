import PropTypes from "prop-types";
import OrderRouteMap from "../../../components/map/OrderRouteMap";

function LiveTrackingModal({ isOpen, onClose, trip }) {
  if (!isOpen || !trip) return null;

  const route = trip.route || {};
  const telemetry = trip.telemetry || {};
  const vehicle = trip.vehicle || {};
  const driver = trip.driver || null;

  return (
    <div className="live-radar-modal-overlay" onClick={onClose}>
      <div className="live-radar-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Radar Modal Header */}
        <div className="live-radar-modal-header">
          <div className="live-radar-header-left">
            <span className="live-radar-ping-dot"></span>
            <div>
              <div className="live-radar-title-row">
                <h2 className="live-radar-modal-title">Live Telemetry HUD — #{trip.id}</h2>
                <span className="live-radar-modal-badge">{trip.status || "Active"}</span>
              </div>
              <p className="live-radar-modal-sub">
                {trip.account || "Enterprise Partner"} • Corridor: {route.corridor || "NH-48"} ({route.origin || "Pickup"} → {route.destination || "Delivery"})
              </p>
            </div>
          </div>
          <button
            type="button"
            className="live-radar-close-btn"
            onClick={onClose}
            title="Close Live Radar"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Radar Modal Body */}
        <div className="live-radar-modal-body">
          {/* Main Map Visual Display */}
          <div className="live-radar-screen" style={{ position: "relative", minHeight: "420px", overflow: "hidden" }}>
            <OrderRouteMap
              pickupCity={route.origin}
              deliveryCity={route.destination}
              pickupCoords={route.pickupCoords}
              deliveryCoords={route.deliveryCoords}
              pickupLabel={route.origin || "Pickup"}
              deliveryLabel={route.destination || "Delivery"}
              liveLocation={route.liveLocation || (telemetry.currentCoordinates ? {
                latitude: Number(telemetry.currentCoordinates.split(",")[0]),
                longitude: Number(telemetry.currentCoordinates.split(",")[1]),
                speed: telemetry.speedKmh || 40,
                driver_name: driver?.name || "Driver",
              } : null)}
              height="420px"
            />

            {/* Top Left Floating Telemetry Card */}
            <div className="live-radar-stats-overlay">
              <div className="live-radar-hud-ping-line">
                <span className="material-symbols-outlined text-[16px]">sensors</span>
                <span>Active GPS Ping (10s refresh)</span>
              </div>
              <div className="live-radar-stat-item">
                <strong>Coordinates:</strong> {telemetry.currentCoordinates || "GPS Active"}
              </div>
              <div className="live-radar-stat-item">
                <strong>FASTag Unit:</strong> {vehicle.fastagId || "FT-Active"}
              </div>
              <div className="live-radar-stat-item">
                <strong>Fuel Level:</strong> {vehicle.currentFuel || "Optimal (75%)"}
              </div>
            </div>

            {/* Bottom Floating Waypoint HUD */}
            <div className="live-radar-bottom-hud">
              <div className="live-radar-hud-nav-cluster">
                <span className="live-radar-hud-icon-box">
                  <span className="material-symbols-outlined text-[18px]">navigation</span>
                </span>
                <div>
                  <span className="live-radar-hud-dim">Next Corridor Waypoint</span>
                  <span className="live-radar-hud-bright">{telemetry.nextWaypoint || route.destination || "Destination Hub"}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="live-radar-hud-dim">Remaining Distance &amp; ETA</span>
                <span className="live-radar-hud-eta">
                  {telemetry.remainingKm ?? route.distanceKm ?? "--"} km • {telemetry.remainingTime || "Calculating ETA"}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Details 3-Col Grid */}
          <div className="live-radar-bottom-grid">
            <div className="live-radar-hud-card">
              <span className="live-radar-card-label">Driver &amp; Dispatch</span>
              <p className="live-radar-card-strong">{driver?.name || "Unassigned"}</p>
              <p className="live-radar-card-sub">{driver?.phone || "Awaiting driver assignment"}</p>
              <p className="live-radar-card-extra">
                Vehicle: {vehicle.number ? `${vehicle.number} (${vehicle.type || ""})` : "Unassigned"}
              </p>
            </div>

            <div className="live-radar-hud-card">
              <span className="live-radar-card-label">SLA &amp; Corridor Target</span>
              <p className="live-radar-card-sla">Status: {trip.sla || "Standard Priority"}</p>
              <p className="live-radar-card-sub">Corridor Route: {route.origin || "Pickup"} → {route.destination || "Delivery"}</p>
              <p className="live-radar-card-extra">Total Corridor Distance: {route.distanceKm || "--"} km</p>
            </div>

            <div className="live-radar-hud-card justify-between">
              <div>
                <span className="live-radar-card-label">SOS / Corridor Control</span>
                <p className="live-radar-card-sub">Emergency dispatch or corridor escalation contact:</p>
              </div>
              <button
                type="button"
                className="live-radar-btn-sos"
                onClick={() => alert(`Calling SOS Corridor Coordinator for #${trip.id}`)}
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>Contact Driver / SOS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="live-radar-modal-footer">
          <button
            type="button"
            className="live-radar-btn-close"
            onClick={onClose}
          >
            Close Radar View
          </button>
        </div>
      </div>
    </div>
  );
}

LiveTrackingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  trip: PropTypes.object,
};

export default LiveTrackingModal;
