import { useState } from "react";
import PropTypes from "prop-types";

/**
 * GenerateStatementRunModal - Modal for executing automated statement compilation run
 */
export default function GenerateStatementRunModal({ isOpen, onClose, onExecuteRun }) {
  const [cycle, setCycle] = useState("Oct 2026 (F1: 01-15 Oct)");
  const [scope, setScope] = useState("all");
  const [includeDrafts, setIncludeDrafts] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onExecuteRun({ cycle, scope, includeDrafts });
    onClose();
  };

  return (
    <div className="stmt-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="stmt-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "560px" }}
      >
        <div className="stmt-modal-header">
          <div>
            <h3 className="stmt-modal-title">Generate Statement Run</h3>
            <p className="stmt-modal-sub">
              Aggregate closed trips, debit notes, and bank remittances into final partner ledgers.
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
            <label htmlFor="stmt-run-cycle" className="stmt-form-label">
              Billing Settlement Cycle *
            </label>
            <select
              id="stmt-run-cycle"
              className="stmt-form-select"
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              required
            >
              <option value="Oct 2026 (F1: 01-15 Oct)">Oct 2026 (Fortnightly F1: 01–15 Oct)</option>
              <option value="Oct 2026 (F2: 16-31 Oct)">Oct 2026 (Fortnightly F2: 16–31 Oct)</option>
              <option value="Sep 2026 (F2: 16-30 Sep)">Sep 2026 (Fortnightly F2: 16–30 Sep)</option>
            </select>
          </div>

          <div className="stmt-form-field">
            <label htmlFor="stmt-run-scope" className="stmt-form-label">
              Partner Entity Scope *
            </label>
            <select
              id="stmt-run-scope"
              className="stmt-form-select"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              required
            >
              <option value="all">All Partners (Enterprise B2B Clients + Fleet Operators)</option>
              <option value="b2b">Enterprise B2B Clients Only</option>
              <option value="fleet">Registered Fleet Operators Only</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
            <input
              id="stmt-include-drafts"
              type="checkbox"
              className="stmt-checkbox"
              checked={includeDrafts}
              onChange={(e) => setIncludeDrafts(e.target.checked)}
            />
            <label htmlFor="stmt-include-drafts" style={{ fontSize: "0.8125rem", color: "var(--stmt-text)", cursor: "pointer" }}>
              Enforce 100% digital e-POD verification check prior to statement dispatch
            </label>
          </div>

          <div
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "var(--stmt-card-low)",
              borderRadius: "8px",
              fontSize: "0.75rem",
              color: "var(--stmt-text-muted)",
              lineHeight: 1.45,
            }}
          >
            <strong>Note:</strong> Generating statements will automatically calculate GST Rule 47 debits, apply active credit adjustments, and stage WhatsApp &amp; Email triggers.
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
              className="stmt-btn-primary"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>post_add</span>
              Execute Statement Run
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

GenerateStatementRunModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExecuteRun: PropTypes.func.isRequired,
};
