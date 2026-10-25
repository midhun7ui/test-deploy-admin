/**
 * ManualUTRModal Component
 * Dialog to manually record external bank UTR reference and clear pending driver payouts
 * Modeled after Stitch reference: 9._payouts_driver_wallets
 */

import { useState } from "react";

export default function ManualUTRModal({
  payout,
  isOpen,
  onClose,
  onSaveUTR,
}) {
  const [utrNumber, setUtrNumber] = useState(
    () => `CMS-IMPS-${Date.now().toString().slice(-8)}`
  );
  const [transferMode, setTransferMode] = useState("IMPS");
  const [transferDate, setTransferDate] = useState("2026-10-14");
  const [remarks, setRemarks] = useState("Processed via corporate net banking portal");

  if (!isOpen || !payout) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveUTR({
      payoutId: payout.id,
      driverName: payout.driver.name,
      amount: payout.netPayableDisplay,
      utrNumber,
      transferMode,
      transferDate,
      remarks,
      recordedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="pay-modal-overlay" onClick={onClose}>
      <div
        className="pay-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="pay-modal-header">
          <div>
            <h3 className="pay-modal-title">Record Manual Bank UTR</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--pay-text-muted)" }}>
              {payout.driver.name} · {payout.payoutCode} ({payout.netPayableDisplay})
            </span>
          </div>
          <button
            type="button"
            className="btn-reload-batch"
            style={{ width: "2rem", height: "2rem", border: "none" }}
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
              close
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pay-modal-body">
            {/* Beneficiary Details Recap */}
            <div
              style={{
                backgroundColor: "var(--pay-card-low)",
                borderRadius: "var(--pay-radius-md)",
                padding: "0.85rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                fontSize: "0.75rem",
              }}
            >
              <div>
                <span style={{ color: "var(--pay-outline)", display: "block" }}>Beneficiary Account</span>
                <strong>{payout.driver.bankAccountMasked}</strong>
              </div>
              <div>
                <span style={{ color: "var(--pay-outline)", display: "block" }}>IFSC Code</span>
                <strong>{payout.driver.ifscCode}</strong>
              </div>
            </div>

            {/* UTR Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--pay-text)" }}>
                Bank UTR / Transaction Reference *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CMS-IMPS-20261014891029"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                style={{
                  height: "2.5rem",
                  padding: "0 0.85rem",
                  borderRadius: "var(--pay-radius-md)",
                  border: "1px solid var(--pay-border)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  backgroundColor: "var(--pay-card-bg)",
                  color: "var(--pay-text)",
                }}
              />
            </div>

            {/* Transfer Mode & Date */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--pay-text)" }}>
                  Transfer Mode *
                </label>
                <select
                  value={transferMode}
                  onChange={(e) => setTransferMode(e.target.value)}
                  style={{
                    height: "2.5rem",
                    padding: "0 0.85rem",
                    borderRadius: "var(--pay-radius-md)",
                    border: "1px solid var(--pay-border)",
                    fontSize: "0.8125rem",
                    backgroundColor: "var(--pay-card-bg)",
                    color: "var(--pay-text)",
                  }}
                >
                  <option value="IMPS">IMPS Immediate Payment</option>
                  <option value="NEFT">NEFT National Clearing</option>
                  <option value="RTGS">RTGS High-Value Transfer</option>
                  <option value="UPI">UPI Direct VPA Transfer</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--pay-text)" }}>
                  Settlement Date *
                </label>
                <input
                  type="date"
                  required
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  style={{
                    height: "2.5rem",
                    padding: "0 0.85rem",
                    borderRadius: "var(--pay-radius-md)",
                    border: "1px solid var(--pay-border)",
                    fontSize: "0.8125rem",
                    backgroundColor: "var(--pay-card-bg)",
                    color: "var(--pay-text)",
                  }}
                />
              </div>
            </div>

            {/* Remarks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--pay-text)" }}>
                Audit Remarks
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                style={{
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--pay-radius-md)",
                  border: "1px solid var(--pay-border)",
                  fontSize: "0.8125rem",
                  fontFamily: "inherit",
                  backgroundColor: "var(--pay-card-bg)",
                  color: "var(--pay-text)",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div className="pay-modal-footer">
            <button
              type="button"
              className="btn-payout-action"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-payout"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                check
              </span>
              Save UTR &amp; Mark Settled
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
