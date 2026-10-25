/**
 * GrantOverrideModal Component
 * Dialog to authorize emergency temporary booking/dispatch overrides for blocked/breached accounts
 * Modeled after Stitch reference: 8._accounts_credit
 */

import { useState } from "react";

export default function GrantOverrideModal({
  account,
  isOpen,
  onClose,
  onGrant,
}) {
  const [duration, setDuration] = useState("48h");
  const [bufferAmount, setBufferAmount] = useState("300000");
  const [approver, setApprover] = useState("VP Operations & Logistics");
  const [reason, setReason] = useState("");

  if (!isOpen || !account) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGrant({
      accountId: account.id,
      accountName: account.name,
      duration,
      bufferAmount: Number(bufferAmount),
      approver,
      reason,
      grantedAt: new Date().toISOString(),
    });
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div
              style={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "var(--acc-radius-md)",
                backgroundColor: "var(--acc-danger-bg)",
                color: "var(--acc-danger)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
                bolt
              </span>
            </div>
            <div>
              <h3 className="acc-modal-title">Grant Temporary Dispatch Override</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--acc-text-muted)" }}>
                {account.name} ({account.code})
              </span>
            </div>
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
            {/* Warning Callout */}
            <div
              style={{
                backgroundColor: "var(--acc-danger-bg)",
                border: "1px solid var(--acc-danger-border)",
                borderRadius: "var(--acc-radius-md)",
                padding: "0.85rem 1rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.65rem",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "var(--acc-danger)", fontSize: "1.25rem", marginTop: 2 }}
              >
                warning
              </span>
              <div style={{ fontSize: "0.75rem", color: "var(--acc-danger-text)", lineHeight: 1.4 }}>
                <strong>High Financial Risk Action:</strong> This account currently has{" "}
                <strong>{account.outstandingDisplay}</strong> outstanding (
                {account.utilizationRate}% utilized). Granting an override will temporarily resume
                automated trip assignment and vehicle dispatches regardless of credit ceiling.
              </div>
            </div>

            {/* Duration Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                Override Validity Duration *
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {[
                  { id: "24h", label: "24 Hours" },
                  { id: "48h", label: "48 Hours" },
                  { id: "72h", label: "72 Hours" },
                  { id: "7d", label: "7 Days" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDuration(item.id)}
                    style={{
                      height: "2.25rem",
                      borderRadius: "var(--acc-radius-md)",
                      border:
                        duration === item.id
                          ? "2px solid var(--acc-primary)"
                          : "1px solid var(--acc-border)",
                      backgroundColor:
                        duration === item.id
                          ? "var(--acc-card-high)"
                          : "var(--acc-card-low)",
                      color:
                        duration === item.id
                          ? "var(--acc-primary)"
                          : "var(--acc-text)",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Exposure Buffer & Approver */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                  Temporary Exposure Buffer (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="50000"
                  step="50000"
                  value={bufferAmount}
                  onChange={(e) => setBufferAmount(e.target.value)}
                  style={{
                    height: "2.5rem",
                    padding: "0 0.85rem",
                    borderRadius: "var(--acc-radius-md)",
                    border: "1px solid var(--acc-border)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    backgroundColor: "var(--acc-card-bg)",
                    color: "var(--acc-text)",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                  Authorized Approver *
                </label>
                <input
                  type="text"
                  required
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
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

            {/* Mandatory Rationale */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--acc-text)" }}>
                Executive Justification & Payment Promise *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Specify urgent operational mandate (e.g., Client promised wire settlement ref # CMS-9921 today by 5 PM; vital cold chain dispatch permitted)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
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
              style={{ backgroundColor: "var(--acc-primary)" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                bolt
              </span>
              Authorize Temporary Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
