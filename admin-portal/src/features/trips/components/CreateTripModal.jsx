import { useState } from "react";
import PropTypes from "prop-types";
import {
  ENTERPRISE_CLIENTS,
  CORRIDOR_OPTIONS,
  VEHICLE_TONNAGE_OPTIONS,
} from "../data/mockTripsData";

function CreateTripModal({ isOpen, onClose, onCreateTrip }) {
  const [formData, setFormData] = useState({
    account: ENTERPRISE_CLIENTS[0]?.name || "",
    category: "",
    origin: "",
    destination: "",
    corridor: CORRIDOR_OPTIONS[0] || "NH-48 (Delhi - Mumbai - Chennai)",
    distanceKm: "",
    tonnageCategory: "heavy",
    freightCharge: "",
    driverName: "",
    vehicleNumber: "",
  });

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      client_name: formData.account,
      origin: formData.origin,
      destination: formData.destination,
      corridor: formData.corridor,
      cargo_type: formData.category,
      tonnage:
        formData.tonnageCategory === "heavy"
          ? "Heavy Truck (20T+)"
          : formData.tonnageCategory === "medium"
          ? "Medium LCV (10T-16T)"
          : formData.tonnageCategory === "reefer"
          ? "Reefer / Cold Box"
          : "Multi-Axle Trailer",
      driver_name: formData.driverName,
      vehicle_number: formData.vehicleNumber,
      rate: formData.freightCharge,
      notes: `${formData.distanceKm} km via ${formData.corridor}`,
    };

    onCreateTrip(payload);
    onClose();
  }

  return (
    <div className="trip-modal-backdrop" onClick={onClose}>
      <div className="trip-create-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="trip-create-modal-header">
          <div className="trip-create-header-left">
            <span className="material-symbols-outlined trip-create-plus-icon">add_circle</span>
            <div>
              <h2 className="trip-create-title">Create New B2B Corridor Trip</h2>
              <p className="trip-create-sub">Enter freight booking specifications and dispatch to corridor roster</p>
            </div>
          </div>
          <button type="button" className="trip-modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="trip-create-form">
          <div className="trip-create-grid">
            <div className="trip-form-group">
              <label className="trip-form-label">Enterprise Shipper</label>
              <select
                className="trip-form-input"
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              >
                {ENTERPRISE_CLIENTS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.contractId})
                  </option>
                ))}
              </select>
            </div>

            <div className="trip-form-group">
              <label className="trip-form-label">Cargo / Freight Category</label>
              <input
                type="text"
                className="trip-form-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. FTL • Cement Bags"
                required
              />
            </div>

            <div className="trip-form-group">
              <label className="trip-form-label">Origin City</label>
              <input
                type="text"
                className="trip-form-input"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="e.g. Pune"
                required
              />
            </div>

            <div className="trip-form-group">
              <label className="trip-form-label">Destination City</label>
              <input
                type="text"
                className="trip-form-input"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g. Nashik"
                required
              />
            </div>

            <div className="trip-form-group">
              <label className="trip-form-label">Freight Corridor</label>
              <select
                className="trip-form-input"
                value={formData.corridor}
                onChange={(e) => setFormData({ ...formData, corridor: e.target.value })}
              >
                {CORRIDOR_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="trip-form-group">
              <label className="trip-form-label">Estimated Mileage (km)</label>
              <input
                type="number"
                className="trip-form-input"
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                required
              />
            </div>

            <div className="trip-form-group">
              <label className="trip-form-label">Vehicle &amp; Tonnage Type</label>
              <select
                className="trip-form-input"
                value={formData.tonnageCategory}
                onChange={(e) => setFormData({ ...formData, tonnageCategory: e.target.value })}
              >
                {VEHICLE_TONNAGE_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="trip-form-group">
              <label className="trip-form-label">Contract Freight Amount (₹)</label>
              <input
                type="number"
                className="trip-form-input"
                value={formData.freightCharge}
                onChange={(e) => setFormData({ ...formData, freightCharge: e.target.value })}
                required
              />
            </div>

            <div className="trip-form-group">
              <label className="trip-form-label">Assigned Driver</label>
              <input
                type="text"
                className="trip-form-input"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                required
              />
            </div>

            <div className="trip-form-group">
              <label className="trip-form-label">Vehicle Registration No.</label>
              <input
                type="text"
                className="trip-form-input"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                placeholder="e.g. MH-12 AB 1334"
                required
              />
            </div>
          </div>

          <div className="trip-create-actions">
            <button type="button" className="trip-btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="trip-btn-modal-submit">
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Confirm &amp; Dispatch Trip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateTrip: PropTypes.func.isRequired,
};

export default CreateTripModal;
