import { useState } from "react";
import PropTypes from "prop-types";

/**
 * InvoiceDetailPanel - Master-detail sticky inspector panel
 * Exact replica of Stitch Reference 10:
 * - Hero header with client avatar, verified badge, GSTIN, download/share actions
 * - Status Alert Ribbon: Draft Invoice Awaiting Admin Verification (Step 2/4)
 * - Subtabs: Summary, Trips (12), Tax & GST, Audit Trail
 * - Workflow Progression Stepper (4 steps: Consolidated, Sign-Off, Dispatch, Payout Match)
 * - Financial Itemization: Base Freight, Loading/Detention, Subtotal, CGST, SGST, Total Payable, Remittance Bank
 * - Action buttons: Verify & Approve Invoice, Request Revision, Preview Full PDF
 * - Rule 46 CGST footnote
 */
export default function InvoiceDetailPanel({
  invoice,
  onApprove,
  onRequestRevision,
  onPreviewPDF,
  onCopyVirtualAccount,
  onExportSingleCSV,
  onClose,
}) {
  const [activeSubTab, setActiveSubTab] = useState("summary");

  if (!invoice) {
    return (
      <aside className="inv-detail-panel inv-detail-panel--empty">
        <div className="inv-detail-empty-content">
          <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "var(--inv-text-muted)" }}>
            description
          </span>
          <p>Select an invoice from the register to inspect details and sign-off workflow.</p>
        </div>
      </aside>
    );
  }

  const { account, workflow } = invoice;

  return (
    <aside className="inv-detail-panel" aria-label={`Details for invoice ${invoice.invoiceNumber}`}>
      {/* 1. Hero Header */}
      <div className="inv-detail-hero">
        <div className="inv-detail-avatar" aria-hidden="true">
          {account.initials}
        </div>
        <div className="inv-detail-title-group">
          <div className="inv-detail-name-row">
            <h3 className="inv-detail-name">{account.name}</h3>
            {account.isVerified && (
              <span
                className="material-symbols-outlined inv-verified-icon"
                title="Verified Enterprise Account"
              >
                check_circle
              </span>
            )}
          </div>
          <div className="inv-detail-meta">
            <span>{account.code}</span>
            <span className="inv-meta-sep">•</span>
            <span>GSTIN: {account.gstin}</span>
          </div>
        </div>
        <div className="inv-detail-hero-actions">
          <button
            type="button"
            className="inv-icon-btn"
            title="Export / Download PDF"
            onClick={() => onPreviewPDF(invoice)}
            aria-label="Download Invoice PDF"
          >
            <span className="material-symbols-outlined">download</span>
          </button>
          <button
            type="button"
            className="inv-icon-btn"
            title="Export CSV Data"
            onClick={() => onExportSingleCSV(invoice)}
            aria-label="Export Single Invoice Data"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
          {onClose && (
            <button
              type="button"
              className="inv-icon-btn inv-icon-btn--close"
              title="Close panel"
              onClick={onClose}
              aria-label="Close Inspector"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Status Alert Ribbon */}
      <div className="inv-status-ribbon">
        <div className="inv-ribbon-icon-pod">
          <span className="material-symbols-outlined">pending_actions</span>
        </div>
        <div className="inv-ribbon-text-group">
          <div className="inv-ribbon-title">{workflow.stepTitle}</div>
          <div className="inv-ribbon-subtitle">{workflow.stepSubtitle}</div>
        </div>
        <div className="inv-ribbon-step-pill">
          Step {workflow.currentStep}/{workflow.totalSteps}
        </div>
      </div>

      {/* 3. Subtabs: Summary, Trips, Tax & GST, Audit Trail */}
      <div className="inv-detail-nav-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "summary"}
          className={`inv-detail-nav-btn ${activeSubTab === "summary" ? "inv-detail-nav-btn--active" : ""}`}
          onClick={() => setActiveSubTab("summary")}
        >
          Summary
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "trips"}
          className={`inv-detail-nav-btn ${activeSubTab === "trips" ? "inv-detail-nav-btn--active" : ""}`}
          onClick={() => setActiveSubTab("trips")}
        >
          Trips ({invoice.tripCount})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "tax"}
          className={`inv-detail-nav-btn ${activeSubTab === "tax" ? "inv-detail-nav-btn--active" : ""}`}
          onClick={() => setActiveSubTab("tax")}
        >
          Tax & GST
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "audit"}
          className={`inv-detail-nav-btn ${activeSubTab === "audit" ? "inv-detail-nav-btn--active" : ""}`}
          onClick={() => setActiveSubTab("audit")}
        >
          Audit Trail
        </button>
      </div>

      {/* Subtab Content: SUMMARY (Default Stitch view) */}
      {activeSubTab === "summary" && (
        <>
          {/* 4. Workflow Progression Stepper */}
          <div className="inv-workflow-section">
            <div className="inv-workflow-header-row">
              <span className="inv-workflow-title">WORKFLOW PROGRESSION</span>
              <span className="inv-workflow-stat">2 of 4 Steps Complete</span>
            </div>
            <div className="inv-workflow-grid">
              {/* Step 1: Consolidated */}
              <div className="inv-step-box inv-step-box--done">
                <div className="inv-step-badge">
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check</span>
                </div>
                <div className="inv-step-content">
                  <div className="inv-step-name">1. Consolidated</div>
                  <div className="inv-step-sub">Rohan M. • 14 Oct</div>
                </div>
              </div>

              {/* Step 2: Sign-Off */}
              <div
                className={`inv-step-box ${
                  workflow.currentStep === 2
                    ? "inv-step-box--active"
                    : workflow.currentStep > 2
                    ? "inv-step-box--done"
                    : "inv-step-box--pending"
                }`}
              >
                <div className="inv-step-badge">2</div>
                <div className="inv-step-content">
                  <div className="inv-step-name">2. Sign-Off</div>
                  <div className="inv-step-sub">
                    {workflow.currentStep === 2 ? "Pending Approval" : "Approved"}
                  </div>
                </div>
              </div>

              {/* Step 3: Dispatch */}
              <div
                className={`inv-step-box ${
                  workflow.currentStep >= 3 ? "inv-step-box--done" : "inv-step-box--pending"
                }`}
              >
                <div className="inv-step-badge">
                  <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>lock</span>
                </div>
                <div className="inv-step-content">
                  <div className="inv-step-name">3. Dispatch</div>
                  <div className="inv-step-sub">WhatsApp / Email</div>
                </div>
              </div>

              {/* Step 4: Payout Match */}
              <div
                className={`inv-step-box ${
                  workflow.currentStep >= 4 ? "inv-step-box--done" : "inv-step-box--pending"
                }`}
              >
                <div className="inv-step-badge">
                  <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>lock</span>
                </div>
                <div className="inv-step-content">
                  <div className="inv-step-name">4. Payout Match</div>
                  <div className="inv-step-sub">NEFT Match</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Financial Itemization Card */}
          <div className="inv-itemization-card">
            <div className="inv-item-header">
              <span className="inv-trip-verified-pill">
                <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>check_circle</span>
                {invoice.tripCount} Trips • {invoice.podVerifiedPct}% POD Verified
              </span>
              <span className="inv-cycle-label">{account.billingCycle.split("(")[0]}</span>
            </div>

            <div className="inv-item-rows-list">
              <div className="inv-item-row">
                <span className="inv-item-label">Base Freight ({invoice.tripCount} Dispatched Routes)</span>
                <span className="inv-item-val">{invoice.baseFreightDisplay}</span>
              </div>
              <div className="inv-item-row">
                <span className="inv-item-label">Loading & Detention Surcharge</span>
                <span className="inv-item-val">{invoice.loadingDetentionDisplay}</span>
              </div>
              <div className="inv-item-row inv-item-row--subtotal">
                <span className="inv-item-label">Subtotal Taxable Value</span>
                <span className="inv-item-val">{invoice.taxableValueFullDisplay}</span>
              </div>
              <div className="inv-item-row inv-item-row--tax">
                <span className="inv-item-label">CGST (9.0%)</span>
                <span className="inv-item-val">{invoice.cgstDisplay}</span>
              </div>
              <div className="inv-item-row inv-item-row--tax">
                <span className="inv-item-label">SGST (9.0%)</span>
                <span className="inv-item-val">{invoice.sgstDisplay}</span>
              </div>
            </div>

            {/* Total Payable Box */}
            <div className="inv-total-box">
              <div className="inv-total-info">
                <div className="inv-total-label">TOTAL PAYABLE</div>
                <div className="inv-total-due-date">{account.creditTerms}</div>
              </div>
              <div className="inv-total-number">{invoice.totalAmountDisplay}</div>
            </div>

            {/* Remittance Bank Box */}
            <div className="inv-bank-box">
              <div className="inv-bank-label">Remittance Virtual Bank (HireD Auto-Reconciliation)</div>
              <div className="inv-bank-row">
                <div className="inv-bank-details">
                  HDFC Virtual A/C: <strong>{account.virtualAccount}</strong> • IFSC: <strong>{account.ifsc}</strong>
                </div>
                <button
                  type="button"
                  className="inv-copy-btn"
                  onClick={() => onCopyVirtualAccount(account.virtualAccount)}
                  title="Copy virtual account number"
                  aria-label="Copy virtual account number"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>content_copy</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Subtab Content: TRIPS BREAKDOWN */}
      {activeSubTab === "trips" && (
        <div className="inv-subtab-pane">
          <div className="inv-pane-header">
            <h4>Closed Trips Consolidated in {invoice.invoiceNumber}</h4>
            <span className="inv-pane-count">{invoice.tripCount} Trips</span>
          </div>
          <div className="inv-trips-list">
            <div className="inv-trip-item">
              <div className="inv-trip-main">
                <span className="inv-trip-id">TRP-2026-9041</span>
                <span className="inv-trip-route">Mumbai Central Hub → Pune Chakan MIDC</span>
                <span className="inv-trip-vehicle">32ft MXL (24 Tonnes)</span>
              </div>
              <div className="inv-trip-meta">
                <span className="inv-pod-badge">POD Verified</span>
                <span className="inv-trip-amt">₹78,500.00</span>
              </div>
            </div>
            <div className="inv-trip-item">
              <div className="inv-trip-main">
                <span className="inv-trip-id">TRP-2026-9042</span>
                <span className="inv-trip-route">Bhiwandi Logistics Park → Nashik Ambad</span>
                <span className="inv-trip-vehicle">24ft SXL (14 Tonnes)</span>
              </div>
              <div className="inv-trip-meta">
                <span className="inv-pod-badge">POD Verified</span>
                <span className="inv-trip-amt">₹64,200.00</span>
              </div>
            </div>
            <div className="inv-trip-item">
              <div className="inv-trip-main">
                <span className="inv-trip-id">TRP-2026-9043</span>
                <span className="inv-trip-route">JNPT Port Container Depot → Pune Bhosari</span>
                <span className="inv-trip-vehicle">40ft Flatbed (28 Tonnes)</span>
              </div>
              <div className="inv-trip-meta">
                <span className="inv-pod-badge">POD Verified</span>
                <span className="inv-trip-amt">₹92,800.00</span>
              </div>
            </div>
            <div className="inv-trips-more-note">
              + 9 additional closed trips consolidated with biometric driver sign-offs.
            </div>
          </div>
        </div>
      )}

      {/* Subtab Content: TAX & GST */}
      {activeSubTab === "tax" && (
        <div className="inv-subtab-pane">
          <div className="inv-pane-header">
            <h4>GST & E-Invoicing Compliance Parameters</h4>
            <span className="inv-hsn-pill">SAC Code: 996511</span>
          </div>
          <div className="inv-tax-grid">
            <div className="inv-tax-meta-item">
              <span className="inv-tax-meta-label">GSTIN of Supplier</span>
              <span className="inv-tax-meta-val">27AAACH8291Q1Z4 (HireD Logistics)</span>
            </div>
            <div className="inv-tax-meta-item">
              <span className="inv-tax-meta-label">GSTIN of Recipient</span>
              <span className="inv-tax-meta-val">{account.gstin}</span>
            </div>
            <div className="inv-tax-meta-item">
              <span className="inv-tax-meta-label">Place of Supply</span>
              <span className="inv-tax-meta-val">27 - Maharashtra (Intra-State)</span>
            </div>
            <div className="inv-tax-meta-item">
              <span className="inv-tax-meta-label">Reverse Charge Mechanism</span>
              <span className="inv-tax-meta-val">No (Forward Charge by GTA)</span>
            </div>
            <div className="inv-tax-meta-item">
              <span className="inv-tax-meta-label">Applicable GST Rate</span>
              <span className="inv-tax-meta-val">18% (9% CGST + 9% SGST with ITC)</span>
            </div>
            <div className="inv-tax-meta-item">
              <span className="inv-tax-meta-label">NIC E-Invoice Portal IRN Status</span>
              <span className="inv-tax-meta-val">Pending Sign-off Release</span>
            </div>
          </div>
        </div>
      )}

      {/* Subtab Content: AUDIT TRAIL */}
      {activeSubTab === "audit" && (
        <div className="inv-subtab-pane">
          <div className="inv-pane-header">
            <h4>Immutable Compliance Audit Logs</h4>
            <span className="inv-audit-pill">Audit ID: #AUD-78921</span>
          </div>
          <div className="inv-audit-timeline">
            <div className="inv-audit-entry">
              <div className="inv-audit-dot" />
              <div className="inv-audit-body">
                <div className="inv-audit-time">14 Oct 2026, 11:30 AM</div>
                <div className="inv-audit-action">Consolidated batch generated by Ops Admin Rohan M.</div>
                <div className="inv-audit-details">12 trips aggregated with 100% digital POD compliance.</div>
              </div>
            </div>
            <div className="inv-audit-entry">
              <div className="inv-audit-dot inv-audit-dot--pending" />
              <div className="inv-audit-body">
                <div className="inv-audit-time">14 Oct 2026, 11:32 AM</div>
                <div className="inv-audit-action">Two-Step Verification lock engaged.</div>
                <div className="inv-audit-details">Awaiting Sr. Finance Administrator or Operations Lead sign-off.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Action Buttons Footer */}
      <div className="inv-actions-footer">
        {/* Primary Action Button */}
        <button
          type="button"
          className="inv-approve-btn"
          onClick={() => onApprove(invoice)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>verified</span>
          Verify & Approve Invoice
        </button>

        {/* Secondary Actions 2-Button Grid */}
        <div className="inv-secondary-actions-grid">
          <button
            type="button"
            className="inv-revision-btn"
            onClick={() => onRequestRevision(invoice)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit_note</span>
            Request Revision
          </button>
          <button
            type="button"
            className="inv-preview-btn"
            onClick={() => onPreviewPDF(invoice)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>open_in_new</span>
            Preview Full PDF
          </button>
        </div>

        {/* GST Rule 46 Footnote */}
        <div className="inv-rule-footnote">
          Authorized under GST Rule 46 • IRN generation triggered upon Step 2 approval.
        </div>
      </div>
    </aside>
  );
}

InvoiceDetailPanel.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.string,
    invoiceNumber: PropTypes.string,
    date: PropTypes.string,
    period: PropTypes.string,
    tripCount: PropTypes.number,
    podVerifiedPct: PropTypes.number,
    baseFreightDisplay: PropTypes.string,
    loadingDetentionDisplay: PropTypes.string,
    taxableValueFullDisplay: PropTypes.string,
    cgstDisplay: PropTypes.string,
    sgstDisplay: PropTypes.string,
    totalAmountDisplay: PropTypes.string,
    account: PropTypes.shape({
      id: PropTypes.string,
      code: PropTypes.string,
      name: PropTypes.string,
      initials: PropTypes.string,
      gstin: PropTypes.string,
      isVerified: PropTypes.bool,
      billingCycle: PropTypes.string,
      creditTerms: PropTypes.string,
      virtualAccount: PropTypes.string,
      ifsc: PropTypes.string,
    }),
    workflow: PropTypes.shape({
      currentStep: PropTypes.number,
      totalSteps: PropTypes.number,
      stepTitle: PropTypes.string,
      stepSubtitle: PropTypes.string,
    }),
  }),
  onApprove: PropTypes.func.isRequired,
  onRequestRevision: PropTypes.func.isRequired,
  onPreviewPDF: PropTypes.func.isRequired,
  onCopyVirtualAccount: PropTypes.func.isRequired,
  onExportSingleCSV: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};
