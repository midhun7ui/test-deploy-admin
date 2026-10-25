import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AVAILABLE_DRIVERS_POOL } from "../data/mockOrdersData";
import { ordersApi } from "../services/ordersApi";

/**
 * Accept Order & Dispatch Trip Modal
 * Features the clean, spacious 2-column driver card layout with radio buttons,
 * bold ETA indicators, separated text lines, and immediate trip generation.
 */
export default function AcceptOrderModal({ isOpen, order, onClose, onConfirmAccept }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [departureSchedule, setDepartureSchedule] = useState("Immediate (Within 45 mins)");
  const [tollTagActive, setTollTagActive] = useState(true);
  const [opsRemarks, setOpsRemarks] = useState("");
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      setLoadingDrivers(true);
      ordersApi
        .getDriversPool()
        .then((data) => {
          if (isMounted && Array.isArray(data)) {
            setDrivers(data);
            setSelectedDriverId(data[0]?.id || "");
          }
        })
        .catch(() => {
          if (isMounted) {
            setDrivers([]);
            setSelectedDriverId("");
          }
        })
        .finally(() => {
          if (isMounted) setLoadingDrivers(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const assignedDriver = drivers.find((d) => d.id === selectedDriverId);
    if (!assignedDriver) return;
    onConfirmAccept({
      orderId: order.id,
      driver: assignedDriver,
      departureSchedule,
      tollTagActive,
      opsRemarks,
    });
  }

  return (
    <div className="order-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="order-modal-card"
        style={{ maxWidth: "680px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="order-modal-header">
          <div className="order-modal-header-left">
            <div className="order-modal-icon">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <div>
              <h3 className="order-modal-title">Accept Order &amp; Allocate Driver</h3>
              <p className="order-modal-sub">
                Order #{order.id} • {order.company || order.partner || "Enterprise Partner"} (
                {typeof order.route === "object"
                  ? `${order.route?.origin || "Origin"} → ${order.route?.destination || "Destination"}`
                  : (order.route || "Corridor Transit")}
                )
              </p>
            </div>
          </div>
          <button
            type="button"
            className="order-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="order-modal-body">
            {/* Quick Order Snapshot */}
            <div
              style={{
                padding: "0.85rem 1rem",
                backgroundColor: "var(--order-surface-low)",
                borderRadius: "10px",
                border: "1px solid var(--order-surface-high)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--order-text-outline)",
                  }}
                >
                  Order Freight Specs
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "700",
                    color: "var(--order-text-main)",
                  }}
                >
                  {order.cargo?.title || order.cargo || order.weight || "General Freight"} • {order.vehicle?.type || order.vehicleType || "Commercial Fleet"}
                </span>
                <span style={{ fontSize: "0.725rem", color: "var(--order-text-muted)" }}>
                  {order.route?.distanceKm ? `Distance: ${order.route.distanceKm} km • ` : ""}Quoted: {typeof order.commercials?.amount === "number" ? `₹${order.commercials.amount.toLocaleString("en-IN")}` : (order.quoteAmount || "₹48,000")}
                </span>
              </div>
              <span className="order-verified-quote-badge">
                SLA Tier 1
              </span>
            </div>

            {/* Driver Assignment Section: Clean 2-Column Grid */}
            <div className="driver-assign-section">
              <div className="driver-assign-header">
                <span className="driver-assign-title">Select Online Fleet Driver</span>
                <span className="driver-assign-subtitle">
                  {drivers.length} online drivers ready in corridor
                </span>
              </div>

              {loadingDrivers ? (
                <div className="py-6 text-center text-body-sm text-on-surface-variant flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  <span>Loading online fleet drivers...</span>
                </div>
              ) : drivers.length === 0 ? (
                <div className="py-6 px-4 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-outline-variant rounded-lg bg-surface-container-lowest my-2">
                  <span className="material-symbols-outlined text-[32px] text-amber-500">wifi_off</span>
                  <p className="font-medium text-body-md text-on-surface">No Online Drivers Available</p>
                  <p className="text-body-xs text-on-surface-variant max-w-sm">
                    Only verified commercial drivers who are currently ONLINE in their mobile driver app can be assigned to orders. Drivers can toggle their status to Online from their app dashboard.
                  </p>
                </div>
              ) : (
                <div className="driver-assign-grid">
                  {drivers.map((driver) => {
                    const isDriverSelected = selectedDriverId === driver.id;

                    return (
                      <label
                        key={driver.id}
                        className={`driver-assign-card ${isDriverSelected ? "selected" : ""}`}
                        htmlFor={`driver-opt-${driver.id}`}
                      >
                        <input
                          type="radio"
                          name="assignedDriver"
                          id={`driver-opt-${driver.id}`}
                          value={driver.id}
                          checked={isDriverSelected}
                          onChange={() => setSelectedDriverId(driver.id)}
                          className="driver-radio-input"
                        />

                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="driver-card-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name || "Driver")}&background=1e293b&color=ffffff&bold=true`;
                          }}
                        />

                        <div className="driver-card-content">
                          <div className="driver-card-top-row">
                            <span className="driver-card-name" title={driver.name}>
                              {driver.name}
                            </span>
                            <span className="driver-rating-badge">
                              ★ {driver.rating}
                            </span>
                          </div>

                          <div className="driver-card-specs">
                            <span className="driver-card-truck">{driver.vehicleType}</span>
                            <span className="driver-card-plate">{driver.vehicleNumber}</span>
                          </div>

                          <div className="driver-card-bottom-row">
                            <span className="driver-card-location">
                              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                near_me
                              </span>
                              {driver.currentLocation ? driver.currentLocation.split(" (")[0] : "Regional Hub"}
                            </span>
                            <span className="driver-eta-pill">
                              ETA: {driver.etaMinutes || 15} mins
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Additional Dispatch Parameters */}
            <div className="order-form-row-2col">
              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-dispatch-schedule">
                  Loading Bay Arrival Window
                </label>
                <select
                  id="input-dispatch-schedule"
                  className="order-form-select"
                  value={departureSchedule}
                  onChange={(e) => setDepartureSchedule(e.target.value)}
                >
                  <option value="Immediate (Within 45 mins)">Immediate (Within 45 mins)</option>
                  <option value="Tomorrow Early Morning (06:00 AM - 08:00 AM)">
                    Tomorrow Early Morning (06:00 AM - 08:00 AM)
                  </option>
                  <option value="Scheduled per Client SLA">Scheduled per Client SLA</option>
                </select>
              </div>

              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-fastag-toll">
                  Corridor Toll Allocation
                </label>
                <select
                  id="input-fastag-toll"
                  className="order-form-select"
                  value={tollTagActive ? "active" : "manual"}
                  onChange={(e) => setTollTagActive(e.target.value === "active")}
                >
                  <option value="active">Fastag Corporate Wallet (Auto-Debit)</option>
                  <option value="manual">Driver Manual Reimbursement</option>
                </select>
              </div>
            </div>

            <div className="order-form-group">
              <label className="order-form-label" htmlFor="input-ops-remarks">
                Ops Dispatch Remarks / Driver Instructions
              </label>
              <textarea
                id="input-ops-remarks"
                className="order-form-textarea"
                placeholder="Special notes to driver regarding loading dock pass, PPE safety kits, or security clearances..."
                value={opsRemarks}
                onChange={(e) => setOpsRemarks(e.target.value)}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="order-modal-actions" style={{ padding: "1rem 1.5rem" }}>
            <button
              type="button"
              className="order-btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="order-btn-modal-submit"
              id="btn-confirm-accept-dispatch"
              disabled={!selectedDriverId || drivers.length === 0}
              style={{
                opacity: !selectedDriverId || drivers.length === 0 ? 0.5 : 1,
                cursor: !selectedDriverId || drivers.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                check_circle
              </span>
              <span>Accept &amp; Create B2B Trip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AcceptOrderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  order: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onConfirmAccept: PropTypes.func.isRequired,
};
