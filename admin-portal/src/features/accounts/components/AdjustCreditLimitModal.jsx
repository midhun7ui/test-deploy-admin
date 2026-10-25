/**
 * AdjustCreditLimitModal Component
 * Dialog to revise Sanctioned Credit Limits, Terms, and Bank Guarantee details
 * Modeled after Stitch reference: 8._accounts_credit
 */

import { useState } from "react";

export default function AdjustCreditLimitModal({ account, isOpen, onClose, onSave }) {
  const [creditLimit, setCreditLimit] = useState(() => account?.creditLimit || 1500000);
  const [terms, setTerms] = useState(() => account?.terms || "Net 30");
  const [bankGuarantee, setBankGuarantee] = useState(() => account?.bankGuarantee || 500000);
  const [guaranteeRef, setGuaranteeRef] = useState(() => account?.guaranteeRef || "HDFC #BG-9921");
  const [notes, setNotes] = useState("");

  if (!isOpen || !account) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...account,
      creditLimit: Number(creditLimit),
      creditLimitDisplay: `₹${Number(creditLimit).toLocaleString("en-IN")}`,
      terms,
      bankGuarantee: Number(bankGuarantee),
      bankGuaranteeDisplay: `₹${Number(bankGuarantee).toLocaleString("en-IN")}`,
      guaranteeRef,
      availableBuffer: Number(creditLimit) - account.outstanding,
      availableBufferDisplay:
        Number(creditLimit) - account.outstanding >= 0
          ? `₹${(Number(creditLimit) - account.outstanding).toLocaleString("en-IN")}`
          : `-₹${Math.abs(Number(creditLimit) - account.outstanding).toLocaleString("en-IN")}`,
      utilizationRate: Math.round((account.outstanding / Number(creditLimit)) * 1000) / 10,
    };
    onSave(updated, notes);
    onClose();
  };

  return (
    <div className="acc-modal-overlay" onClick={onClose}>
      <div
        className="acc-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="acc-modal-header">
          <div>
            <h3 className="acc-modal-title">Adjust Credit Limit</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--acc-text-muted)" }}>
              {account.name} ({account.code})
            </span>
          </div>
          <button
            type="button"
            className="btn-quick-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
              close
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="acc-modal-body">
            {/* Current Utilization Summary */}
            <div
              style={{
                backgroundColor: "var(--acc-card-low)",
                padding: "0.85rem 1rem",
                borderRadius: "var(--acc-radius-md)",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.5rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.6875rem", color: "var(--acc-outline)" }}>
                  CURRENT OUTSTANDING
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--acc-text)" }}>
                  {account.outstandingDisplay}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.6875rem", color: "var(--acc-outline)" }}>
                  CURRENT UTILIZATION
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--acc-primary)" }}>
                  {account.utilizationRate}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.6875rem", color: "var(--acc-outline)" }}>
                  TIER
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--acc-text)" }}>
                  {account.tier}
                </div>
              </div>
            </div>

            {/* Revised Credit Limit */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                Sanctioned Credit Limit (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="10000"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                style={{
                  height: "2.5rem",
                  padding: "0 0.85rem",
                  borderRadius: "var(--acc-radius-md)",
                  border: "1px solid var(--acc-border)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  backgroundColor: "var(--acc-card-bg)",
                  color: "var(--acc-text)",
                }}
              />
              <span style={{ fontSize: "0.6875rem", color: "var(--acc-text-muted)" }}>
                Available buffer will automatically adjust based on current ledger balance.
              </span>
            </div>

            {/* Payment Terms */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                Settlement Terms *
              </label>
              <select
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                style={{
                  height: "2.5rem",
                  padding: "0 0.85rem",
                  borderRadius: "var(--acc-radius-md)",
                  border: "1px solid var(--acc-border)",
                  fontSize: "0.8125rem",
                  backgroundColor: "var(--acc-card-bg)",
                  color: "var(--acc-text)",
                }}
              >
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days (Standard)</option>
                <option value="Net 45">Net 45 Days</option>
                <option value="Net 60">Net 60 Days</option>
                <option value="Prepaid Only">Prepaid Only (Restricted)</option>
              </select>
            </div>

            {/* Bank Guarantee Details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                  Bank Guarantee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={bankGuarantee}
                  onChange={(e) => setBankGuarantee(e.target.value)}
                  style={{
                    height: "2.5rem",
                    padding: "0 0.85rem",
                    borderRadius: "var(--acc-radius-md)",
                    border: "1px solid var(--acc-border)",
                    fontSize: "0.8125rem",
                    backgroundColor: "var(--acc-card-bg)",
                    color: "var(--acc-text)",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                  Guarantee Reference Ref
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC #BG-9921"
                  value={guaranteeRef}
                  onChange={(e) => setGuaranteeRef(e.target.value)}
                  style={{
                    height: "2.5rem",
                    padding: "0 0.85rem",
                    borderRadius: "var(--acc-radius-md)",
                    border: "1px solid var(--acc-border)",
                    fontSize: "0.8125rem",
                    backgroundColor: "var(--acc-card-bg)",
                    color: "var(--acc-text)",
                  }}
                />
              </div>
            </div>

            {/* Admin Audit Rationale */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                Approval Rationale / Audit Justification *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Reason for revision (e.g. Quarterly limit enhancement approved by credit committee)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  padding: "0.75rem 0.85rem",
                  borderRadius: "var(--acc-radius-md)",
                  border: "1px solid var(--acc-border)",
                  fontSize: "0.8125rem",
                  fontFamily: "inherit",
                  backgroundColor: "var(--acc-card-bg)",
                  color: "var(--acc-text)",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div className="acc-modal-footer">
            <button
              type="button"
              className="btn-header-action"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-credit"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                check
              </span>
              Save & Update Exposure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
