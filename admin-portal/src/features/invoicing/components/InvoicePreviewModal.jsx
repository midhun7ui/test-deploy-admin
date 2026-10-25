import PropTypes from "prop-types";

/**
 * InvoicePreviewModal - Full Tax Invoice Preview Document
 * Compliant with GST Rule 46, displaying IRN mockup, SAC 996511, itemized breakdown, and virtual bank details
 */
export default function InvoicePreviewModal({ isOpen, invoice, onClose, onPrint }) {
  if (!isOpen || !invoice) return null;

  const { account } = invoice;

  return (
    <div className="inv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="inv-modal-card inv-modal-card--preview"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "780px" }}
      >
        <div className="inv-modal-header inv-modal-header--preview">
          <div className="inv-modal-title-group">
            <h3 className="inv-modal-title">Tax Invoice Preview: {invoice.invoiceNumber}</h3>
            <p className="inv-modal-sub">
              Official Tax Invoice under Section 31 of CGST Act • Rule 46 Compliant
            </p>
          </div>
          <div className="inv-modal-actions-group">
            <button
              type="button"
              className="inv-btn-secondary"
              onClick={onPrint}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>print</span>
              Print / Save PDF
            </button>
            <button
              type="button"
              className="inv-modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="inv-paper-document">
          {/* Header Row with Supplier Info & Tax Title */}
          <div className="inv-paper-header">
            <div>
              <div className="inv-paper-brand">HireD Logistics Tech Pvt Ltd</div>
              <div className="inv-paper-address">
                Unit 402, Trade Tower, Bandra Kurla Complex, Mumbai, Maharashtra - 400051<br />
                GSTIN: <strong>27AAACH8291Q1Z4</strong> • PAN: AAACH8291Q • State: 27-Maharashtra<br />
                Email: billing@hired.in • CIN: U63090MH2024PTC394821
              </div>
            </div>
            <div className="inv-paper-irn-box">
              <div className="inv-paper-irn-qr">
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--inv-primary)" }}>
                  qr_code_2
                </span>
              </div>
              <div className="inv-paper-irn-sub">
                <strong>TAX INVOICE</strong>
                <span>IRN: 8a4f9e...2026</span>
                <span>Ack No: 1224901840</span>
              </div>
            </div>
          </div>

          <div className="inv-paper-divider" />

          {/* Meta Grid: Bill To, Ship To, Invoice Details */}
          <div className="inv-paper-meta-grid">
            <div className="inv-paper-meta-col">
              <span className="inv-paper-label">BILLED TO (RECIPIENT):</span>
              <strong className="inv-paper-client-name">{account.name}</strong>
              <div className="inv-paper-meta-text">
                Registered Office, Logistics Division<br />
                GSTIN: <strong>{account.gstin}</strong><br />
                Client Code: <strong>{account.code}</strong><br />
                State Code: 27 (Maharashtra)
              </div>
            </div>

            <div className="inv-paper-meta-col">
              <span className="inv-paper-label">INVOICE PARTICULARS:</span>
              <div className="inv-paper-meta-row">
                <span>Invoice Number:</span>
                <strong>{invoice.invoiceNumber}</strong>
              </div>
              <div className="inv-paper-meta-row">
                <span>Invoice Date:</span>
                <strong>{invoice.date}</strong>
              </div>
              <div className="inv-paper-meta-row">
                <span>Billing Period:</span>
                <strong>{invoice.period}</strong>
              </div>
              <div className="inv-paper-meta-row">
                <span>Payment Terms:</span>
                <strong>{account.creditTerms}</strong>
              </div>
              <div className="inv-paper-meta-row">
                <span>Place of Supply:</span>
                <strong>27-Maharashtra</strong>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="inv-paper-table">
            <thead>
              <tr>
                <th>#</th>
                <th>DESCRIPTION OF SERVICES</th>
                <th>SAC CODE</th>
                <th>QTY</th>
                <th>RATE (₹)</th>
                <th>TAXABLE VALUE (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <strong>Freight Charges (Consolidated Multi-Axle Trips)</strong>
                  <div style={{ fontSize: "11px", color: "var(--inv-text-muted)" }}>
                    {invoice.tripSummary} • 100% Digital POD & FASTag Reconciled
                  </div>
                </td>
                <td>996511</td>
                <td>{invoice.tripCount} Trips</td>
                <td>{(invoice.baseFreight / invoice.tripCount).toFixed(2)}</td>
                <td>{invoice.baseFreight.toFixed(2)}</td>
              </tr>
              {invoice.loadingDetention > 0 && (
                <tr>
                  <td>2</td>
                  <td>
                    <strong>Loading / Unloading Detention Surcharge</strong>
                    <div style={{ fontSize: "11px", color: "var(--inv-text-muted)" }}>
                      Demurrage logged at destination warehouse docks beyond 4hr free window
                    </div>
                  </td>
                  <td>996511</td>
                  <td>1 L.S.</td>
                  <td>{invoice.loadingDetention.toFixed(2)}</td>
                  <td>{invoice.loadingDetention.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} style={{ textAlign: "right", fontWeight: 600 }}>Taxable Value:</td>
                <td style={{ fontWeight: 600 }}>₹{invoice.taxableValue.toLocaleString("en-IN")}.00</td>
              </tr>
              <tr>
                <td colSpan={5} style={{ textAlign: "right" }}>Central GST (CGST @ 9.0%):</td>
                <td>{invoice.cgstDisplay}</td>
              </tr>
              <tr>
                <td colSpan={5} style={{ textAlign: "right" }}>State GST (SGST @ 9.0%):</td>
                <td>{invoice.sgstDisplay}</td>
              </tr>
              <tr className="inv-paper-grand-total-row">
                <td colSpan={5} style={{ textAlign: "right", fontWeight: 700, fontSize: "14px" }}>
                  TOTAL INVOICE VALUE (INR):
                </td>
                <td style={{ fontWeight: 700, fontSize: "15px", color: "var(--inv-primary)" }}>
                  {invoice.totalAmountDisplay}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Bottom Bank & Compliance Section */}
          <div className="inv-paper-footer-grid">
            <div className="inv-paper-bank-card">
              <span className="inv-paper-label">BANK REMITTANCE DETAILS (EXCLUSIVE VIRTUAL A/C):</span>
              <div className="inv-paper-meta-row">
                <span>Beneficiary:</span>
                <strong>HireD Logistics Tech Pvt Ltd</strong>
              </div>
              <div className="inv-paper-meta-row">
                <span>Virtual Account No:</span>
                <strong style={{ color: "var(--inv-primary)" }}>{account.virtualAccount}</strong>
              </div>
              <div className="inv-paper-meta-row">
                <span>Bank & IFSC:</span>
                <strong>HDFC Bank Ltd • {account.ifsc}</strong>
              </div>
              <div className="inv-paper-meta-row">
                <span>Account Type:</span>
                <strong>Current Account (Auto-Settled)</strong>
              </div>
            </div>

            <div className="inv-paper-sign-card">
              <div className="inv-paper-digi-badge">
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--inv-primary)" }}>
                  verified
                </span>
                <span>Digitally Signed by Authorized Signatory</span>
              </div>
              <div className="inv-paper-sign-meta">
                Certified under Information Technology Act, 2000.<br />
                Signer: HireD Finance Operations Cell.<br />
                Date & Time: {invoice.date}, 11:35:00 IST
              </div>
            </div>
          </div>
        </div>

        <div className="inv-modal-footer">
          <button
            type="button"
            className="inv-btn-secondary"
            onClick={onClose}
          >
            Close Preview
          </button>
          <button
            type="button"
            className="inv-btn-primary"
            onClick={onPrint}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>file_download</span>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

InvoicePreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  invoice: PropTypes.shape({
    id: PropTypes.string,
    invoiceNumber: PropTypes.string,
    date: PropTypes.string,
    period: PropTypes.string,
    tripCount: PropTypes.number,
    tripSummary: PropTypes.string,
    baseFreight: PropTypes.number,
    loadingDetention: PropTypes.number,
    taxableValue: PropTypes.number,
    cgstDisplay: PropTypes.string,
    sgstDisplay: PropTypes.string,
    totalAmountDisplay: PropTypes.string,
    account: PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
      gstin: PropTypes.string,
      creditTerms: PropTypes.string,
      virtualAccount: PropTypes.string,
      ifsc: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};
