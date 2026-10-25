import { useState } from "react";
import PropTypes from "prop-types";

/**
 * RequestRevisionModal - Modal dialog for rejecting / requesting revision on an invoice draft
 */
export default function RequestRevisionModal({
  isOpen,
  invoice,
  onClose,
  onSubmitRevision,
}) {
  const [reasonCategory, setReasonCategory] = useState("detention_dispute");
  const [notes, setNotes] = useState("");

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitRevision({
      invoiceId: invoice.id,
      reasonCategory,
      notes,
    });
    onClose();
  };

  return (
    <div className="inv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="inv-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px" }}
      >
        <div className="inv-modal-header">
          <div className="inv-modal-title-group">
            <h3 className="inv-modal-title">Request Invoice Revision</h3>
            <p className="inv-modal-sub">
              Reject Step 2 approval for {invoice.invoiceNumber} ({invoice.account.shortName}) and send back to Ops Admin.
            </p>
          </div>
          <button
            type="button"
            className="inv-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="inv-modal-form">
          <div className="inv-form-field">
            <label htmlFor="inv-revision-reason" className="inv-form-label">
              Revision Reason Category *
            </label>
            <select
              id="inv-revision-reason"
              className="inv-form-select"
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              required
            >
              <option value="detention_dispute">Disputed Loading / Detention Charges</option>
              <option value="missing_pod">Missing Physical POD Stamp / Receiver Signature</option>
              <option value="toll_discrepancy">FASTag / Toll Surcharge Discrepancy</option>
              <option value="gstin_adjustment">Incorrect GSTIN or Billing Entity Name</option>
              <option value="client_request">Client Requested Billing Period Shift</option>
            </select>
          </div>

          <div className="inv-form-field">
            <label htmlFor="inv-revision-notes" className="inv-form-label">
              Audit Notes for Operations Admin *
            </label>
            <textarea
              id="inv-revision-notes"
              className="inv-form-textarea"
              rows="3"
              placeholder="Specify the trip numbers or charge discrepancies requiring recalculation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
          </div>

          <div className="inv-revision-alert-box">
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--inv-danger)" }}>
              warning
            </span>
            <span>
              This will reset the status to <strong>Draft (Revision Required)</strong> and notify the batch creator.
            </span>
          </div>

          <div className="inv-modal-footer">
            <button
              type="button"
              className="inv-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inv-btn-danger"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>reply</span>
              Send Back for Revision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

RequestRevisionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  invoice: PropTypes.shape({
    id: PropTypes.string,
    invoiceNumber: PropTypes.string,
    account: PropTypes.shape({
      shortName: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  onSubmitRevision: PropTypes.func.isRequired,
};
