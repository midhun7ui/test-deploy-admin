import { useState } from "react";
import PropTypes from "prop-types";

export default function AddCorridorNodeModal({ isOpen, onClose, onAddHub }) {
  const [hubName, setHubName] = useState("");
  const [hubCode, setHubCode] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hubName.trim()) return;
    onAddHub({
      id: `hub-${Date.now()}`,
      name: hubName.trim(),
      code: (hubCode.trim() || hubName.trim().slice(0, 3)).toUpperCase(),
    });
    setHubName("");
    setHubCode("");
    onClose();
  };

  return (
    <div
      className="settings-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="settings-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px", color: "var(--settings-primary)" }}
            >
              alt_route
            </span>
            <h3 className="settings-modal-title">Add Regional Corridor Node</h3>
          </div>
          <button
            type="button"
            className="settings-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="settings-form-group">
            <label className="settings-label" htmlFor="new-hub-name">
              Hub Node Name
            </label>
            <input
              id="new-hub-name"
              type="text"
              className="settings-input"
              placeholder="e.g. Central Hub (Hyderabad / Nagpur)"
              value={hubName}
              onChange={(e) => setHubName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="new-hub-code">
              Corridor Hub Code
            </label>
            <input
              id="new-hub-code"
              type="text"
              className="settings-input mono"
              placeholder="e.g. CH-HYD"
              value={hubCode}
              onChange={(e) => setHubCode(e.target.value)}
            />
            <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
              Used in trip waybills and freight routing prefixes
            </span>
          </div>

          <div className="settings-modal-actions">
            <button
              type="button"
              className="settings-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="settings-btn-primary"
              id="btn-confirm-add-hub"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                add
              </span>
              <span>Register Node</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddCorridorNodeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddHub: PropTypes.func.isRequired,
};
