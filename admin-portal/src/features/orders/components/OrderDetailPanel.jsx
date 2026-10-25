import { useState } from "react";
import PropTypes from "prop-types";
import OrderRouteMap from "../../../components/map/OrderRouteMap";

/**
 * Master-Detail Inspector Panel (Right 40% column)
 * Complete implementation of the Stitch 5._orders_management design
 */
export default function OrderDetailPanel({
  order,
  onAcceptOrder,
  onRejectOrder,
  onViewTrip,
  onAddNote,
}) {
  const [activeSubtab, setActiveSubtab] = useState("info");
  const [newNoteText, setNewNoteText] = useState("");

  if (!order) {
    return (
      <aside className="order-detail-panel" aria-label="Order detail inspector">
        <div className="order-detail-card">
          <div className="order-detail-empty">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "48px", color: "var(--order-text-outline)", marginBottom: "1rem" }}
            >
              touch_app
            </span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", margin: "0 0 0.5rem" }}>
              Select an Order
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--order-text-muted)", margin: 0 }}>
              Click any order row in the register to view detailed corridor telemetry, commercials, and dispatch options.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // Format currency
  function formatINR(val) {
    if (typeof val !== "number") return val;
    return `₹${val.toLocaleString("en-IN")}`;
  }

  // Handle note submission
  function handleNoteSubmit(e) {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote?.(order.id, newNoteText.trim());
    setNewNoteText("");
  }

  const isPending = order.status === "Pending Review";
  const isAccepted = order.status === "Accepted";
  const isConverted = order.status === "Converted to Trip";
  const isRejected = order.status === "Rejected";

  return (
    <aside className="order-detail-panel" id="order-inspector-panel" aria-label="Order details inspector">
      <div className="order-detail-card">
        {/* Header Pod */}
        <div className="order-detail-header-pod">
          <div className="order-detail-header-top">
            <div>
              <div className="order-detail-title-cluster">
                <h2 className="order-detail-h2">#{order.id}</h2>
                {isPending && (
                  <span className="order-status-pill status-pending-review">Pending Review</span>
                )}
                {isAccepted && (
                  <span className="order-status-pill status-accepted">Accepted</span>
                )}
                {isConverted && (
                  <span className="order-status-pill status-converted">Converted</span>
                )}
                {isRejected && (
                  <span className="order-status-pill status-rejected">Rejected</span>
                )}
              </div>
              <div className="order-detail-created-info">
                Created on {order.createdAt} • Via {order.createdVia || "Enterprise EDI Portal"}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="order-detail-quick-actions">
              {(isPending || isAccepted) && (
                <>
                  <button
                    type="button"
                    className="order-btn-quick-reject"
                    onClick={() => onRejectOrder(order)}
                    title="Reject this order"
                    id="btn-quick-reject-order"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                      close
                    </span>
                    <span>Reject</span>
                  </button>

                  <button
                    type="button"
                    className="order-btn-quick-accept"
                    onClick={() => onAcceptOrder(order)}
                    title="Accept and allocate driver"
                    id="btn-quick-accept-order"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                      check
                    </span>
                    <span>Accept</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="order-detail-subtabs-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeSubtab === "info"}
              className={`order-subtab-btn ${activeSubtab === "info" ? "active" : ""}`}
              onClick={() => setActiveSubtab("info")}
            >
              Order Information
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSubtab === "specs"}
              className={`order-subtab-btn ${activeSubtab === "specs" ? "active" : ""}`}
              onClick={() => setActiveSubtab("specs")}
            >
              Goods &amp; Specs
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSubtab === "timeline"}
              className={`order-subtab-btn ${activeSubtab === "timeline" ? "active" : ""}`}
              onClick={() => setActiveSubtab("timeline")}
            >
              Timeline
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSubtab === "notes"}
              className={`order-subtab-btn ${activeSubtab === "notes" ? "active" : ""}`}
              onClick={() => setActiveSubtab("notes")}
            >
              Notes ({order.notes?.length || 0})
            </button>
          </div>
        </div>

        {/* Panel Body Content */}
        <div className="order-detail-body">
          {/* TAB 1: Order Information */}
          {activeSubtab === "info" && (
            <>
              {/* 1. Company Partner Card */}
              <div className="order-company-card">
                <div className="order-company-left">
                  <div className="order-company-avatar-pod">
                    {order.companyInitials || order.company?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="order-company-details">
                    <div className="order-company-name-row">
                      <span className="order-company-full-name">{order.company}</span>
                      {order.isKycVerified && (
                        <span
                          className="material-symbols-outlined order-verified-icon"
                          title="KYC Verified Enterprise"
                        >
                          verified
                        </span>
                      )}
                    </div>
                    <span className="order-company-contact-txt">
                      {order.contactPerson} • {order.contactPhone}
                    </span>
                    <span className="order-company-tax-txt">
                      {order.contactEmail} • GSTIN: {order.gstin}
                    </span>
                  </div>
                </div>

                <span className="order-b2b-account-badge">
                  {order.accountCategory || "B2B Account"}
                </span>
              </div>

              {/* 2. Route & Map Visual Card */}
              <div className="order-route-card">
                <div className="order-route-locations-wrapper">
                  {/* Pickup */}
                  <div className="order-waypoint-row">
                    <span className="material-symbols-outlined order-waypoint-icon-pickup">
                      radio_button_checked
                    </span>
                    <div className="order-waypoint-texts">
                      <span className="order-waypoint-label">Pickup Location</span>
                      <span className="order-waypoint-address">{order.route?.pickupAddress}</span>
                      <span className="order-waypoint-time">
                        Expected: {order.route?.pickupSchedule}
                      </span>
                    </div>
                  </div>

                  {/* Distance Connector */}
                  <div className="order-route-connector-line">
                    <span className="order-distance-badge">
                      Distance: {order.route?.distanceKm} km • Est. Duration:{" "}
                      {order.route?.durationHours}
                    </span>
                  </div>

                  {/* Delivery */}
                  <div className="order-waypoint-row">
                    <span className="material-symbols-outlined order-waypoint-icon-delivery">
                      location_on
                    </span>
                    <div className="order-waypoint-texts">
                      <span className="order-waypoint-label">Delivery Location</span>
                      <span className="order-waypoint-address">{order.route?.deliveryAddress}</span>
                      <span className="order-waypoint-time">
                        Target Delivery: {order.route?.deliverySchedule}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Map Visual with Connected Route & Live Driver Tracking */}
                <div style={{ marginTop: "1rem" }}>
                  <OrderRouteMap
                    pickupCity={order.route?.origin}
                    deliveryCity={order.route?.destination}
                    pickupCoords={order.route?.pickupCoords}
                    deliveryCoords={order.route?.deliveryCoords}
                    pickupLabel={order.route?.origin || "Pickup"}
                    deliveryLabel={order.route?.destination || "Delivery"}
                    liveLocation={order.route?.liveLocation}
                    height="280px"
                  />
                </div>
              </div>

              {/* 3. Specifications & Cargo Grid (2 equal columns) */}
              <div className="order-specs-grid">
                <div className="order-spec-card">
                  <div>
                    <span className="order-spec-heading">Cargo Specs</span>
                    <span className="order-spec-value-bold">{order.cargo?.title}</span>
                    <span className="order-spec-desc">{order.cargo?.details}</span>
                  </div>
                  <span
                    className={`order-spec-tag ${
                      order.cargo?.isHazardous ? "tag-fleet-nearby" : "tag-non-hazardous"
                    }`}
                  >
                    {order.cargo?.isHazardous ? "Hazardous Cargo" : "Non-Hazardous"}
                  </span>
                </div>

                <div className="order-spec-card">
                  <div>
                    <span className="order-spec-heading">Vehicle Required</span>
                    <span className="order-spec-value-bold">
                      {order.vehicle?.registration_number
                        ? `${order.vehicle.registration_number} (${order.vehicle.type})`
                        : order.vehicle?.type}
                    </span>
                    <span className="order-spec-desc">
                      {order.vehicle?.capacity_tonnes
                        ? `Capacity: ${order.vehicle.capacity_tonnes}T • ${order.vehicle?.bodyType}`
                        : order.vehicle?.bodyType}
                    </span>
                    {order.vehicle?.photo_url && (
                      <div style={{ marginTop: "6px" }}>
                        <a
                          href={order.vehicle.photo_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            color: "#2563eb",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                            image
                          </span>
                          View Truck Photo
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="order-spec-tag tag-fleet-nearby">
                    {order.vehicle?.status ? `Status: ${order.vehicle.status}` : `Fleet: ${order.vehicle?.nearbyAvailable ?? 3} Nearby`}
                  </span>
                </div>
              </div>

              {/* 4. Commercials & Payment Terms */}
              <div className="order-commercials-card">
                <div className="order-commercials-left">
                  <span className="order-commercials-heading">Agreed Commercials</span>
                  <div className="order-commercials-amount-row">
                    <span className="order-commercials-price">
                      {formatINR(order.commercials?.amount)}
                    </span>
                    <span className="order-commercials-tax-txt">
                      ({order.commercials?.taxNote || "Tax Incl. 18% GST"})
                    </span>
                  </div>
                  <span className="order-commercials-terms-txt">
                    Terms: {order.commercials?.paymentTerms}
                  </span>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span className="order-verified-quote-badge">
                    {order.commercials?.verifiedQuotation ? "Verified Quotation" : "Standard Quote"}
                  </span>
                </div>
              </div>

              {/* 5. Special Dock Instructions */}
              {order.specialInstructions && (
                <div className="order-instructions-box">
                  <span className="material-symbols-outlined order-instructions-icon">
                    warning
                  </span>
                  <div className="order-instructions-texts">
                    <span className="order-instructions-title">Special Dock Instructions</span>
                    <p className="order-instructions-content">
                      &quot;{order.specialInstructions}&quot;
                    </p>
                  </div>
                </div>
              )}

              {/* 6. Context Flow Reference Card */}
              <div className="order-contract-ref-card">
                <div className="order-contract-icon-box">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="order-contract-texts">
                  <span className="order-contract-name">HireD Unified Ops Flow Reference</span>
                  <span className="order-contract-id">
                    Contract ID: #{order.contract?.id || "CNT-2026-DEFAULT"} •{" "}
                    {order.contract?.slaTier || "SLA Tier 1 Guarantee"}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Goods & Specs */}
          {activeSubtab === "specs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="order-spec-card">
                <span className="order-spec-heading">Weight &amp; Packaging Specs</span>
                <span className="order-spec-value-bold" style={{ fontSize: "1rem" }}>
                  {order.cargo?.weightTons} Metric Tons
                </span>
                <span className="order-spec-desc">{order.cargo?.details}</span>
              </div>

              <div className="order-specs-grid">
                <div className="order-spec-card">
                  <span className="order-spec-heading">E-Way Bill Ref</span>
                  <span className="order-spec-value-bold">
                    {order.contract?.eWayBill || "EWB-PENDING"}
                  </span>
                  <span className="order-spec-desc">Government GST Portal Verified</span>
                </div>

                <div className="order-spec-card">
                  <span className="order-spec-heading">Insurance SLA</span>
                  <span className="order-spec-value-bold">Transit Cover Active</span>
                  <span className="order-spec-desc">Up to ₹50,00,000 Comprehensive</span>
                </div>
              </div>

              <div className="order-instructions-box">
                <span className="material-symbols-outlined order-instructions-icon">info</span>
                <div className="order-instructions-texts">
                  <span className="order-instructions-title">Loading Bay Guidelines</span>
                  <p className="order-instructions-content">
                    Dock requires hydraulic tail-lift or standard forklift clearance. Minimum ground
                    clearance 350mm required for high ramp entry.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Timeline */}
          {activeSubtab === "timeline" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {(order.timeline || []).map((step, idx) => (
                <div
                  key={step.id || idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    backgroundColor: "var(--order-surface-low)",
                    borderRadius: "8px",
                    border: "1px solid var(--order-surface-high)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "18px",
                      color: "var(--order-primary)",
                      marginTop: "2px",
                    }}
                  >
                    check_circle
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: "700",
                        color: "var(--order-text-main)",
                      }}
                    >
                      {step.title}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--order-text-muted)" }}>
                      {step.time} • By {step.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Notes */}
          {activeSubtab === "notes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {(order.notes || []).map((note) => (
                  <div
                    key={note.id}
                    style={{
                      padding: "0.85rem 1rem",
                      backgroundColor: "var(--order-surface-low)",
                      borderRadius: "8px",
                      border: "1px solid var(--order-surface-high)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.35rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          color: "var(--order-text-main)",
                        }}
                      >
                        {note.author}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--order-text-outline)" }}>
                        {note.time}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.785rem",
                        color: "var(--order-text-muted)",
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Note Input */}
              <form
                onSubmit={handleNoteSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <textarea
                  className="order-form-textarea"
                  placeholder="Add an internal operations note..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  style={{ minHeight: "60px" }}
                />
                <button
                  type="submit"
                  className="order-btn-primary"
                  style={{ alignSelf: "flex-end", height: "34px", padding: "0 1rem" }}
                  disabled={!newNoteText.trim()}
                >
                  Post Note
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="order-detail-footer-actions">
          {isPending && (
            <>
              <button
                type="button"
                className="order-btn-accept-trip"
                onClick={() => onAcceptOrder(order)}
                id="btn-footer-accept-trip"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  check_circle
                </span>
                <span>✓ Accept &amp; Create Trip</span>
              </button>

              <button
                type="button"
                className="order-btn-reject-footer"
                onClick={() => onRejectOrder(order)}
                id="btn-footer-reject-order"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  cancel
                </span>
                <span>✕ Reject Order</span>
              </button>
            </>
          )}

          {isAccepted && (
            <>
              <button
                type="button"
                className="order-btn-accept-trip"
                onClick={() => onAcceptOrder(order)}
                id="btn-footer-dispatch-driver"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  local_shipping
                </span>
                <span>Assign Driver &amp; Dispatch Trip</span>
              </button>

              <button
                type="button"
                className="order-btn-reject-footer"
                onClick={() => onRejectOrder(order)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  cancel
                </span>
                <span>Cancel Order</span>
              </button>
            </>
          )}

          {isConverted && (
            <button
              type="button"
              className="order-btn-accept-trip"
              style={{ backgroundColor: "var(--order-primary)" }}
              onClick={() => onViewTrip?.(order.convertedTripId || order.id)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                open_in_new
              </span>
              <span>View Connected Trip ({order.convertedTripId || "TRP-LIVE"})</span>
            </button>
          )}

          {isRejected && (
            <button
              type="button"
              className="order-btn-accept-trip"
              style={{ backgroundColor: "var(--order-tertiary)" }}
              onClick={() => onAcceptOrder(order)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                restore
              </span>
              <span>Reopen &amp; Re-evaluate Order</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

OrderDetailPanel.propTypes = {
  order: PropTypes.object,
  onAcceptOrder: PropTypes.func.isRequired,
  onRejectOrder: PropTypes.func.isRequired,
  onViewTrip: PropTypes.func,
  onAddNote: PropTypes.func,
};
