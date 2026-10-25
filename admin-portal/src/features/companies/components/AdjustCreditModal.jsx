import { useState } from "react";
import PropTypes from "prop-types";

function AdjustCreditModal({ isOpen, onClose, company, onSaveCredit }) {
  const [newLimit, setNewLimit] = useState(() => company?.credit?.limit || 1500000);
  const [terms, setTerms] = useState(() => company?.credit?.terms || "Net 30 Days");
  const [securityDeposit, setSecurityDeposit] = useState(
    () => company?.credit?.securityDeposit || 500000
  );
  const [depositType, setDepositType] = useState(
    () => company?.credit?.depositType || "Bank Guarantee on file"
  );
  const [remarks, setRemarks] = useState("");

  if (!isOpen || !company) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCredit = {
      ...company.credit,
      limit: Number(newLimit),
      limitDisplay: `₹${(Number(newLimit) / 100000).toFixed(1)}L`,
      terms,
      securityDeposit: Number(securityDeposit),
      depositType,
      utilizationRate: Number(
        ((company.credit.used / Number(newLimit)) * 100).toFixed(1)
      ),
      remainingDisplay: `₹${(Number(newLimit) - company.credit.used).toLocaleString("en-IN")}`,
    };

    onSaveCredit(company.id, updatedCredit, remarks);
    onClose();
  };

  return (
    <div
      className="company-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id="modal-adjust-credit"
    >
      <div className="company-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="company-modal-header">
          <h3 className="company-modal-title">
            Adjust Contractual Credit Limit — {company.shortName}
          </h3>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
            id="btn-close-adjust-credit"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="company-modal-body">
            {/* Snapshot Box */}
            <div
              style={{
                backgroundColor: "var(--comp-card-low)",
                padding: "0.85rem 1rem",
                borderRadius: "var(--comp-radius-md)",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.5rem",
              }}
            >
              <div>
                <span style={{ fontSize: "0.6875rem", color: "var(--comp-outline)" }}>
                  Current Limit
                </span>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                  {company.credit.limitDisplay}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.6875rem", color: "var(--comp-outline)" }}>
                  Utilised to Date
                </span>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--comp-primary)" }}>
                  {company.credit.usedDisplay}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.6875rem", color: "var(--comp-outline)" }}>
                  Overdue Balance
                </span>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: company.credit.overdueBalance > 0 ? "var(--comp-danger)" : "var(--comp-emerald)" }}>
                  ₹{company.credit.overdueBalance.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="modal-form-grid">
              <div className="form-field-group">
                <label className="form-field-label">New Approved Credit Limit (INR) *</label>
                <input
                  type="number"
                  className="form-field-input"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  step={50000}
                  min={100000}
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Payment Terms Cycle</label>
                <select
                  className="form-field-select"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                >
                  <option value="Net 15 Days">Net 15 Days</option>
                  <option value="Net 30 Days">Net 30 Days</option>
                  <option value="Net 45 Days">Net 45 Days</option>
                  <option value="Net 60 Days">Net 60 Days</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Security Deposit Amount (INR)</label>
                <input
                  type="number"
                  className="form-field-input"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  step={25000}
                  min={0}
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Deposit Guarantee Instrument</label>
                <select
                  className="form-field-select"
                  value={depositType}
                  onChange={(e) => setDepositType(e.target.value)}
                >
                  <option value="Bank Guarantee on file">Bank Guarantee on file</option>
                  <option value="Fixed Deposit Pledge">Fixed Deposit Pledge</option>
                  <option value="Corporate Bank Guarantee">Corporate Bank Guarantee</option>
                  <option value="Cash Collateral Escrow">Cash Collateral Escrow</option>
                </select>
              </div>

              <div className="form-field-group full-width">
                <label className="form-field-label">Approval Justification &amp; Audit Remarks</label>
                <textarea
                  className="form-field-textarea"
                  placeholder="State operational grounds for credit limit extension or terms revision..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
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
              id="btn-save-adjust-credit"
            >
              Save Credit Revision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AdjustCreditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  company: PropTypes.object,
  onSaveCredit: PropTypes.func.isRequired,
};

export default AdjustCreditModal;
