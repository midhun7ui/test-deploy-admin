import { useState } from "react";
import PropTypes from "prop-types";

/**
 * FlagDiscrepancyModal - Modal for flagging a statement discrepancy and holding dispatch
 */
export default function FlagDiscrepancyModal({ isOpen, statement, onClose, onSubmitFlag }) {
  const [reasonCategory, setReasonCategory] = useState("missing_pod");
  const [notes, setNotes] = useState("");
  const [holdDispatch, setHoldDispatch] = useState(true);

  if (!isOpen || !statement) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFlag({
      statementId: statement.id,
      reasonCategory,
      notes,
      holdDispatch,
    });
    onClose();
  };

  return (
    <div className="stmt-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="stmt-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px" }}
      >
        <div className="stmt-modal-header">
          <div>
            <h3 className="stmt-modal-title">Lock &amp; Flag Discrepancy</h3>
            <p className="stmt-modal-sub">
              Pause automatic dispatch for {statement.statementNumber} ({statement.entity.name}).
            </p>
          </div>
          <button
            type="button"
            className="stmt-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="stmt-modal-form">
          <div className="stmt-form-field">
            <label htmlFor="stmt-flag-reason" className="stmt-form-label">
              Discrepancy Reason Category *
            </label>
            <select
              id="stmt-flag-reason"
              className="stmt-form-select"
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              required
            >
              <option value="missing_pod">Consignee Physical e-POD Seal / Signature Missing</option>
              <option value="unmatched_utr">Unmatched Bank UTR Remittance</option>
              <option value="demurrage_hold">Disputed Loading / Unloading Detention Claim</option>
              <option value="toll_discrepancy">FASTag / Toll Route Mismatch</option>
              <option value="rate_hold">Contracted Trip Tariff Revision in Progress</option>
            </select>
          </div>

          <div className="stmt-form-field">
            <label htmlFor="stmt-flag-notes" className="stmt-form-label">
              Audit Notes for Finance / Ops Lead *
            </label>
            <textarea
              id="stmt-flag-notes"
              className="stmt-form-textarea"
              rows="3"
              placeholder="State the trip references or ledger lines requiring audit reconciliation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              id="stmt-hold-dispatch"
              type="checkbox"
              className="stmt-checkbox"
              checked={holdDispatch}
              onChange={(e) => setHoldDispatch(e.target.checked)}
            />
            <label htmlFor="stmt-hold-dispatch" style={{ fontSize: "0.8125rem", color: "var(--stmt-text)", cursor: "pointer" }}>
              Suppress automated WhatsApp and Email dispatch triggers
            </label>
          </div>

          <div className="stmt-modal-footer">
            <button
              type="button"
              className="stmt-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="stmt-btn-danger"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>flag</span>
              Lock &amp; Flag Statement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

FlagDiscrepancyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  statement: PropTypes.shape({
    id: PropTypes.string,
    statementNumber: PropTypes.string,
    entity: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  onSubmitFlag: PropTypes.func.isRequired,
};
