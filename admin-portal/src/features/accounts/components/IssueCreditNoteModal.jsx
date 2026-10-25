/**
 * IssueCreditNoteModal Component
 * Dialog to issue a commercial credit note against disputed or adjusted enterprise invoices
 * Modeled after Stitch reference: 8._accounts_credit
 */

import { useState } from "react";

export default function IssueCreditNoteModal({
  accounts,
  defaultAccountId,
  isOpen,
  onClose,
  onIssue,
}) {
  const [selectedAccId, setSelectedAccId] = useState(
    () => defaultAccountId || accounts[0]?.id || ""
  );
  const [invoiceRef, setInvoiceRef] = useState("#INV-2026-8942");
  const [amount, setAmount] = useState("45000");
  const [reasonCode, setReasonCode] = useState("transit_shortage");
  const [gstTreatment, setGstTreatment] = useState("18_igst");
  const [authorizer, setAuthorizer] = useState("Finance Controller (FC-01)");
  const [remarks, setRemarks] = useState("");

  if (!isOpen) return null;

  const currentAccount =
    accounts.find((a) => a.id === selectedAccId) || accounts[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const noteData = {
      accountId: selectedAccId,
      accountName: currentAccount?.name,
      invoiceRef,
      amount: Number(amount),
      amountDisplay: `₹${Number(amount).toLocaleString("en-IN")}`,
      reasonCode,
      gstTreatment,
      authorizer,
      remarks,
      issuedAt: new Date().toISOString(),
      creditNoteNumber: `CN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    onIssue(noteData);
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
            <h3 className="acc-modal-title">Issue Commercial Credit Note</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--acc-text-muted)" }}>
              Reduces ledger outstanding and generates GST compliant credit voucher.
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
            {/* Account Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                Enterprise Account *
              </label>
              <select
                value={selectedAccId}
                onChange={(e) => setSelectedAccId(e.target.value)}
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
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.code}) — Current: {a.outstandingDisplay}
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice Reference & Amount Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                  Target Invoice Ref *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. #INV-2026-8942"
                  value={invoiceRef}
                  onChange={(e) => setInvoiceRef(e.target.value)}
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
                  Credit Note Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    height: "2.5rem",
                    padding: "0 0.85rem",
                    borderRadius: "var(--acc-radius-md)",
                    border: "1px solid var(--acc-border)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    backgroundColor: "var(--acc-card-bg)",
                    color: "var(--acc-text)",
                  }}
                />
              </div>
            </div>

            {/* Reason Code & GST Treatment */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                  Reason Category *
                </label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
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
                  <option value="transit_shortage">Transit Shortage / Demurrage Waiver</option>
                  <option value="rate_dispute">Agreed Tariff Discrepancy Adjustment</option>
                  <option value="damage_deduction">In-Transit Freight Damage Settlement</option>
                  <option value="volume_rebate">Quarterly SLA Volume Rebate</option>
                  <option value="billing_error">Invoicing / GST Computation Correction</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                  GST Adjustment *
                </label>
                <select
                  value={gstTreatment}
                  onChange={(e) => setGstTreatment(e.target.value)}
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
                  <option value="18_igst">18% IGST (Interstate Dispatch)</option>
                  <option value="18_cgst_sgst">9% CGST + 9% SGST (Intrastate)</option>
                  <option value="nil_rated">0% / Non-Taxable Demurrage Settlement</option>
                </select>
              </div>
            </div>

            {/* Authorizer */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                Authorizing Official *
              </label>
              <input
                type="text"
                required
                value={authorizer}
                onChange={(e) => setAuthorizer(e.target.value)}
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

            {/* Detailed Remarks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                Internal Audit Remarks
              </label>
              <textarea
                rows={3}
                placeholder="Include operational trip ticket or client dispute email reference..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
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
                post_add
              </span>
              Issue Credit Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
