import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ordersApi } from "../../orders/services/ordersApi";

function ConvertTripModal({ isOpen, onClose, enquiry, onConvert }) {
  const [tripAmount, setTripAmount] = useState(() => {
    return enquiry?.numericVolume ? Math.round(enquiry.numericVolume / 4) : 48000;
  });
  const [vehicleType, setVehicleType] = useState(() => {
    return enquiry?.vehicleRequirement || "16-Ton Taurus";
  });
  const [driverSharePct, setDriverSharePct] = useState(30);
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [cargoType, setCargoType] = useState("General Industrial Cargo");
  const [generatedTripId] = useState(() => `TRP-${3025 + Math.floor(Math.random() * 50)}`);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");

  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      ordersApi
        .getDriversPool()
        .then((data) => {
          if (isMounted && Array.isArray(data)) {
            setDrivers(data);
          }
        })
        .catch(() => {});
      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  if (!isOpen || !enquiry) return null;

  const platformSharePct = 100 - Number(driverSharePct);
  const driverShareAmount = Math.round((Number(tripAmount) * Number(driverSharePct)) / 100);
  const platformShareAmount = Number(tripAmount) - driverShareAmount;

  function handleConfirm(e) {
    e.preventDefault();
    onConvert({
      enquiryId: enquiry.id,
      tripId: generatedTripId,
      tripAmount: Number(tripAmount),
      driverSharePct: Number(driverSharePct),
      platformSharePct,
      driverShareAmount,
      platformShareAmount,
      vehicleType,
      pickupDate,
      cargoType,
      driver_id: selectedDriverId ? Number(selectedDriverId) : null,
    });
    onClose();
  }

  return (
    <div className="enquiry-modal-backdrop" onClick={onClose}>
      <div
        className="enquiry-modal-card convert-trip-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="convert-trip-title"
      >
        {/* Header */}
        <div className="modal-header-band convert-header-band">
          <div className="modal-title-pod">
            <span className="material-symbols-outlined modal-header-icon convert-icon">
              sync_alt
            </span>
            <div>
              <h3 id="convert-trip-title" className="modal-main-heading">
                Convert Enquiry to Live Trip
              </h3>
              <p className="modal-sub-heading">
                Initialize B2B corridor dispatch & commercial split
              </p>
            </div>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Lead Reference Card */}
        <div className="lead-summary-pill-box">
          <div className="lead-summary-item">
            <span className="summary-key">COMPANY</span>
            <strong className="summary-val">{enquiry.company}</strong>
          </div>
          <div className="lead-summary-item">
            <span className="summary-key">ROUTE</span>
            <strong className="summary-val">{enquiry.route}</strong>
          </div>
          <div className="lead-summary-item">
            <span className="summary-key">ESTIMATED VALUE</span>
            <strong className="summary-val volume-highlight">{enquiry.expectedVolume}</strong>
          </div>
          <div className="lead-summary-item">
            <span className="summary-key">CONTACT</span>
            <span className="summary-val">{enquiry.contactPerson} ({enquiry.phone})</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirm} className="modal-form-content">
          <div className="form-grid-2cols">
            {/* Generated Trip Code */}
            <div className="form-field-group">
              <label className="form-label">Assigned Trip ID</label>
              <input
                type="text"
                disabled
                className="form-text-input disabled-input"
                value={generatedTripId}
              />
            </div>

            {/* Scheduled Pickup Date */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="pickup-date">
                Pickup Date <span className="req-star">*</span>
              </label>
              <input
                id="pickup-date"
                type="date"
                className="form-text-input"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </div>

            {/* Agreed Trip Amount */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="agreed-amount">
                Confirmed Trip Amount (₹) <span className="req-star">*</span>
              </label>
              <input
                id="agreed-amount"
                type="number"
                step="500"
                className="form-text-input"
                value={tripAmount}
                onChange={(e) => setTripAmount(Number(e.target.value))}
                required
              />
            </div>

            {/* Vehicle Type */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="select-vehicle">
                Vehicle Type
              </label>
              <select
                id="select-vehicle"
                className="form-select-input"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="16-Ton Taurus">16-Ton Taurus (10 Wheeler)</option>
                <option value="24-Ton Multi-Axle">24-Ton Multi-Axle Container</option>
                <option value="32-Ton Heavy Trailer">32-Ton Heavy Trailer</option>
                <option value="Refrigerated Reefer (-18°C)">Refrigerated Reefer (-18°C)</option>
                <option value="Eicher Pro 3019 (10 Ton)">Eicher Pro 3019 (10 Ton)</option>
                <option value="Closed Box Truck (14 Ton)">Closed Box Truck (14 Ton)</option>
              </select>
            </div>

            {/* Cargo Type */}
            <div className="form-field-group full-width">
              <label className="form-label" htmlFor="cargo-type">
                Cargo Classification & Packaging
              </label>
              <input
                id="cargo-type"
                type="text"
                className="form-text-input"
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
                placeholder="e.g. Bulk Cement Bags, Auto Parts on Pallets"
              />
            </div>

            {/* Driver Allocation */}
            <div className="form-field-group full-width">
              <label className="form-label" htmlFor="select-driver">
                Allocate Driver (Optional)
              </label>
              <select
                id="select-driver"
                className="form-select-input"
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
              >
                <option value="">Unassigned (Allocate Later)</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.phone ? `(${d.phone})` : ""} — {d.vehicleNumber || d.vehicleType || "Driver"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Revenue Split Card (PRD v0.2 Aligned) */}
          <div className="commercial-split-box">
            <div className="split-box-header">
              <span className="material-symbols-outlined split-info-icon">payments</span>
              <strong className="split-title">Revenue & Payout Split (PRD v0.2 §5.4)</strong>
            </div>

            <div className="split-slider-row">
              <div className="slider-label-row">
                <span>Driver Share: <strong>{driverSharePct}%</strong></span>
                <span>Platform Margin: <strong>{platformSharePct}%</strong></span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={driverSharePct}
                onChange={(e) => setDriverSharePct(Number(e.target.value))}
                className="split-range-slider"
              />
            </div>

            <div className="split-breakdown-cards">
              <div className="split-breakdown-card driver-cut">
                <span className="split-sub-label">Driver Wallet Credit</span>
                <strong className="split-amount-val">
                  ₹{driverShareAmount.toLocaleString("en-IN")}
                </strong>
                <span className="split-pct-pill">{driverSharePct}%</span>
              </div>

              <div className="split-breakdown-card platform-cut">
                <span className="split-sub-label">HireD Platform Revenue</span>
                <strong className="split-amount-val">
                  ₹{platformShareAmount.toLocaleString("en-IN")}
                </strong>
                <span className="split-pct-pill">{platformSharePct}%</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-footer-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-convert-confirm"
              id="btn-confirm-convert-trip"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              <span>Confirm & Dispatch Trip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ConvertTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  enquiry: PropTypes.object,
  onConvert: PropTypes.func.isRequired,
};

export default ConvertTripModal;
