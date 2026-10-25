/**
 * ReconcileIMPSModal Component
 * Dialog to trigger automated two-way reconciliation with ICICI & HDFC banking API webhooks
 * Modeled after Stitch reference: 9._payouts_driver_wallets
 */

import { useState } from "react";

export default function ReconcileIMPSModal({
  isOpen,
  onClose,
  onReconcileComplete,
}) {
  const [bankGateway, setBankGateway] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleStartReconciliation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onReconcileComplete({
        matchedCount: 176,
        matchedAmount: "₹18,64,250",
        gateway: bankGateway,
      });
      onClose();
    }, 1200);
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "1.25rem", color: "var(--pay-primary)" }}>
              sync_alt
            </span>
            <div>
              <h3 className="pay-modal-title">Reconcile IMPS / UPI Webhooks</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--pay-text-muted)" }}>
                Automated two-way ledger verification with corporate banking partners
              </span>
            </div>
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

        <div className="pay-modal-body">
          {/* Status Box */}
          <div
            style={{
              backgroundColor: "var(--pay-card-low)",
              borderRadius: "var(--pay-radius-md)",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span style={{ fontSize: "0.6875rem", color: "var(--pay-outline)", display: "block" }}>
                BANK GATEWAY STATUS
              </span>
              <strong style={{ fontSize: "0.9375rem", color: "var(--pay-emerald)" }}>
                ● Connected (Lat: 180ms)
              </strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.6875rem", color: "var(--pay-outline)", display: "block" }}>
                PENDING UTR CAPTURES
              </span>
              <strong style={{ fontSize: "0.9375rem", color: "var(--pay-text)" }}>
                14 Statements
              </strong>
            </div>
          </div>

          {/* Select Gateway */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--pay-text)" }}>
              Target Banking Partner *
            </label>
            <select
              value={bankGateway}
              onChange={(e) => setBankGateway(e.target.value)}
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
              <option value="all">All Connected Gateways (HDFC + ICICI)</option>
              <option value="hdfc">HDFC Bank Corporate Corporate Disbursal API</option>
              <option value="icici">ICICI Eazypay Corporate Direct IMPS API</option>
            </select>
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--pay-text-muted)", lineHeight: 1.4 }}>
            Reconciliation validates the bank credit status of all queued driver payouts against statutory
            UTR numbers received via automated callback webhooks. Mismatched or returned payouts are flagged instantly.
          </div>
        </div>

        <div className="pay-modal-footer">
          <button
            type="button"
            className="btn-payout-action"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary-payout"
            onClick={handleStartReconciliation}
            disabled={isProcessing}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              {isProcessing ? "refresh" : "sync"}
            </span>
            {isProcessing ? "Reconciling..." : "Run Reconciliation"}
          </button>
        </div>
      </div>
    </div>
  );
}
