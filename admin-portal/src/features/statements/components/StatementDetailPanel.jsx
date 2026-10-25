import { useState } from "react";
import PropTypes from "prop-types";

/**
 * StatementDetailPanel - 360° Selected Statement Inspector & Dispatcher
 * Matching Stitch Reference 11:
 * - Entity Header with SL initials pod, verified badge, GSTIN, and Net 30 pill
 * - Alert Ribbon: Statement Validated & Ready (Cycle F1)
 * - Subtabs: Summary, Trips (18), Credits Received, Audit Trail
 * - Ledger Breakdown card with opening balance, freight debits, surcharges, NEFT CMS payments, and adjustments
 * - Multi-Channel Delivery Status: Email Sent and WhatsApp Bot
 * - Virtual Escrow Remittance Coordinates: VA-HIRED-SHARMA, HDFC Bank · HDFC0000060
 * - Actions: Trigger WhatsApp & Resend Email, Preview PDF, Lock / Flag Discrepancy, GST Rule 47 note
 */
export default function StatementDetailPanel({
  statement,
  onTriggerDispatch,
  onPreviewPDF,
  onFlagDiscrepancy,
  onDownloadPDF,
  onShareWhatsApp,
}) {
  const [activeSubTab, setActiveSubTab] = useState("summary");

  if (!statement) {
    return (
      <aside className="stmt-detail-panel stmt-detail-panel--empty">
        <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "var(--stmt-text-muted)" }}>
          description
        </span>
        <p style={{ margin: "0.5rem 0 0 0", color: "var(--stmt-text-muted)", fontSize: "0.875rem" }}>
          Select a statement from the register to inspect ledger and multi-channel delivery.
        </p>
      </aside>
    );
  }

  const { entity, ledger, statusAlert } = statement;

  return (
    <aside className="stmt-detail-panel" aria-label={`Details for statement ${statement.statementNumber}`}>
      {/* 1. Header Info */}
      <div className="stmt-detail-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flex: 1 }}>
          <div className="stmt-avatar-pod" aria-hidden="true">
            {entity.initials}
          </div>
          <div className="stmt-entity-info">
            <div className="stmt-entity-title-row">
              <h3 className="stmt-entity-name">{entity.name}</h3>
              {entity.isVerified && (
                <span className="material-symbols-outlined stmt-verified-icon">verified</span>
              )}
            </div>
            <div className="stmt-entity-meta">
              <span>ID: {statement.statementNumber}</span>
              <span>•</span>
              <span>GST: {entity.gstin}</span>
              <span className="stmt-terms-pill">{entity.creditTerms}</span>
            </div>
          </div>
        </div>

        <div className="stmt-header-actions-group">
          <button
            type="button"
            className="stmt-panel-icon-btn"
            title="Download Statement PDF"
            onClick={() => onDownloadPDF(statement)}
            aria-label="Download statement PDF"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>picture_as_pdf</span>
          </button>
          <button
            type="button"
            className="stmt-panel-icon-btn"
            title="Share via WhatsApp"
            onClick={() => onShareWhatsApp(statement)}
            aria-label="Share via WhatsApp"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>share</span>
          </button>
          <button
            type="button"
            className="stmt-panel-icon-btn"
            title="More options"
            aria-label="More options"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>more_vert</span>
          </button>
        </div>
      </div>

      {/* 2. Alert Notification Ribbon */}
      <div className="stmt-alert-ribbon">
        <div className="stmt-alert-left">
          <span className="material-symbols-outlined stmt-alert-icon">check_circle</span>
          <div className="stmt-alert-text">
            <span className="stmt-alert-title">{statusAlert.title}</span>
            <span className="stmt-alert-sub">{statusAlert.subtitle}</span>
          </div>
        </div>
        <span className="stmt-alert-cycle-tag">{statusAlert.tag}</span>
      </div>

      {/* 3. Pane Subtabs */}
      <div className="stmt-nav-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "summary"}
          className={`stmt-nav-btn ${activeSubTab === "summary" ? "stmt-nav-btn--active" : ""}`}
          onClick={() => setActiveSubTab("summary")}
        >
          Summary
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "trips"}
          className={`stmt-nav-btn ${activeSubTab === "trips" ? "stmt-nav-btn--active" : ""}`}
          onClick={() => setActiveSubTab("trips")}
        >
          Trips ({statement.tripCount})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "credits"}
          className={`stmt-nav-btn ${activeSubTab === "credits" ? "stmt-nav-btn--active" : ""}`}
          onClick={() => setActiveSubTab("credits")}
        >
          Credits Received
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "audit"}
          className={`stmt-nav-btn ${activeSubTab === "audit" ? "stmt-nav-btn--active" : ""}`}
          onClick={() => setActiveSubTab("audit")}
        >
          Audit Trail
        </button>
      </div>

      {/* Subtab Content: SUMMARY */}
      {activeSubTab === "summary" && (
        <>
          {/* 4. Financial Statement Ledger Overview */}
          <div className="stmt-ledger-section">
            <div className="stmt-ledger-header-row">
              <span>Ledger Breakdown</span>
              <span>Billing Period: {statement.period}</span>
            </div>

            <div className="stmt-ledger-card">
              <div className="stmt-ledger-row">
                <span style={{ color: "var(--stmt-text-muted)" }}>Opening Balance Carried Forward</span>
                <span style={{ fontWeight: 600 }}>{ledger.openingBalanceDisplay}</span>
              </div>

              <div className="stmt-ledger-row">
                <div className="stmt-ledger-label-group">
                  <span style={{ fontWeight: 500 }}>{ledger.freightTripsLabel}</span>
                  <span className="stmt-epod-badge">{ledger.podVerifiedBadge}</span>
                </div>
                <span style={{ fontWeight: 600 }}>{ledger.freightDebitsDisplay}</span>
              </div>

              <div className="stmt-ledger-row">
                <span style={{ color: "var(--stmt-text-muted)" }}>Toll FASTag &amp; En-Route Surcharges</span>
                <span style={{ fontWeight: 600 }}>{ledger.tollSurchargesDisplay}</span>
              </div>

              <div className="stmt-ledger-row stmt-ledger-row--highlight">
                <div className="stmt-ledger-label-group">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>account_balance_wallet</span>
                  <span>{ledger.cmsPaymentRef}</span>
                </div>
                <span style={{ fontWeight: 700 }}>{ledger.cmsPaymentDisplay}</span>
              </div>

              <div className="stmt-ledger-row stmt-ledger-row--negative">
                <div className="stmt-ledger-label-group">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>swap_horiz</span>
                  <span>{ledger.claimAdjustmentRef}</span>
                </div>
                <span style={{ fontWeight: 700 }}>{ledger.claimAdjustmentDisplay}</span>
              </div>

              {/* Net Closing Balance Box */}
              <div className="stmt-closing-box">
                <div className="stmt-closing-info">
                  <span className="stmt-closing-title">Net Closing Balance Due</span>
                  <span className="stmt-closing-due">Due Date: {statement.dueDate}</span>
                </div>
                <div className="stmt-closing-amount-col">
                  <div className="stmt-closing-amount">{ledger.closingBalanceDisplay}</div>
                  <div className="stmt-closing-gst-note">{statement.gstNote}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Multi-Channel Delivery Status */}
          <div className="stmt-delivery-section">
            <span className="stmt-delivery-title">Multi-Channel Delivery Status</span>
            <div className="stmt-delivery-grid">
              {/* Email Box */}
              <div className="stmt-channel-card">
                <div className="stmt-channel-icon-pod">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>mail</span>
                </div>
                <div className="stmt-channel-content">
                  <div className="stmt-channel-status-row">
                    <span className="stmt-channel-name">Email Sent</span>
                    <span
                      className={`stmt-channel-dot ${
                        !entity.emailSent ? "stmt-channel-dot--inactive" : ""
                      }`}
                    />
                  </div>
                  <span className="stmt-channel-target">{entity.email}</span>
                  <span className="stmt-channel-time">{entity.emailStatus}</span>
                </div>
              </div>

              {/* WhatsApp Box */}
              <div className="stmt-channel-card">
                <div className="stmt-channel-icon-pod stmt-channel-icon-pod--secondary">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chat</span>
                </div>
                <div className="stmt-channel-content">
                  <div className="stmt-channel-status-row">
                    <span className="stmt-channel-name">WhatsApp Bot</span>
                    <span
                      className={`stmt-channel-dot ${
                        !entity.whatsAppSent ? "stmt-channel-dot--inactive" : ""
                      }`}
                    />
                  </div>
                  <span className="stmt-channel-target">{entity.phone}</span>
                  <span className="stmt-channel-time">{entity.whatsAppStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Virtual Escrow Remittance Coordinates */}
          <div className="stmt-remittance-card">
            <div className="stmt-remittance-header">
              <span className="stmt-remittance-title">Virtual Escrow Remittance Coordinates</span>
              <span className="stmt-auto-reconcile-tag">Auto-Reconcile Enabled</span>
            </div>
            <div className="stmt-remittance-grid">
              <div>
                <span className="stmt-coord-label">Virtual A/C No:</span>
                <span className="stmt-coord-val">{entity.virtualAccount}</span>
              </div>
              <div>
                <span className="stmt-coord-label">Bank &amp; IFSC:</span>
                <span className="stmt-coord-val">
                  {entity.bankName} · {entity.ifsc}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Subtab Content: TRIPS */}
      {activeSubTab === "trips" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--stmt-text)" }}>
            Closed Trips Consolidated in {statement.statementNumber}
          </div>
          {(!statement.trips || statement.trips.length === 0) ? (
            <div style={{ fontSize: "0.75rem", color: "var(--stmt-text-muted)", padding: "1rem 0" }}>
              No trips attached to this statement yet.
            </div>
          ) : (
            statement.trips.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: "0.5rem 0.75rem",
                  backgroundColor: "var(--stmt-card-low)",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.75rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{t.id}</div>
                  <div style={{ color: "var(--stmt-text-muted)", fontSize: "0.6875rem" }}>{t.route}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>{t.amount}</div>
                  <span
                    style={{
                      fontSize: "0.625rem",
                      color: "var(--stmt-emerald)",
                      backgroundColor: "var(--stmt-emerald-bg)",
                      padding: "0.1rem 0.35rem",
                      borderRadius: "4px",
                    }}
                  >
                    {t.podStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab Content: CREDITS */}
      {activeSubTab === "credits" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--stmt-text)" }}>
            Payments &amp; Credit Adjustments Received
          </div>
          {(!statement.credits || statement.credits.length === 0) ? (
            <div style={{ fontSize: "0.75rem", color: "var(--stmt-text-muted)", padding: "1rem 0" }}>
              No payments or credit adjustments logged for this cycle.
            </div>
          ) : (
            statement.credits.map((cr) => (
              <div
                key={cr.id}
                style={{
                  padding: "0.5rem 0.75rem",
                  backgroundColor: "var(--stmt-card-low)",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.75rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{cr.mode}</div>
                  <div style={{ color: "var(--stmt-text-muted)", fontSize: "0.6875rem" }}>
                    Ref: {cr.bankRef} · {cr.date}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "var(--stmt-primary)" }}>{cr.amount}</div>
                  <span style={{ fontSize: "0.625rem", color: "var(--stmt-text-muted)" }}>{cr.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab Content: AUDIT TRAIL */}
      {activeSubTab === "audit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.75rem" }}>
          <div style={{ fontWeight: 700, color: "var(--stmt-text)" }}>Statement Life-Cycle Audit</div>
          {statement.auditTrail && statement.auditTrail.length > 0 ? (
            statement.auditTrail.map((entry, idx) => (
              <div key={idx} style={{ padding: "0.5rem", backgroundColor: "var(--stmt-card-low)", borderRadius: "6px" }}>
                <div style={{ fontWeight: 600 }}>{entry.date} · {entry.title}</div>
                <div style={{ color: "var(--stmt-text-muted)", marginTop: "0.2rem" }}>
                  {entry.description}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "0.5rem", backgroundColor: "var(--stmt-card-low)", borderRadius: "6px" }}>
              <div style={{ fontWeight: 600 }}>{statement.date}</div>
              <div style={{ color: "var(--stmt-text-muted)" }}>
                Statement registered in system. Live ledger tracking active.
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Action Controls Footer */}
      <div className="stmt-panel-actions-footer">
        <div className="stmt-actions-row">
          <button
            type="button"
            className="stmt-dispatch-primary-btn"
            onClick={() => onTriggerDispatch(statement)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>send</span>
            Trigger WhatsApp &amp; Resend Email
          </button>
          <button
            type="button"
            className="stmt-preview-btn"
            onClick={() => onPreviewPDF(statement)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span>
            Preview PDF
          </button>
        </div>

        <div className="stmt-discrepancy-row">
          <button
            type="button"
            className="stmt-flag-btn"
            onClick={() => onFlagDiscrepancy(statement)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>flag</span>
            Lock / Flag Discrepancy
          </button>
          <span className="stmt-compliance-note">GST Rule 47 &amp; RBI Settlement Standards</span>
        </div>
      </div>
    </aside>
  );
}

StatementDetailPanel.propTypes = {
  statement: PropTypes.shape({
    id: PropTypes.string,
    statementNumber: PropTypes.string,
    period: PropTypes.string,
    tripCount: PropTypes.number,
    dueDate: PropTypes.string,
    gstNote: PropTypes.string,
    entity: PropTypes.shape({
      name: PropTypes.string,
      initials: PropTypes.string,
      gstin: PropTypes.string,
      isVerified: PropTypes.bool,
      creditTerms: PropTypes.string,
      email: PropTypes.string,
      emailStatus: PropTypes.string,
      emailSent: PropTypes.bool,
      phone: PropTypes.string,
      whatsAppStatus: PropTypes.string,
      whatsAppSent: PropTypes.bool,
      virtualAccount: PropTypes.string,
      bankName: PropTypes.string,
      ifsc: PropTypes.string,
    }),
    statusAlert: PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
      tag: PropTypes.string,
    }),
    ledger: PropTypes.shape({
      openingBalanceDisplay: PropTypes.string,
      freightDebitsDisplay: PropTypes.string,
      freightTripsLabel: PropTypes.string,
      podVerifiedBadge: PropTypes.string,
      tollSurchargesDisplay: PropTypes.string,
      cmsPaymentDisplay: PropTypes.string,
      cmsPaymentRef: PropTypes.string,
      claimAdjustmentDisplay: PropTypes.string,
      claimAdjustmentRef: PropTypes.string,
      closingBalanceDisplay: PropTypes.string,
    }),
    trips: PropTypes.arrayOf(PropTypes.object),
    credits: PropTypes.arrayOf(PropTypes.object),
  }),
  onTriggerDispatch: PropTypes.func.isRequired,
  onPreviewPDF: PropTypes.func.isRequired,
  onFlagDiscrepancy: PropTypes.func.isRequired,
  onDownloadPDF: PropTypes.func.isRequired,
  onShareWhatsApp: PropTypes.func.isRequired,
};
