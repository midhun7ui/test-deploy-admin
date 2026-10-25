import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Add New Driver Modal
 * Registers a new fleet operator into the HireD operations registry
 */
export default function AddDriverModal({ isOpen, onClose, onAddDriver }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "+91 ",
    email: "",
    corridor: "Western Dedicated Corridor (MH-GJ)",
    dlNumber: "",
    dlExpiry: "",
    aadhaarNumber: "",
    vehicleNumber: "",
    vehicleType: "20T Multi-Axle",
    emergencyPhone: "+91 ",
    emergencyRelation: "Spouse",
  });

  if (!isOpen) return null;

  function handleChange(field, val) {
    setFormData((prev) => ({ ...prev, [field]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddDriver({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      corridor: formData.corridor,
      dlNumber: formData.dlNumber.trim(),
      dlExpiry: formData.dlExpiry.trim(),
      aadhaarNumber: formData.aadhaarNumber.trim(),
      vehicleNumber: formData.vehicleNumber.trim(),
      vehicleType: formData.vehicleType,
      emergencyPhone: formData.emergencyPhone.trim(),
      emergencyRelation: formData.emergencyRelation.trim(),
    });
  }

  return (
    <div className="driver-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="driver-modal-card"
        style={{ maxWidth: "660px", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="driver-modal-header">
          <div className="driver-modal-header-left">
            <div className="driver-modal-icon-pod">
              <span className="material-symbols-outlined">person_add</span>
            </div>
            <div>
              <h3 className="driver-modal-title">Onboard New Fleet Driver</h3>
              <p className="driver-modal-subtitle">
                Register driver profile, commercial license credentials, and assigned vehicle
              </p>
            </div>
          </div>
          <button
            type="button"
            className="driver-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="driver-modal-body">
            {/* Personal Details */}
            <div className="driver-form-row-2col">
              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="input-drv-name">
                  Driver Full Name <span className="req">*</span>
                </label>
                <input
                  id="input-drv-name"
                  type="text"
                  className="driver-form-input"
                  placeholder="e.g. Anand K. Shinde"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="input-drv-phone">
                  Mobile Number (WhatsApp Enabled) <span className="req">*</span>
                </label>
                <input
                  id="input-drv-phone"
                  type="text"
                  className="driver-form-input"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="driver-form-row-2col">
              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="input-drv-email">
                  Email Address
                </label>
                <input
                  id="input-drv-email"
                  type="email"
                  className="driver-form-input"
                  placeholder="driver@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="select-drv-corridor">
                  Primary Freight Corridor <span className="req">*</span>
                </label>
                <select
                  id="select-drv-corridor"
                  className="driver-form-select"
                  value={formData.corridor}
                  onChange={(e) => handleChange("corridor", e.target.value)}
                >
                  <option value="Western Dedicated Corridor (MH-GJ)">Western Dedicated Corridor (MH-GJ)</option>
                  <option value="North Central Belt (DL-HR-UP)">North Central Belt (DL-HR-UP)</option>
                  <option value="Southern Coastal Express (KA-TN)">Southern Coastal Express (KA-TN)</option>
                </select>
              </div>
            </div>

            {/* License & Aadhaar */}
            <div className="driver-form-row-2col">
              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="input-drv-dl">
                  Commercial Driving License (Heavy) <span className="req">*</span>
                </label>
                <input
                  id="input-drv-dl"
                  type="text"
                  className="driver-form-input"
                  placeholder="e.g. MH12 2021008819"
                  value={formData.dlNumber}
                  onChange={(e) => handleChange("dlNumber", e.target.value)}
                  required
                />
              </div>

              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="input-drv-aadhaar">
                  Aadhaar Card UID (12 digits) <span className="req">*</span>
                </label>
                <input
                  id="input-drv-aadhaar"
                  type="text"
                  className="driver-form-input"
                  placeholder="XXXX-XXXX-1234"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleChange("aadhaarNumber", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Vehicle Assignment */}
            <div className="driver-form-row-2col">
              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="input-drv-veh-no">
                  Assigned Vehicle Plate Number
                </label>
                <input
                  id="input-drv-veh-no"
                  type="text"
                  className="driver-form-input"
                  placeholder="e.g. MH-12 AB 9942"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleChange("vehicleNumber", e.target.value)}
                />
              </div>

              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="select-drv-veh-type">
                  Vehicle Fleet Classification
                </label>
                <select
                  id="select-drv-veh-type"
                  className="driver-form-select"
                  value={formData.vehicleType}
                  onChange={(e) => handleChange("vehicleType", e.target.value)}
                >
                  <option value="20T Multi-Axle">20T Multi-Axle (Taurus)</option>
                  <option value="32T Trailer XL">32T Trailer XL (Multi-Axle)</option>
                  <option value="16T Closed Container">16T Closed Container</option>
                  <option value="10T Flatbed">10T Flatbed</option>
                  <option value="Reefer 14ft (-4°C)">Reefer 14ft (-4°C Cold Box)</option>
                </select>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="driver-form-row-2col">
              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="input-drv-emg-phone">
                  Emergency Contact Phone <span className="req">*</span>
                </label>
                <input
                  id="input-drv-emg-phone"
                  type="text"
                  className="driver-form-input"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                  required
                />
              </div>

              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="input-drv-emg-rel">
                  Relationship to Driver
                </label>
                <input
                  id="input-drv-emg-rel"
                  type="text"
                  className="driver-form-input"
                  placeholder="Spouse / Father / Brother"
                  value={formData.emergencyRelation}
                  onChange={(e) => handleChange("emergencyRelation", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="driver-modal-actions">
            <button
              type="button"
              className="driver-btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="driver-btn-modal-submit"
              id="btn-confirm-add-driver"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                person_add
              </span>
              <span>Submit &amp; Queue KYC Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddDriverModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddDriver: PropTypes.func.isRequired,
};
