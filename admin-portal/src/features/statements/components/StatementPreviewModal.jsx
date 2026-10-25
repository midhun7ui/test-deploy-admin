import PropTypes from "prop-types";

/**
 * StatementPreviewModal - Printable Statement Document Preview
 * Compliant with GST Rule 47 and RBI Settlement Standards
 */
export default function StatementPreviewModal({ isOpen, statement, onClose, onPrint }) {
  if (!isOpen || !statement) return null;

  const { entity, ledger } = statement;

  return (
    <div className="stmt-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="stmt-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "780px" }}
      >
        <div className="stmt-modal-header">
          <div>
            <h3 className="stmt-modal-title">Partner Account Statement: {statement.statementNumber}</h3>
            <p className="stmt-modal-sub">
              Official Periodic Ledger &amp; Settlement Certificate under GST Rule 47
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              type="button"
              className="stmt-btn-secondary"
              onClick={onPrint}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>print</span>
              Print / Save PDF
            </button>
            <button
              type="button"
              className="stmt-modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Printable Statement Document */}
        <div style={{ padding: "1.5rem 2rem", overflowY: "auto", fontSize: "0.8125rem", color: "#1e293b", backgroundColor: "#ffffff" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>HireD Logistics Tech Pvt Ltd</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", lineHeight: 1.4 }}>
                Trade Tower, BKC, Mumbai - 400051<br />
                GSTIN: 27AAACH8291Q1Z4 • PAN: AAACH8291Q<br />
                Corporate Clearing Node: HDFC Corporate API
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--stmt-primary)" }}>STATEMENT OF ACCOUNT</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.2rem" }}>
                Statement ID: <strong>{statement.statementNumber}</strong><br />
                Generated: <strong>{statement.date}</strong><br />
                Cycle: <strong>{statement.period}</strong>
              </div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "1rem 0" }} />

          {/* Partner Entity Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.25rem" }}>
            <div style={{ padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#94a3b8", display: "block" }}>ISSUED TO (PARTNER):</span>
              <strong style={{ fontSize: "0.9375rem", color: "#0f172a" }}>{entity.name}</strong>
              <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.25rem", lineHeight: 1.4 }}>
                GSTIN: <strong>{entity.gstin}</strong><br />
                Email: {entity.email}<br />
                Credit Terms: <strong>{entity.creditTerms}</strong>
              </div>
            </div>

            <div style={{ padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#94a3b8", display: "block" }}>SETTLEMENT SUMMARY:</span>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                <span>Closing Due:</span>
                <strong style={{ color: "var(--stmt-primary)", fontSize: "0.9375rem" }}>{ledger.closingBalanceDisplay}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                <span>Due Date:</span>
                <span>{statement.dueDate}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                <span>Tax Compliance:</span>
                <span>{statement.gstNote}</span>
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", marginBottom: "1.25rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9", textAlign: "left", color: "#475569" }}>
                <th style={{ padding: "0.5rem 0.75rem" }}>TRANSACTION DETAILS</th>
                <th style={{ padding: "0.5rem 0.75rem" }}>PARTICULARS / REF</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "right" }}>DEBITS (₹)</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "right" }}>CREDITS (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.65rem 0.75rem" }}>Opening Balance</td>
                <td style={{ padding: "0.65rem 0.75rem", color: "#64748b" }}>Carried forward from preceding cycle</td>
                <td style={{ padding: "0.65rem 0.75rem", textAlign: "right" }}>{ledger.openingBalanceDisplay}</td>
                <td style={{ padding: "0.65rem 0.75rem", textAlign: "right" }}>-</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.65rem 0.75rem" }}>Freight Charges</td>
                <td style={{ padding: "0.65rem 0.75rem", color: "#64748b" }}>{ledger.freightTripsLabel} (e-POD Verified)</td>
                <td style={{ padding: "0.65rem 0.75rem", textAlign: "right" }}>{ledger.freightDebitsDisplay}</td>
                <td style={{ padding: "0.65rem 0.75rem", textAlign: "right" }}>-</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.65rem 0.75rem" }}>FASTag &amp; Toll Surcharges</td>
                <td style={{ padding: "0.65rem 0.75rem", color: "#64748b" }}>En-route automated toll debits</td>
                <td style={{ padding: "0.65rem 0.75rem", textAlign: "right" }}>{ledger.tollSurchargesDisplay}</td>
                <td style={{ padding: "0.65rem 0.75rem", textAlign: "right" }}>-</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.65rem 0.75rem", color: "var(--stmt-primary)" }}>Bank Remittance Received</td>
                <td style={{ padding: "0.65rem 0.75rem", color: "#64748b" }}>{ledger.cmsPaymentRef}</td>
                <td style={{ padding: "0.65rem 0.75rem", textAlign: "right" }}>-</td>
                <td style={{ padding: "0.65rem 0.75rem", textAlign: "right", color: "var(--stmt-primary)", fontWeight: 600 }}>{ledger.cmsPaymentDisplay.replace("-", "")}</td>
              </tr>
              {ledger.claimAdjustment > 0 && (
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "0.65rem 0.75rem" }}>SLA Waiver / Credit Note</td>
                  <td style={{ padding: "0.65rem 0.75rem", color: "#64748b" }}>{ledger.claimAdjustmentRef}</td>
                  <td style={{ padding: "0.65rem 0.75rem", textAlign: "right" }}>-</td>
                  <td style={{ padding: "0.65rem 0.75rem", textAlign: "right", fontWeight: 600 }}>{ledger.claimAdjustmentDisplay.replace("-", "")}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid #0f172a", fontWeight: 700 }}>
                <td colSpan={2} style={{ padding: "0.75rem", textAlign: "right" }}>NET CLOSING BALANCE (INR):</td>
                <td colSpan={2} style={{ padding: "0.75rem", textAlign: "right", fontSize: "14px", color: "var(--stmt-primary)" }}>
                  {ledger.closingBalanceDisplay}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Virtual Account Remittance Instructions */}
          <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#94a3b8", display: "block" }}>
              AUTOMATED SETTLEMENT REMITTANCE INSTRUCTIONS:
            </span>
            <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", color: "#334155" }}>
              Kindly remit outstanding balance to Virtual Account: <strong>{entity.virtualAccount}</strong> | Bank: <strong>{entity.bankName}</strong> | IFSC: <strong>{entity.ifsc}</strong>. Auto-reconciliation engine matches incoming CMS NEFT within 15 minutes.
            </div>
          </div>
        </div>

        <div className="stmt-modal-footer">
          <button
            type="button"
            className="stmt-btn-secondary"
            onClick={onClose}
          >
            Close Preview
          </button>
          <button
            type="button"
            className="stmt-btn-primary"
            onClick={onPrint}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>file_download</span>
            Download PDF Statement
          </button>
        </div>
      </div>
    </div>
  );
}

StatementPreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  statement: PropTypes.shape({
    id: PropTypes.string,
    statementNumber: PropTypes.string,
    date: PropTypes.string,
    period: PropTypes.string,
    dueDate: PropTypes.string,
    gstNote: PropTypes.string,
    entity: PropTypes.shape({
      name: PropTypes.string,
      gstin: PropTypes.string,
      email: PropTypes.string,
      creditTerms: PropTypes.string,
      virtualAccount: PropTypes.string,
      bankName: PropTypes.string,
      ifsc: PropTypes.string,
    }),
    ledger: PropTypes.shape({
      openingBalanceDisplay: PropTypes.string,
      freightDebitsDisplay: PropTypes.string,
      freightTripsLabel: PropTypes.string,
      tollSurchargesDisplay: PropTypes.string,
      cmsPaymentRef: PropTypes.string,
      cmsPaymentDisplay: PropTypes.string,
      claimAdjustment: PropTypes.number,
      claimAdjustmentRef: PropTypes.string,
      claimAdjustmentDisplay: PropTypes.string,
      closingBalanceDisplay: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};
