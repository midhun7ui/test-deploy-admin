import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Create New Transport Order Modal
 * Enables booking a fresh enterprise order directly from operations control
 */
export default function CreateOrderModal({ isOpen, onClose, onCreateOrder }) {
  const [formData, setFormData] = useState({
    company: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    gstin: "",
    origin: "",
    destination: "",
    pickupAddress: "",
    pickupSchedule: "",
    deliveryAddress: "",
    deliverySchedule: "",
    distanceKm: "",
    durationHours: "",
    vehicleType: "20T Taurus (10-Tyre)",
    cargoTitle: "",
    cargoWeight: "",
    cargoDetails: "",
    cargoClassification: "Industrial",
    amount: "",
    specialInstructions: "",
  });

  if (!isOpen) return null;

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onCreateOrder(formData);
  }

  return (
    <div className="order-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="order-modal-card"
        style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="order-modal-header">
          <div className="order-modal-header-left">
            <div className="order-modal-icon">
              <span className="material-symbols-outlined">add_circle</span>
            </div>
            <div>
              <h3 className="order-modal-title">Create Transport Order</h3>
              <p className="order-modal-sub">
                Book a new enterprise freight consignment for operations review &amp; dispatch
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

        <form onSubmit={handleSubmit}>
          <div className="order-modal-body">
            {/* Enterprise Client Info */}
            <div className="order-form-row-2col">
              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-company-name">
                  Client Company <span className="req">*</span>
                </label>
                <input
                  id="input-company-name"
                  type="text"
                  className="order-form-input"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="e.g. Apex Logistics Ltd"
                  required
                />
              </div>

              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-contact-person">
                  Contact Person &amp; Phone
                </label>
                <input
                  id="input-contact-person"
                  type="text"
                  className="order-form-input"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                  placeholder="e.g. Arjun Verma (+91 98230 45678)"
                />
              </div>
            </div>

            {/* Route Origin & Destination */}
            <div className="order-form-row-2col">
              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-origin-city">
                  Origin City / Hub <span className="req">*</span>
                </label>
                <input
                  id="input-origin-city"
                  type="text"
                  className="order-form-input"
                  value={formData.origin}
                  onChange={(e) => handleChange("origin", e.target.value)}
                  placeholder="e.g. Pune MIDC"
                  required
                />
              </div>

              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-dest-city">
                  Destination City / Hub <span className="req">*</span>
                </label>
                <input
                  id="input-dest-city"
                  type="text"
                  className="order-form-input"
                  value={formData.destination}
                  onChange={(e) => handleChange("destination", e.target.value)}
                  placeholder="e.g. Bengaluru Peenya"
                  required
                />
              </div>
            </div>

            {/* Detailed Addresses */}
            <div className="order-form-row-2col">
              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-pickup-addr">
                  Pickup Address &amp; Schedule
                </label>
                <input
                  id="input-pickup-addr"
                  type="text"
                  className="order-form-input"
                  value={formData.pickupAddress}
                  onChange={(e) => handleChange("pickupAddress", e.target.value)}
                  placeholder="e.g. Plot 18, Chakan Phase 2"
                />
              </div>

              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-delivery-addr">
                  Delivery Address &amp; Schedule
                </label>
                <input
                  id="input-delivery-addr"
                  type="text"
                  className="order-form-input"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleChange("deliveryAddress", e.target.value)}
                  placeholder="e.g. Gate 4, Peenya Industrial Complex"
                />
              </div>
            </div>

            {/* Vehicle & Cargo Specs */}
            <div className="order-form-row-2col">
              <div className="order-form-group">
                <label className="order-form-label" htmlFor="select-vehicle-req">
                  Vehicle Type Required <span className="req">*</span>
                </label>
                <select
                  id="select-vehicle-req"
                  className="order-form-select"
                  value={formData.vehicleType}
                  onChange={(e) => handleChange("vehicleType", e.target.value)}
                >
                  <option value="20T Taurus (10-Tyre)">20T Taurus (10-Tyre)</option>
                  <option value="32T Multi-Axle Trailer">32T Multi-Axle Trailer</option>
                  <option value="Reefer 14ft (Temperature Controlled)">Reefer 14ft (-4°C to +4°C)</option>
                  <option value="LCV 14ft (Open Body)">LCV 14ft (Open Body)</option>
                </select>
              </div>

              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-cargo-tonnage">
                  Weight (Metric Tons) &amp; Classification
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    id="input-cargo-tonnage"
                    type="number"
                    className="order-form-input"
                    style={{ width: "90px" }}
                    value={formData.cargoWeight}
                    onChange={(e) => handleChange("cargoWeight", e.target.value)}
                    placeholder="e.g. 20"
                  />
                  <select
                    className="order-form-select"
                    value={formData.cargoClassification}
                    onChange={(e) => handleChange("cargoClassification", e.target.value)}
                  >
                    <option value="Industrial">Industrial</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Pharma">Pharma</option>
                    <option value="FMCG">FMCG</option>
                    <option value="Bulk Heavy">Bulk Heavy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Commercials Quote */}
            <div className="order-form-row-2col">
              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-freight-amount">
                  Agreed Freight Commercials (₹) <span className="req">*</span>
                </label>
                <input
                  id="input-freight-amount"
                  type="number"
                  className="order-form-input"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  placeholder="e.g. 65000"
                  required
                />
              </div>

              <div className="order-form-group">
                <label className="order-form-label" htmlFor="input-distance-km">
                  Corridor Distance (km)
                </label>
                <input
                  id="input-distance-km"
                  type="number"
                  className="order-form-input"
                  value={formData.distanceKm}
                  onChange={(e) => handleChange("distanceKm", e.target.value)}
                  placeholder="e.g. 840"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div className="order-form-group">
              <label className="order-form-label" htmlFor="input-special-inst">
                Special Loading / Dock Instructions
              </label>
              <textarea
                id="input-special-inst"
                className="order-form-textarea"
                value={formData.specialInstructions}
                onChange={(e) => handleChange("specialInstructions", e.target.value)}
                placeholder="e.g. Air-suspension vehicle required. Pre-dispatch inspection required."
              />
            </div>
          </div>

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
              id="btn-confirm-create-order"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                add_circle
              </span>
              <span>Create Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateOrderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateOrder: PropTypes.func.isRequired,
};
