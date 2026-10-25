import { useState } from "react";
import PropTypes from "prop-types";
import { LEAD_SOURCES, OPS_OWNERS } from "../data/mockEnquiriesData";

function AddEnquiryModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    company: "",
    contactPerson: "",
    phone: "",
    email: "",
    origin: "",
    destination: "",
    numericVolume: 100000,
    source: "Website",
    status: "New",
    priority: "Medium",
    ownerId: "unassigned",
    vehicleRequirement: "16-Ton Taurus",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.origin.trim()) newErrors.origin = "Origin city is required";
    if (!formData.destination.trim()) newErrors.destination = "Destination city is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const assignedOwner =
      formData.ownerId === "unassigned"
        ? null
        : OPS_OWNERS.find((o) => o.id === formData.ownerId) || null;

    const formattedVolume = `₹${Number(formData.numericVolume).toLocaleString("en-IN")} / mo`;
    const newEnquiry = {
      id: `ENQ-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
      company: formData.company.trim(),
      contactPerson: formData.contactPerson.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || `${formData.contactPerson.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
      route: `${formData.origin.trim()} → ${formData.destination.trim()}`,
      expectedVolume: formattedVolume,
      numericVolume: Number(formData.numericVolume) || 0,
      source: formData.source,
      status: formData.status,
      priority: formData.priority,
      owner: assignedOwner,
      lastUpdate: "Just now",
      createdAt: "Today, Just now",
      notes: formData.notes.trim() || "Inbound enquiry captured via admin operations desk.",
      vehicleRequirement: formData.vehicleRequirement,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          title: "Enquiry Registered",
          desc: `Created manually by Ops Admin for ${formData.company}.`,
          timestamp: "Just now",
          author: "Admin Ops",
        },
      ],
    };

    onSave(newEnquiry);
    onClose();
  }

  return (
    <div className="enquiry-modal-backdrop" onClick={onClose}>
      <div
        className="enquiry-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-enquiry-title"
      >
        {/* Modal Header */}
        <div className="modal-header-band">
          <div className="modal-title-pod">
            <span className="material-symbols-outlined modal-header-icon">add_circle</span>
            <div>
              <h3 id="add-enquiry-title" className="modal-main-heading">
                Add New B2B Enquiry
              </h3>
              <p className="modal-sub-heading">
                Capture inbound enterprise lead into pipeline register
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="modal-form-content">
          <div className="form-grid-2cols">
            {/* Company Name */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="company-name">
                Company Name <span className="req-star">*</span>
              </label>
              <input
                id="company-name"
                type="text"
                className={`form-text-input ${errors.company ? "input-error" : ""}`}
                placeholder="e.g. Acme Industrial Cements"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
              />
              {errors.company && <span className="field-err-msg">{errors.company}</span>}
            </div>

            {/* Contact Person */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="contact-person">
                Contact Person <span className="req-star">*</span>
              </label>
              <input
                id="contact-person"
                type="text"
                className={`form-text-input ${errors.contactPerson ? "input-error" : ""}`}
                placeholder="e.g. Ramesh Kumar"
                value={formData.contactPerson}
                onChange={(e) => handleChange("contactPerson", e.target.value)}
              />
              {errors.contactPerson && (
                <span className="field-err-msg">{errors.contactPerson}</span>
              )}
            </div>

            {/* Phone */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="contact-phone">
                Phone Number <span className="req-star">*</span>
              </label>
              <input
                id="contact-phone"
                type="text"
                className={`form-text-input ${errors.phone ? "input-error" : ""}`}
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              {errors.phone && <span className="field-err-msg">{errors.phone}</span>}
            </div>

            {/* Email */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="contact-email">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                className="form-text-input"
                placeholder="procurement@acme.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            {/* Origin City */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="origin-city">
                Origin City / Hub <span className="req-star">*</span>
              </label>
              <input
                id="origin-city"
                type="text"
                className={`form-text-input ${errors.origin ? "input-error" : ""}`}
                placeholder="e.g. Hyderabad"
                value={formData.origin}
                onChange={(e) => handleChange("origin", e.target.value)}
              />
              {errors.origin && <span className="field-err-msg">{errors.origin}</span>}
            </div>

            {/* Destination City */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="destination-city">
                Destination City / Hub <span className="req-star">*</span>
              </label>
              <input
                id="destination-city"
                type="text"
                className={`form-text-input ${errors.destination ? "input-error" : ""}`}
                placeholder="e.g. Warangal"
                value={formData.destination}
                onChange={(e) => handleChange("destination", e.target.value)}
              />
              {errors.destination && (
                <span className="field-err-msg">{errors.destination}</span>
              )}
            </div>

            {/* Expected Monthly Volume */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="expected-volume">
                Expected Monthly Volume (₹)
              </label>
              <input
                id="expected-volume"
                type="number"
                step="5000"
                className="form-text-input"
                value={formData.numericVolume}
                onChange={(e) => handleChange("numericVolume", e.target.value)}
              />
            </div>

            {/* Lead Source */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="lead-source">
                Lead Source
              </label>
              <select
                id="lead-source"
                className="form-select-input"
                value={formData.source}
                onChange={(e) => handleChange("source", e.target.value)}
              >
                {LEAD_SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="lead-priority">
                Priority Level
              </label>
              <select
                id="lead-priority"
                className="form-select-input"
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* Assign Ops Owner */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="lead-owner">
                Assign Ops Owner
              </label>
              <select
                id="lead-owner"
                className="form-select-input"
                value={formData.ownerId}
                onChange={(e) => handleChange("ownerId", e.target.value)}
              >
                {OPS_OWNERS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Requirement */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="vehicle-req">
                Vehicle Type / Fleet Spec
              </label>
              <input
                id="vehicle-req"
                type="text"
                className="form-text-input"
                placeholder="e.g. 16-Ton Taurus, Closed Box Container"
                value={formData.vehicleRequirement}
                onChange={(e) => handleChange("vehicleRequirement", e.target.value)}
              />
            </div>

            {/* Initial Status */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="initial-status">
                Initial Pipeline Status
              </label>
              <select
                id="initial-status"
                className="form-select-input"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="New">● New</option>
                <option value="Contacted">● Contacted</option>
                <option value="Qualified">● Qualified</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-field-group full-width">
            <label className="form-label" htmlFor="operational-notes">
              Operational Requirements & Freight Notes
            </label>
            <textarea
              id="operational-notes"
              rows={3}
              className="form-textarea-input"
              placeholder="Provide cargo specifications, handling requirements, or delivery schedule expectations..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          {/* Footer Actions */}
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
              className="btn-modal-submit"
              id="btn-save-new-enquiry"
            >
              <span className="material-symbols-outlined">check</span>
              <span>Register Enquiry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddEnquiryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddEnquiryModal;
