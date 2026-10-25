import { useState } from "react";
import PropTypes from "prop-types";

/**
 * CreateInvoiceModal - Modal dialog for creating consolidated tax invoice
 */
export default function CreateInvoiceModal({ isOpen, onClose, onCreateInvoice }) {
  const [clientId, setClientId] = useState("ACC-2026-001");
  const [period, setPeriod] = useState("01–15 Oct 2026");
  const [tripCount, setTripCount] = useState(8);
  const [baseFreight, setBaseFreight] = useState(650000);
  const [detention, setDetention] = useState(15000);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const taxableSubtotal = Number(baseFreight) + Number(detention);
  const cgst = Math.round(taxableSubtotal * 0.09);
  const sgst = Math.round(taxableSubtotal * 0.09);
  const totalAmount = taxableSubtotal + cgst + sgst;

  const handleSubmit = (e) => {
    e.preventDefault();

    const companyMap = {
      "ACC-2026-001": {
        code: "ACC-2026-001",
        name: "Sharma Logistics Pvt Ltd",
        shortName: "Sharma Logistics",
        initials: "SL",
        gstin: "27AABCS1429B1Z2",
        isVerified: true,
        billingCycle: `${period} (Custom Consolidation)`,
        creditTerms: "Net 30 Days",
        virtualAccount: "VA-HIRED-SHARMA",
        ifsc: "HDFC0000060",
      },
      "ACC-2026-002": {
        code: "ACC-2026-002",
        name: "Nova Cold Chain Ltd",
        shortName: "Nova Cold Chain",
        initials: "NC",
        gstin: "24AACCN5591M1Z8",
        isVerified: true,
        billingCycle: `${period} (Weekly)`,
        creditTerms: "Net 15 Days",
        virtualAccount: "VA-HIRED-NOVA",
        ifsc: "HDFC0000060",
      },
      "ACC-2026-003": {
        code: "ACC-2026-003",
        name: "Trident Pharma Express",
        shortName: "Trident Pharma",
        initials: "TP",
        gstin: "07AAACT9012L1Z4",
        isVerified: true,
        billingCycle: `${period} (Monthly)`,
        creditTerms: "Net 45 Days",
        virtualAccount: "VA-HIRED-TRIDENT",
        ifsc: "HDFC0000060",
      },
      "ACC-2026-004": {
        code: "ACC-2026-004",
        name: "Bluestone Cements Ltd",
        shortName: "Bluestone Cements",
        initials: "BC",
        gstin: "29AABCB3392K1Z9",
        isVerified: true,
        billingCycle: `${period} (Monthly)`,
        creditTerms: "Net 30 Days",
        virtualAccount: "VA-HIRED-BLUESTONE",
        ifsc: "HDFC0000060",
      },
      "ACC-2026-005": {
        code: "ACC-2026-005",
        name: "Vertex Retail Superstores",
        shortName: "Vertex Retail",
        initials: "VR",
        gstin: "06AAACV8821N1Z1",
        isVerified: true,
        billingCycle: `${period} (Weekly)`,
        creditTerms: "Net 15 Days",
        virtualAccount: "VA-HIRED-VERTEX",
        ifsc: "HDFC0000060",
      },
    };

    const targetAccount = companyMap[clientId] || companyMap["ACC-2026-001"];
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const invoiceNumber = `#INV-2026-${randomSuffix}`;

    const newInvoice = {
      id: `INV-2026-${randomSuffix}`,
      invoiceNumber,
      date: "14 Oct 2026",
      account: targetAccount,
      period: period.substring(0, 10),
      tripCount: Number(tripCount),
      tripSummary: `${tripCount} Closed Trips`,
      podVerifiedPct: 100,
      baseFreight: Number(baseFreight),
      baseFreightDisplay: `₹${Number(baseFreight).toLocaleString("en-IN")}.00`,
      loadingDetention: Number(detention),
      loadingDetentionDisplay: `+₹${Number(detention).toLocaleString("en-IN")}.00`,
      taxableValue: taxableSubtotal,
      taxableValueDisplay: `₹${taxableSubtotal.toLocaleString("en-IN")}`,
      taxableValueFullDisplay: `₹${taxableSubtotal.toLocaleString("en-IN")}.00`,
      cgst,
      cgstDisplay: `+₹${cgst.toLocaleString("en-IN")}.00`,
      sgst,
      sgstDisplay: `+₹${sgst.toLocaleString("en-IN")}.00`,
      gstTotal: cgst + sgst,
      gstDisplay: `+₹${(cgst + sgst).toLocaleString("en-IN")} GST`,
      totalAmount,
      totalAmountDisplay: `₹${totalAmount.toLocaleString("en-IN")}`,
      status: "Review Pending",
      statusType: "pending",
      actionLabel: "Review",
      workflow: {
        currentStep: 2,
        totalSteps: 4,
        stepTitle: "Draft Invoice Awaiting Admin Verification",
        stepSubtitle: "Generated manually by Admin • 14 Oct, 12:00 PM",
        steps: [
          { number: 1, name: "Consolidated", author: "Ops Admin", date: "14 Oct", isDone: true },
          { number: 2, name: "Sign-Off", author: "Pending Ops Lead", date: "Pending", isDone: false },
          { number: 3, name: "Dispatch", author: "WhatsApp/Email", date: "Locked", isDone: false },
          { number: 4, name: "Payout Match", author: "NEFT Match", date: "Locked", isDone: false },
        ],
      },
      notes,
    };

    onCreateInvoice(newInvoice);
    onClose();
  };

  return (
    <div className="inv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="inv-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "620px" }}
      >
        <div className="inv-modal-header">
          <div className="inv-modal-title-group">
            <h3 className="inv-modal-title">Create Consolidated Tax Invoice</h3>
            <p className="inv-modal-sub">
              Aggregate verified trips, compute GST (Rule 46), and queue for two-step verification.
            </p>
          </div>
          <button
            type="button"
            className="inv-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="inv-modal-form">
          <div className="inv-form-grid-2">
            <div className="inv-form-field">
              <label htmlFor="inv-client-select" className="inv-form-label">
                Enterprise Client Account *
              </label>
              <select
                id="inv-client-select"
                className="inv-form-select"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
              >
                <option value="ACC-2026-001">Sharma Logistics (ACC-2026-001)</option>
                <option value="ACC-2026-002">Nova Cold Chain (ACC-2026-002)</option>
                <option value="ACC-2026-003">Trident Pharma (ACC-2026-003)</option>
                <option value="ACC-2026-004">Bluestone Cements (ACC-2026-004)</option>
                <option value="ACC-2026-005">Vertex Retail (ACC-2026-005)</option>
              </select>
            </div>

            <div className="inv-form-field">
              <label htmlFor="inv-period-input" className="inv-form-label">
                Billing Cycle / Period *
              </label>
              <input
                id="inv-period-input"
                type="text"
                className="inv-form-input"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g. 01–15 Oct 2026"
                required
              />
            </div>
          </div>

          <div className="inv-form-grid-3">
            <div className="inv-form-field">
              <label htmlFor="inv-trips-count" className="inv-form-label">
                Trips Count *
              </label>
              <input
                id="inv-trips-count"
                type="number"
                min="1"
                className="inv-form-input"
                value={tripCount}
                onChange={(e) => setTripCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                required
              />
            </div>

            <div className="inv-form-field">
              <label htmlFor="inv-base-freight" className="inv-form-label">
                Base Freight (₹) *
              </label>
              <input
                id="inv-base-freight"
                type="number"
                min="0"
                step="500"
                className="inv-form-input"
                value={baseFreight}
                onChange={(e) => setBaseFreight(Math.max(0, parseFloat(e.target.value) || 0))}
                required
              />
            </div>

            <div className="inv-form-field">
              <label htmlFor="inv-detention-surcharge" className="inv-form-label">
                Detention / Surcharge (₹)
              </label>
              <input
                id="inv-detention-surcharge"
                type="number"
                min="0"
                step="500"
                className="inv-form-input"
                value={detention}
                onChange={(e) => setDetention(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
          </div>

          {/* Tax Calculation Live Preview */}
          <div className="inv-calc-box">
            <div className="inv-calc-row">
              <span>Taxable Freight Subtotal:</span>
              <strong>₹{taxableSubtotal.toLocaleString("en-IN")}</strong>
            </div>
            <div className="inv-calc-row">
              <span>CGST (9.0%) + SGST (9.0%):</span>
              <strong style={{ color: "var(--inv-primary)" }}>
                +₹{(cgst + sgst).toLocaleString("en-IN")}
              </strong>
            </div>
            <div className="inv-calc-row inv-calc-row--total">
              <span>Estimated Total Invoice Payable:</span>
              <strong style={{ fontSize: "16px", color: "var(--inv-text-primary)" }}>
                ₹{totalAmount.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <div className="inv-form-field">
            <label htmlFor="inv-admin-notes" className="inv-form-label">
              Consolidation Notes / POD Verification Reference
            </label>
            <textarea
              id="inv-admin-notes"
              className="inv-form-textarea"
              rows="2"
              placeholder="All e-way bills reconciled against FASTag GPS timestamps..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="inv-modal-footer">
            <button
              type="button"
              className="inv-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inv-btn-primary"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add_task</span>
              Generate & Queue for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateInvoiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateInvoice: PropTypes.func.isRequired,
};
