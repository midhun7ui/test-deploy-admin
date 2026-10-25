/**
 * ProcessBatchPayoutModal Component
 * Dialog to trigger multi-driver batch disbursement across IMPS / NEFT corporate banking rails
 * Modeled after Stitch reference: 9._payouts_driver_wallets
 */

import { useState } from "react";

export default function ProcessBatchPayoutModal({
  isOpen,
  onClose,
  onProcess,
  pendingCount = 42,
  eligibleCount,
  skippedCount = 0,
  totalAmount = "₹5,18,200",
}) {
  const [bankingRail, setBankingRail] = useState("imps");
  const [approverCode, setApproverCode] = useState("OPS-LEAD-01");
  const [otpCode, setOtpCode] = useState("");
  const [bypassOtp, setBypassOtp] = useState(false);

  const finalEligibleCount = eligibleCount !== undefined ? eligibleCount : pendingCount;
  const isBlocked = finalEligibleCount === 0;

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onProcess({
      bankingRail,
      approverCode,
      otpCode: bypassOtp ? "AUTO-BYPASS" : otpCode,
      processedAt: new Date().toISOString(),
      batchId: `BATCH-IMPS-${Math.floor(100000 + Math.random() * 900000)}`,
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
            <h3 className="pay-modal-title">Process Batch Driver Payout</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--pay-text-muted)" }}>
              Instant multi-disbursal via corporate banking API rails
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
            {/* Batch Summary Box */}
            <div
              style={{
                backgroundColor: "var(--pay-card-low)",
                borderRadius: "var(--pay-radius-md)",
                padding: "1rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <span style={{ fontSize: "0.6875rem", color: "var(--pay-outline)", display: "block" }}>
                  QUEUED DISBURSEMENTS
                </span>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--pay-text)" }}>
                  {pendingCount} Drivers
                </span>
              </div>
              <div>
                <span style={{ fontSize: "0.6875rem", color: "var(--pay-outline)", display: "block" }}>
                  TOTAL NET PAYABLE
                </span>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--pay-primary)" }}>
                  {totalAmount}
                </span>
              </div>
            </div>

            {/* Banking Rail Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--pay-text)" }}>
                Corporate Disbursement Rail *
              </label>
              <select
                value={bankingRail}
                onChange={(e) => setBankingRail(e.target.value)}
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
                <option value="imps">IMPS Instant API Rail (HDFC / ICICI 24x7) — Recommended</option>
                <option value="neft">NEFT Bulk Corporate Clearing Batch</option>
                <option value="upi">UPI Auto-Disbursal Direct to Driver VPA</option>
              </select>
            </div>

            {/* Approver ID */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--pay-text)" }}>
                Operations Authorizer *
              </label>
              <input
                type="text"
                required
                value={approverCode}
                onChange={(e) => setApproverCode(e.target.value)}
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

            {/* OTP Verification */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--pay-text)" }}>
                  Security Verification OTP *
                </label>
                <label style={{ fontSize: "0.6875rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={bypassOtp}
                    onChange={(e) => setBypassOtp(e.target.checked)}
                  />
                  Bypass OTP in Test Mode
                </label>
              </div>
              <input
                type="text"
                required={!bypassOtp}
                disabled={bypassOtp}
                placeholder={bypassOtp ? "OTP Bypassed for Demo" : "Enter 6-digit Bank OTP sent to registered ops phone"}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{
                  height: "2.5rem",
                  padding: "0 0.85rem",
                  borderRadius: "var(--pay-radius-md)",
                  border: "1px solid var(--pay-border)",
                  fontSize: "0.8125rem",
                  backgroundColor: bypassOtp ? "var(--pay-card-low)" : "var(--pay-card-bg)",
                  color: "var(--pay-text)",
                  letterSpacing: bypassOtp ? "normal" : "0.2em",
                }}
              />
            </div>

            {/* Disclaimer Callout */}
            {skippedCount > 0 && (
              <div
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "var(--pay-radius-md)",
                  padding: "0.75rem 0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--pay-amber)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                  warning
                </span>
                <span>
                  {skippedCount} driver payout(s) skipped because their bank account is pending approval. Only approved accounts receive payouts.
                </span>
              </div>
            )}

            <div
              style={{
                backgroundColor: isBlocked ? "var(--pay-card-low)" : "var(--pay-emerald-bg)",
                borderRadius: "var(--pay-radius-md)",
                padding: "0.75rem 0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                color: isBlocked ? "var(--pay-text-muted)" : "var(--pay-emerald-dark)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                {isBlocked ? "block" : "verified"}
              </span>
              <span>
                {isBlocked
                  ? "Disbursement blocked: No queued payouts have approved bank accounts."
                  : `${finalEligibleCount} transaction(s) pre-validated against approved beneficiary accounts with 0 bank mismatches.`}
              </span>
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
              disabled={isBlocked}
              style={{
                opacity: isBlocked ? 0.5 : 1,
                cursor: isBlocked ? "not-allowed" : "pointer",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                payments
              </span>
              Authorize &amp; Execute Batch ({finalEligibleCount})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
