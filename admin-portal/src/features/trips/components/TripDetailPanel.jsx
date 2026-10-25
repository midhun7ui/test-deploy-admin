import { useState } from "react";
import PropTypes from "prop-types";
import StartSelfieModal from "./StartSelfieModal";
import OrderRouteMap from "../../../components/map/OrderRouteMap";

function TripDetailPanel({
  trip,
  onTrackLive,
  onMarkDelivered,
  onCancelTrip,
  onAssignDriver,
}) {
  const [activeSubtab, setActiveSubtab] = useState("overview");
  const [isSelfieModalOpen, setIsSelfieModalOpen] = useState(false);

  if (!trip) {
    return (
      <div className="trip-detail-card trip-detail-empty">
        <span className="material-symbols-outlined text-4xl text-outline">local_shipping</span>
        <p className="font-semibold text-on-surface mt-2">No Trip Selected</p>
        <p className="text-body-sm text-on-surface-variant">
          Click any trip from the register table to inspect live corridor telemetry and driver status.
        </p>
      </div>
    );
  }

  const subtabs = [
    { id: "overview", label: "Overview" },
    { id: "route_map", label: "Route & Map" },
    { id: "expenses", label: "Expenses" },
    { id: "timeline", label: "Timeline" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <div className="trip-detail-card" id={`trip-detail-panel-${trip.id}`}>
      {/* Live Trip Details Header */}
      <div className="trip-detail-header-pod">
        <div className="trip-detail-header-top">
          <div className="trip-detail-title-cluster">
            <span className="trip-detail-label">Trip Details</span>
            <span className="trip-detail-code">#{trip.id}</span>
          </div>
          <span
            className={`trip-detail-status-pill ${
              trip.status === "In Transit"
                ? "pill-in-transit"
                : trip.status === "Delivered"
                ? "pill-delivered"
                : trip.status === "Awaiting Driver"
                ? "pill-awaiting-driver"
                : trip.status === "Delayed"
                ? "pill-delayed"
                : trip.status === "Scheduled"
                ? "pill-scheduled"
                : "pill-at-pickup"
            }`}
          >
            {trip.status}
          </span>
        </div>

        <div className="trip-detail-header-bottom">
          <span className="trip-detail-started-info">
            <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
            {trip.startedAt?.startsWith("Scheduled") ? trip.startedAt : `Started: ${trip.startedAt}`}
          </span>
          <button
            type="button"
            className="trip-btn-track-live-header"
            onClick={() => onTrackLive(trip)}
            title="Launch full telemetry HUD modal"
          >
            <span className="material-symbols-outlined text-[15px]">my_location</span>
            <span>Track Live</span>
          </button>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="trip-detail-subtabs-bar">
        {subtabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`trip-detail-subtab-btn ${
              activeSubtab === tab.id ? "subtab-active" : "subtab-inactive"
            }`}
            onClick={() => setActiveSubtab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Detail Content Container */}
      <div className="trip-detail-body">
        {activeSubtab === "overview" && (
          <div className="trip-overview-content">
            {/* 1. Company & Account Overview */}
            <div className="trip-company-box">
              <div className="trip-company-left">
                <div className="trip-company-icon-pod">
                  <span className="material-symbols-outlined text-[20px]">factory</span>
                </div>
                <div className="trip-company-texts">
                  <span className="trip-company-name">{trip.account}</span>
                  <span className="trip-company-sub">{trip.accountType}</span>
                </div>
              </div>
              <button
                type="button"
                className="trip-company-external-btn"
                title="View partner account ledger"
                onClick={() => alert(`Opening Partner Account: ${trip.account} (Contract ${trip.contractId})`)}
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            </div>

            {/* 2. Assigned Fleet Resource */}
            <div className="trip-resource-section">
              <span className="trip-section-heading">Assigned Fleet Resource</span>
              {trip.driver ? (
                <div className="trip-driver-card">
                  <div className="trip-driver-profile">
                    <div className="trip-driver-avatar-pod">
                      <img
                        src={trip.driver.avatar}
                        alt={trip.driver.name}
                        className="trip-driver-avatar-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(trip.driver.name || "Driver")}&background=1e293b&color=ffffff&bold=true`;
                        }}
                      />
                      <span className="trip-driver-check-badge">
                        <span className="material-symbols-outlined text-[10px] text-white">check</span>
                      </span>
                    </div>
                    <div className="trip-driver-meta">
                      <div className="trip-driver-name-row">
                        <span className="trip-driver-full-name">{trip.driver.name}</span>
                        <span className="trip-driver-rating-badge">{trip.driver.rating} ★</span>
                      </div>
                      <span className="trip-driver-phone-txt">{trip.driver.phone}</span>
                    </div>
                  </div>
                  <div className="trip-vehicle-meta-right">
                    <span className="trip-vehicle-number-bold">{trip.vehicle.number}</span>
                    <span className="trip-vehicle-type-sub">{trip.vehicle.type}</span>
                  </div>
                </div>
              ) : (
                <div className="trip-unassigned-card">
                  <div className="trip-unassigned-texts">
                    <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                    <div>
                      <p className="font-semibold text-error">No Driver Assigned</p>
                      <p className="text-body-sm text-on-surface-variant">
                        Driver cancelled prior to corridor dispatch.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="trip-btn-reassign-urgent"
                    onClick={() => onAssignDriver(trip)}
                  >
                    Assign Driver Now
                  </button>
                </div>
              )}
            </div>

            {/* 3. Live Route Tracking Map Snippet */}
            <div className="trip-telemetry-section">
              <div className="trip-telemetry-header">
                <span className="trip-section-heading">Live Route Telemetry</span>
                <span className="trip-telemetry-status-badge">
                  <span className="trip-telemetry-pulse-dot"></span>
                  {trip.telemetry?.statusText || "Active Corridor"}
                </span>
              </div>

              <div
                className="trip-map-container"
                onClick={() => onTrackLive(trip)}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                }}
                title="Click to open full Live Telemetry Radar HUD"
              >
                <OrderRouteMap
                  pickupCity={trip.route?.origin}
                  deliveryCity={trip.route?.destination}
                  pickupCoords={trip.route?.pickupCoords}
                  deliveryCoords={trip.route?.deliveryCoords}
                  pickupLabel={trip.route?.origin || "Pickup"}
                  deliveryLabel={trip.route?.destination || "Delivery"}
                  liveLocation={trip.route?.liveLocation}
                  height="190px"
                  interactive={false}
                />

                {/* Map Telemetry HUD Overlay */}
                <div className="trip-map-hud-overlay">
                  <div className="trip-hud-left">
                    <span className="trip-hud-nav-icon">
                      <span className="material-symbols-outlined text-[16px]">navigation</span>
                    </span>
                    <div className="trip-hud-waypoint-info">
                      <span className="trip-hud-small-title">Next Waypoint</span>
                      <span className="trip-hud-waypoint-name">
                        {trip.telemetry?.nextWaypoint || trip.route?.destination || "Destination Dock"}
                      </span>
                    </div>
                  </div>
                  <div className="trip-hud-right">
                    <span className="trip-hud-small-title">Remaining</span>
                    <span className="trip-hud-remaining-stat">
                      {trip.telemetry?.remainingKm ?? trip.route?.distanceKm ?? "--"} km ({trip.telemetry?.remainingTime || "Calculating"})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Verification Checkpoints: Start Selfie & Delivery OTP */}
            <div className="trip-verification-grid">
              <div
                className="trip-verify-card clickable"
                onClick={() => setIsSelfieModalOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsSelfieModalOpen(true);
                  }
                }}
                title="Click to inspect driver departure selfie and pre-trip verification dossier"
              >
                <div className="trip-verify-thumbnail-wrapper">
                  {trip.verification?.startSelfieUrl ? (
                    <img
                      src={trip.verification.startSelfieUrl}
                      alt="Driver Start Selfie"
                      className="trip-verify-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="trip-verify-no-img">
                      <span className="material-symbols-outlined text-[20px] text-outline">photo_camera</span>
                    </div>
                  )}
                  <div className="trip-verify-zoom-hint" title="Inspect selfie">
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>zoom_in</span>
                  </div>
                </div>

                <div className="trip-verify-info">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="trip-verify-title">Start Selfie</span>
                    <span
                      style={{
                        fontSize: "0.625rem",
                        color: "#7c3aed",
                        background: "#ede9fe",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        fontWeight: 700,
                      }}
                    >
                      View
                    </span>
                  </div>
                  <span className="trip-verify-subtitle">
                    {trip.verification.startSelfieVerified
                      ? `Verified ${trip.verification.startSelfieTime}`
                      : "Pending Verification"}
                  </span>
                  {trip.verification.startGeoTagged && (
                    <span className="trip-verify-tag">
                      <span className="material-symbols-outlined text-[12px]">verified</span> Geo-tagged
                    </span>
                  )}
                </div>
              </div>

              <div className="trip-verify-otp-card">
                <div className="trip-otp-top-row">
                  <span className="trip-otp-label">Delivery OTP</span>
                  <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
                </div>
                <div className="trip-otp-bottom-row">
                  <span className="trip-otp-code">{trip.verification.deliveryOtp}</span>
                  <span
                    className={`trip-otp-status ${
                      trip.verification.otpStatus === "Verified" ? "otp-status-verified" : "otp-status-pending"
                    }`}
                  >
                    {trip.verification.otpStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Trip Execution Timeline Stepper */}
            <div className="trip-timeline-section">
              <span className="trip-section-heading">Trip Execution Timeline</span>
              <div className="trip-timeline-box">
                {trip.timeline.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={`trip-timeline-step-row ${
                        item.completed ? "step-is-completed" : ""
                      } ${item.active ? "step-is-active" : ""}`}
                    >
                      {/* Step Circle */}
                      <div
                        className={`trip-step-circle ${
                          item.completed
                            ? "step-circle-completed"
                            : item.isAlert
                            ? "step-circle-alert"
                            : "step-circle-active"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {item.completed
                            ? "done"
                            : item.isAlert
                            ? "warning"
                            : "local_shipping"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="trip-step-content-row">
                        <div className="trip-step-texts">
                          <span
                            className={`trip-step-title ${
                              item.active ? "text-primary font-bold" : "text-on-surface font-semibold"
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="trip-step-desc">{item.desc}</span>
                        </div>
                        <span
                          className={`trip-step-time ${
                            item.active ? "text-primary font-bold" : "text-outline"
                          }`}
                        >
                          {item.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. Trip Action CTAs */}
            <div className="trip-action-ctas-row">
              <button
                type="button"
                className="trip-btn-deliver-primary"
                onClick={() => onMarkDelivered(trip)}
                disabled={trip.status === "Delivered"}
              >
                <span className="material-symbols-outlined text-[18px]">task_alt</span>
                <span>{trip.status === "Delivered" ? "Delivered & Signed" : "Mark As Delivered"}</span>
              </button>
              <button
                type="button"
                className="trip-btn-cancel-danger"
                onClick={() => onCancelTrip(trip)}
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                <span>Cancel Trip</span>
              </button>
            </div>
          </div>
        )}

        {/* Route & Map Tab */}
        {activeSubtab === "route_map" && (
          <div className="trip-subtab-pane">
            <div style={{ marginBottom: "1rem", borderRadius: "14px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
              <OrderRouteMap
                pickupCity={trip.route?.origin}
                deliveryCity={trip.route?.destination}
                pickupCoords={trip.route?.pickupCoords}
                deliveryCoords={trip.route?.deliveryCoords}
                pickupLabel={trip.route?.origin || "Pickup"}
                deliveryLabel={trip.route?.destination || "Delivery"}
                liveLocation={trip.route?.liveLocation}
                height="300px"
              />
            </div>
            <div className="trip-subtab-card">
              <div className="trip-subtab-card-header">
                <span className="trip-subtab-card-title">Corridor Navigation</span>
                <span className="trip-subtab-card-badge">{trip.route?.corridor || "Freight Corridor"}</span>
              </div>
              <div className="trip-subtab-info-list">
                <div className="trip-subtab-info-item">
                  <span className="trip-subtab-info-label">Pickup Location:</span>
                  <span className="trip-subtab-info-val">{trip.route?.pickupAddress || trip.route?.origin}</span>
                </div>
                <div className="trip-subtab-info-item">
                  <span className="trip-subtab-info-label">Destination Dock:</span>
                  <span className="trip-subtab-info-val">{trip.route?.deliveryAddress || trip.route?.destination}</span>
                </div>
                <div className="trip-subtab-info-item">
                  <span className="trip-subtab-info-label">Live GPS Coordinates:</span>
                  <span className="trip-subtab-info-val font-mono">{trip.telemetry?.currentCoordinates || "GPS Active"}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="trip-btn-open-radar"
              onClick={() => onTrackLive(trip)}
            >
              <span className="material-symbols-outlined text-[18px]">radar</span>
              <span>Open Full Telemetry Radar Map</span>
            </button>
          </div>
        )}

        {/* Expenses Tab */}
        {activeSubtab === "expenses" && (
          <div className="trip-subtab-pane">
            <div className="trip-subtab-card">
              <div className="trip-subtab-card-header">
                <span className="trip-subtab-card-title">Corridor Freight Ledger</span>
                <span className="trip-subtab-card-badge">Contract #{trip.contractId}</span>
              </div>
              <div className="trip-ledger-list">
                <div className="trip-ledger-item">
                  <span>Contract Freight Charge</span>
                  <strong className="trip-ledger-val-highlight">₹{trip.expenses?.freightCharge?.toLocaleString("en-IN")}</strong>
                </div>
                <div className="trip-ledger-item">
                  <span>Diesel Advance / Fuel</span>
                  <span>₹{trip.expenses?.dieselAllowance?.toLocaleString("en-IN")}</span>
                </div>
                <div className="trip-ledger-item">
                  <span>Corridor FASTag Tolls</span>
                  <span>₹{trip.expenses?.tollCharges?.toLocaleString("en-IN")}</span>
                </div>
                <div className="trip-ledger-item">
                  <span>Driver Corridor Allowance (Bata)</span>
                  <span>₹{trip.expenses?.driverBata?.toLocaleString("en-IN")}</span>
                </div>
                <div className="trip-ledger-item trip-ledger-platform-fee">
                  <span>HireD Platform Fee (PRD v0.2)</span>
                  <span>₹{trip.expenses?.platformFee?.toLocaleString("en-IN")}</span>
                </div>
                <div className="trip-ledger-total">
                  <span>Net Driver Settlement</span>
                  <span className="trip-ledger-total-amt">₹{trip.expenses?.netDriverPayout?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeSubtab === "timeline" && (
          <div className="trip-subtab-pane">
            <div className="trip-subtab-card">
              <div className="trip-subtab-card-header">
                <span className="trip-subtab-card-title">Full Telemetry Event Log</span>
              </div>
              <div className="trip-full-log-list">
                {trip.timeline.map((step) => (
                  <div key={step.id} className="trip-full-log-item">
                    <div className="trip-full-log-bullet"></div>
                    <div className="trip-full-log-content">
                      <div className="trip-full-log-title-row">
                        <span className="trip-full-log-title">{step.title}</span>
                        <span className="trip-full-log-time">{step.time}</span>
                      </div>
                      <span className="trip-full-log-desc">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeSubtab === "documents" && (
          <div className="trip-subtab-pane">
            <div className="trip-subtab-card">
              <div className="trip-subtab-card-header">
                <span className="trip-subtab-card-title">Verified Freight Documents</span>
              </div>
              <div className="trip-docs-list">
                {trip.documents?.map((doc, idx) => (
                  <div key={idx} className="trip-doc-item">
                    <div className="trip-doc-left">
                      <div className="trip-doc-icon-pod">
                        <span className="material-symbols-outlined text-[18px]">
                          {doc.type === "PDF" ? "picture_as_pdf" : "image"}
                        </span>
                      </div>
                      <span className="trip-doc-name">{doc.name}</span>
                    </div>
                    <span className="trip-doc-size">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Start Selfie & Pre-Trip Inspection Dossier Modal */}
      <StartSelfieModal
        isOpen={isSelfieModalOpen}
        onClose={() => setIsSelfieModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}

TripDetailPanel.propTypes = {
  trip: PropTypes.object,
  onTrackLive: PropTypes.func.isRequired,
  onMarkDelivered: PropTypes.func.isRequired,
  onCancelTrip: PropTypes.func.isRequired,
  onAssignDriver: PropTypes.func.isRequired,
};

export default TripDetailPanel;
