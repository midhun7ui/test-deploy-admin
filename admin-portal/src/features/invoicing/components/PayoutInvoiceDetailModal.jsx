import PropTypes from "prop-types";

/**
 * PayoutInvoiceDetailModal - Displays a full Driver Settlement Voucher with TDS Sec 194C details
 */
export default function PayoutInvoiceDetailModal({ payout, isOpen, onClose }) {
  if (!isOpen || !payout) return null;

  const handleDownloadPdf = () => {
    if (payout.pdf_url) {
      window.open(payout.pdf_url, "_blank");
    } else {
      window.open(`/api/v1/admin/payout-invoices/${payout.id}/pdf/?download=1`, "_blank");
    }
  };

  return (
    <div className="inv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="inv-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "740px", maxHeight: "90vh", overflowY: "auto", padding: "1.75rem" }}
      >
        {/* Top Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.75rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", color: "#065f46", textTransform: "uppercase" }}>
              Driver Disbursement Advice
            </span>
            <h2 style={{ margin: "2px 0 0 0", fontSize: "1.3rem", fontWeight: 800, color: "#047857" }}>
              SETTLEMENT VOUCHER — {payout.invoice_number}
            </h2>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleDownloadPdf}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                backgroundColor: "#047857",
                color: "#ffffff",
                border: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <span>📥</span> Download S3 PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                borderRadius: "6px",
                fontSize: "1.2rem",
                lineHeight: 1,
                padding: "0.4rem 0.75rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Voucher Paper Frame */}
        <div style={{ border: "1px solid #a7f3d0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
          {/* Header Banner */}
          <div style={{ padding: "1.25rem", backgroundColor: "#f0fdf4", borderBottom: "2px solid #047857", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#065f46" }}>HireD DISBURSEMENT DESK</div>
              <div style={{ fontSize: "0.8rem", color: "#334155", marginTop: "4px" }}>
                <strong>TAN:</strong> CHNR01234D | <strong>Corporate PAN:</strong> AAACH8821K<br />
                Payroll & Driver Tax Withholding Section<br />
                Kerala Freight Corridor Operations<br />
                payouts@hired.co.in
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "inline-block", padding: "3px 8px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                INCOME TAX SEC 194C COMPLIANT
              </div>
              <div style={{ fontSize: "0.85rem", color: "#1e293b" }}>
                <strong>Voucher #:</strong> {payout.invoice_number}<br />
                <strong>Settlement Date:</strong> {new Date(payout.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}<br />
                <strong>Payment Status:</strong> <span style={{ color: "#047857", fontWeight: 700 }}>{payout.status.toUpperCase()}</span><br />
                <strong>UTR Reference:</strong> {payout.utr_number || "IMPS-SETTLED"}
              </div>
            </div>
          </div>

          {/* Driver & Bank Info */}
          <div style={{ padding: "1rem 1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.85rem" }}>
              <div style={{ fontWeight: 700, color: "#047857", marginBottom: "6px", textTransform: "uppercase", fontSize: "0.75rem" }}>
                BENEFICIARY DRIVER CONTRACTOR
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>{payout.driver_name}</div>
              <div style={{ color: "#475569", marginTop: "2px" }}>
                <strong>Driver ID:</strong> DRV-{String(payout.driver_id).padStart(4, "0")}<br />
                <strong>Contact:</strong> {payout.driver_phone || "+91 98000 00000"}<br />
                <strong>PAN:</strong> {payout.driver_pan || "AAAPB9912C"}
              </div>
            </div>
            <div style={{ fontSize: "0.85rem" }}>
              <div style={{ fontWeight: 700, color: "#047857", marginBottom: "6px", textTransform: "uppercase", fontSize: "0.75rem" }}>
                REMITTANCE ROUTING DETAILS
              </div>
              <div style={{ color: "#0f172a" }}>
                <strong>Bank Name:</strong> {payout.bank_name || "State Bank of India"}<br />
                <strong>Account Number:</strong> {payout.account_number || "309923849182"}<br />
                <strong>IFSC Code:</strong> {payout.ifsc_code || "SBIN0001234"}<br />
                <strong>Mode:</strong> Direct RTGS / IMPS Remittance
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div style={{ padding: "1rem 1.25rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#047857", color: "#fff", textAlign: "left" }}>
                  <th style={{ padding: "8px 10px" }}>Trip Reference</th>
                  <th style={{ padding: "8px 10px" }}>Associated Client</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>Gross Freight</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>Driver Share %</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>Gross Earnings</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>TDS (194C)</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>Net Disbursed</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px" }}>
                    TRP-{payout.trip_id ? String(payout.trip_id).padStart(4, "0") : "0001"}
                  </td>
                  <td style={{ padding: "10px" }}>{payout.company_name}</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>₹{Number(payout.gross_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>{payout.driver_share_pct}%</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>₹{Number(payout.gross_payout).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: "10px", textAlign: "right", color: "#dc2626" }}>
                    -₹{Number(payout.tds_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}<br />
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>({payout.tds_rate}%)</span>
                  </td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#047857" }}>
                    ₹{Number(payout.net_payout).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Disbursed Box */}
          <div style={{ padding: "0 1.25rem 1.25rem 1.25rem", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem" }}>
            <div style={{ backgroundColor: "#f0fdf4", padding: "0.85rem", borderRadius: "6px", fontSize: "0.8rem", color: "#166534" }}>
              <strong>Statutory Compliance Note:</strong><br />
              1. Withholding tax deducted under Section 194C of the Indian Income Tax Act.<br />
              2. Form 16A quarterly certificates will be dispatched upon IT portal filing.<br />
              3. Payments credited via IMPS/NEFT automated banking pipeline.
            </div>
            <div style={{ backgroundColor: "#f8fafc", padding: "0.85rem", borderRadius: "6px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>Gross Driver Earnings:</span>
                <strong>₹{Number(payout.gross_payout).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#dc2626" }}>
                <span>Less: TDS u/s 194C ({payout.tds_rate}%):</span>
                <span>-₹{Number(payout.tds_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ borderTop: "2px solid #a7f3d0", paddingTop: "6px", marginTop: "6px", display: "flex", justifyContent: "space-between", fontSize: "1rem" }}>
                <span style={{ fontWeight: 800, color: "#065f46" }}>Net Disbursed:</span>
                <strong style={{ fontWeight: 800, color: "#047857", fontSize: "1.1rem" }}>₹{Number(payout.net_payout).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>
          </div>

          {/* Footer Seal */}
          <div style={{ padding: "0.6rem 1.25rem", backgroundColor: "#f0fdf4", borderTop: "1px solid #bbf7d0", fontSize: "0.75rem", color: "#047857", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>UTR: {payout.utr_number || "UTR-VERIFIED-SETTLED"}</span>
            <span>Digitally Certified by HireD Payouts &amp; Settlements Desk</span>
          </div>
        </div>
      </div>
    </div>
  );
}

PayoutInvoiceDetailModal.propTypes = {
  payout: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
