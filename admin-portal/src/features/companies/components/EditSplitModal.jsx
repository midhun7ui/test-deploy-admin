import { useState } from "react";
import PropTypes from "prop-types";

function EditSplitModal({ isOpen, onClose, company, onSaveSplit }) {
  const [driverSplit, setDriverSplit] = useState(
    () => company?.commission?.driverSplit || 85
  );
  const [notes, setNotes] = useState(
    () =>
      company?.commission?.notes ||
      "Fuel surcharges & detention allowances pass 100% directly to assigned driver."
  );

  if (!isOpen || !company) return null;

  const platformSplit = 100 - Number(driverSplit);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCommission = {
      ...company.commission,
      driverSplit: Number(driverSplit),
      platformSplit,
      notes,
    };
    const updatedCredit = {
      ...company.credit,
      splitSummary: `${driverSplit}% Drv · ${platformSplit}% Platform`,
    };

    onSaveSplit(company.id, updatedCommission, updatedCredit);
    onClose();
  };

  return (
    <div
      className="company-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id="modal-edit-split"
    >
      <div className="company-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="company-modal-header">
          <h3 className="company-modal-title">
            Configure Payout Split Rules — {company.shortName}
          </h3>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
            id="btn-close-edit-split"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="company-modal-body">
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--comp-text-muted)" }}>
              Define the percentage breakdown between freight driver partner disbursements and HireD platform revenue margin for all completed trips billed to this corporate account.
            </p>

            {/* Split Visualizer */}
            <div
              style={{
                backgroundColor: "var(--comp-card-low)",
                borderRadius: "var(--comp-radius-md)",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "0.875rem" }}>
                <span style={{ color: "var(--comp-emerald)" }}>
                  Driver Share: {driverSplit}%
                </span>
                <span style={{ color: "var(--comp-primary)" }}>
                  HireD Margin: {platformSplit}%
                </span>
              </div>

              <div
                style={{
                  height: "0.75rem",
                  width: "100%",
                  borderRadius: "9999px",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: `${driverSplit}%`,
                    backgroundColor: "var(--comp-emerald)",
                    transition: "width 0.2s ease",
                  }}
                ></div>
                <div
                  style={{
                    width: `${platformSplit}%`,
                    backgroundColor: "var(--comp-primary)",
                    transition: "width 0.2s ease",
                  }}
                ></div>
              </div>
            </div>

            <div className="modal-form-grid">
              <div className="form-field-group">
                <label className="form-field-label">Driver Allocation Percentage (%)</label>
                <input
                  type="number"
                  className="form-field-input"
                  min={70}
                  max={95}
                  value={driverSplit}
                  onChange={(e) => setDriverSplit(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">HireD Platform Margin (%)</label>
                <input
                  type="number"
                  className="form-field-input"
                  value={platformSplit}
                  disabled
                  readOnly
                  style={{ backgroundColor: "var(--comp-card-low)", cursor: "not-allowed" }}
                />
              </div>

              <div className="form-field-group full-width">
                <label className="form-field-label">Surcharge Policy &amp; Agreement Terms</label>
                <textarea
                  className="form-field-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify fuel surcharge pass-through, loading wait-time, and toll reimbursement policies..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="company-modal-footer">
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
              id="btn-save-split-rules"
            >
              Apply Split Rules
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditSplitModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  company: PropTypes.object,
  onSaveSplit: PropTypes.func.isRequired,
};

export default EditSplitModal;
