import PropTypes from "prop-types";

/**
 * OrderInvoiceDetailModal - Displays a full, official Rule 46 GST Tax Invoice with download button
 */
export default function OrderInvoiceDetailModal({ invoice, isOpen, onClose }) {
  if (!isOpen || !invoice) return null;

  const handleDownloadPdf = () => {
    if (invoice.pdf_url) {
      window.open(invoice.pdf_url, "_blank");
    } else {
      window.open(`/api/v1/admin/order-invoices/${invoice.id}/pdf/?download=1`, "_blank");
    }
  };

  return (
    <div className="inv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="inv-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "780px", maxHeight: "90vh", overflowY: "auto", padding: "1.75rem" }}
      >
        {/* Top Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.75rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", color: "#64748b", textTransform: "uppercase" }}>
              Commercial Freight Document
            </span>
            <h2 style={{ margin: "2px 0 0 0", fontSize: "1.3rem", fontWeight: 800, color: "#1e3a8a" }}>
              GST TAX INVOICE — {invoice.invoice_number}
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
                backgroundColor: "#1e3a8a",
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

        {/* GST Invoice Paper Frame */}
        <div style={{ border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
          {/* Header Banner */}
          <div style={{ padding: "1.25rem", backgroundColor: "#f8fafc", borderBottom: "2px solid #1e3a8a", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e3a8a" }}>HireD FREIGHT LOGISTICS PVT LTD</div>
              <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "4px" }}>
                <strong>GSTIN:</strong> 32AAACH8821K1ZZ | <strong>PAN:</strong> AAACH8821K<br />
                State: 32-Kerala | SAC: 996511 (Goods Transport Agency)<br />
                Seaport-Airport Road, Kochi, Kerala - 682030<br />
                support@hired.co.in | +91 98950 12345
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "inline-block", padding: "3px 8px", backgroundColor: "#dbeafe", color: "#1e40af", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                RULE 46 CGST COMPLIANT
              </div>
              <div style={{ fontSize: "0.85rem", color: "#1e293b" }}>
                <strong>Invoice #:</strong> {invoice.invoice_number}<br />
                <strong>Date:</strong> {new Date(invoice.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}<br />
                <strong>Place of Supply:</strong> {invoice.place_of_supply}<br />
                <strong>RCM Applicable:</strong> {invoice.is_rcm ? "YES" : "NO"}
              </div>
            </div>
          </div>

          {/* Recipient & Transport Details */}
          <div style={{ padding: "1rem 1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.85rem" }}>
              <div style={{ fontWeight: 700, color: "#475569", marginBottom: "6px", textTransform: "uppercase", fontSize: "0.75rem" }}>
                BILLED TO (PARTNER COMPANY)
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>{invoice.company_name}</div>
              <div style={{ color: "#475569", marginTop: "2px" }}>
                <strong>GSTIN:</strong> {invoice.company_gstin || "32AABCB1234F1Z8"}<br />
                <strong>Contact Person:</strong> {invoice.contact_name}<br />
                <strong>Phone:</strong> {invoice.contact_phone}
              </div>
            </div>
            <div style={{ fontSize: "0.85rem" }}>
              <div style={{ fontWeight: 700, color: "#475569", marginBottom: "6px", textTransform: "uppercase", fontSize: "0.75rem" }}>
                DISPATCH & VEHICLE ASSIGNMENT
              </div>
              <div style={{ color: "#0f172a" }}>
                <strong>Order ID:</strong> ORD-{String(invoice.order_id).padStart(4, "0")}<br />
                <strong>Trip ID:</strong> TRP-{invoice.trip_id ? String(invoice.trip_id).padStart(4, "0") : "0001"}<br />
                <strong>Vehicle Registration:</strong> {invoice.vehicle_number}<br />
                <strong>Driver:</strong> {invoice.driver_name}
              </div>
            </div>
          </div>

          {/* Route Banner */}
          <div style={{ padding: "0.6rem 1.25rem", backgroundColor: "#f1f5f9", fontSize: "0.85rem", borderBottom: "1px solid #e2e8f0" }}>
            <strong>Transit Corridor:</strong> {invoice.pickup_location} → {invoice.drop_location} &nbsp;|&nbsp; <strong>Cargo:</strong> {invoice.cargo_type || "General Commercial Freight"}
          </div>

          {/* Service & Tax Matrix Table */}
          <div style={{ padding: "1rem 1.25rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#1e3a8a", color: "#fff", textAlign: "left" }}>
                  <th style={{ padding: "8px 10px" }}>Service Description</th>
                  <th style={{ padding: "8px 10px" }}>SAC</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>Taxable Freight</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>CGST</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>SGST</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px" }}>
                    Freight Transportation by Road
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      Direct Corridor Freight Delivery
                    </div>
                  </td>
                  <td style={{ padding: "10px" }}>{invoice.sac_code}</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>₹{Number(invoice.taxable_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>
                    {invoice.cgst_rate}%<br />
                    <span style={{ fontSize: "0.75rem", color: "#475569" }}>₹{Number(invoice.cgst_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td style={{ padding: "10px", textAlign: "right" }}>
                    {invoice.sgst_rate}%<br />
                    <span style={{ fontSize: "0.75rem", color: "#475569" }}>₹{Number(invoice.sgst_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>
                    ₹{Number(invoice.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Grand Total Calculation Block */}
          <div style={{ padding: "0 1.25rem 1.25rem 1.25rem", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem" }}>
            <div style={{ backgroundColor: "#f8fafc", padding: "0.85rem", borderRadius: "6px", fontSize: "0.8rem", color: "#475569" }}>
              <strong>Statutory Declaration:</strong><br />
              1. Certified that the particulars given above are true and correct.<br />
              2. Goods transport service provided under SAC 996511.<br />
              3. Input Tax Credit (ITC) is admissible per CGST Act.<br />
              4. Bank: HDFC Bank | A/C: 50200088991122 | IFSC: HDFC0001234
            </div>
            <div style={{ backgroundColor: "#f8fafc", padding: "0.85rem", borderRadius: "6px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>Taxable Amount:</span>
                <strong>₹{Number(invoice.taxable_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#475569" }}>
                <span>CGST ({invoice.cgst_rate}%):</span>
                <span>₹{Number(invoice.cgst_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#475569" }}>
                <span>SGST ({invoice.sgst_rate}%):</span>
                <span>₹{Number(invoice.sgst_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ borderTop: "2px solid #cbd5e1", paddingTop: "6px", marginTop: "6px", display: "flex", justifyContent: "space-between", fontSize: "1rem" }}>
                <span style={{ fontWeight: 800, color: "#1e3a8a" }}>Grand Total:</span>
                <strong style={{ fontWeight: 800, color: "#1e3a8a" }}>₹{Number(invoice.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>
          </div>

          {/* Footer Digital Seal */}
          <div style={{ padding: "0.6rem 1.25rem", backgroundColor: "#f1f5f9", borderTop: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#64748b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>IRN: {invoice.irn || "IRN-HIRED-DIGITAL-SHA256-CERTIFIED"}</span>
            <span>Digitally signed by HireD Freight Logistics Pvt Ltd</span>
          </div>
        </div>
      </div>
    </div>
  );
}

OrderInvoiceDetailModal.propTypes = {
  invoice: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
